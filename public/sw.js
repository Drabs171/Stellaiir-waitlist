// Service Worker for Stellaiir Waitlist
// Provides offline functionality, caching, and background sync

const CACHE_NAME = 'stellaiir-waitlist-v1'
const STATIC_CACHE = 'stellaiir-static-v1'
const RUNTIME_CACHE = 'stellaiir-runtime-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/not-found',
  '/_next/static/css/critical.css',
]

// Runtime cacheable routes
const CACHEABLE_ROUTES = [
  '/api/waitlist/count',
  '/_next/static/',
  '/images/',
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker')
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event
  const { url, method } = request
  
  // Only handle GET requests
  if (method !== 'GET') {
    return
  }
  
  // Handle different types of requests
  if (url.includes('/api/waitlist') && !url.includes('/count')) {
    // Handle waitlist submissions with background sync
    event.respondWith(handleWaitlistSubmission(request))
  } else if (isStaticAsset(url)) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request))
  } else if (isCacheableRoute(url)) {
    // Runtime cacheable - stale while revalidate
    event.respondWith(staleWhileRevalidate(request))
  } else {
    // Network first for everything else
    event.respondWith(networkFirst(request))
  }
})

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'waitlist-submission') {
    event.waitUntil(processQueuedSubmissions())
  }
})

// Push notifications (if needed in the future)
self.addEventListener('push', event => {
  console.log('[SW] Push message received')
  
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: 'stellaiir-notification',
      data: data.url ? { url: data.url } : undefined
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked')
  
  event.notification.close()
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})

// Helper functions

function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('/_next/static/') ||
         url.includes('/favicon') ||
         url.includes('/manifest') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.woff') ||
         url.includes('.woff2')
}

function isCacheableRoute(url) {
  return CACHEABLE_ROUTES.some(route => url.includes(route))
}

// Cache first strategy - for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('[SW] Cache first error:', error)
    return new Response('Offline - Asset not available', { status: 503 })
  }
}

// Network first strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || 
             new Response('Offline - Please check your connection', { 
               status: 503,
               headers: { 'Content-Type': 'text/plain' }
             })
    }
    
    return new Response('Offline', { status: 503 })
  }
}

// Stale while revalidate - for semi-dynamic content
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cachedResponse = await cache.match(request)
  
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => cachedResponse)
  
  return cachedResponse || networkResponsePromise
}

// Handle waitlist submissions with offline support
async function handleWaitlistSubmission(request) {
  try {
    // Try network first
    const response = await fetch(request)
    return response
  } catch (error) {
    // If network fails, queue for background sync
    console.log('[SW] Queueing waitlist submission for background sync')
    
    // Store submission data
    const formData = await request.formData()
    const submissionData = {
      email: formData.get('email'),
      timestamp: Date.now(),
      url: request.url
    }
    
    // Store in IndexedDB (simplified approach using localStorage fallback)
    try {
      const existingQueue = JSON.parse(localStorage.getItem('waitlist-queue') || '[]')
      existingQueue.push(submissionData)
      localStorage.setItem('waitlist-queue', JSON.stringify(existingQueue))
      
      // Register for background sync
      self.registration.sync.register('waitlist-submission')
    } catch (storageError) {
      console.error('[SW] Failed to queue submission:', storageError)
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      message: 'Your submission has been queued and will be processed when you\'re back online.',
      queued: true
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Process queued submissions when back online
async function processQueuedSubmissions() {
  try {
    const queuedSubmissions = JSON.parse(localStorage.getItem('waitlist-queue') || '[]')
    
    if (queuedSubmissions.length === 0) {
      return
    }
    
    console.log('[SW] Processing', queuedSubmissions.length, 'queued submissions')
    
    const processed = []
    
    for (const submission of queuedSubmissions) {
      try {
        const formData = new FormData()
        formData.append('email', submission.email)
        
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          processed.push(submission)
          console.log('[SW] Successfully processed queued submission:', submission.email)
          
          // Show success notification
          self.registration.showNotification('Stellaiir Waitlist', {
            body: 'Your waitlist submission has been processed!',
            icon: '/icon-192.png',
            tag: 'submission-success'
          })
        }
      } catch (error) {
        console.error('[SW] Failed to process queued submission:', error)
      }
    }
    
    // Remove processed submissions
    if (processed.length > 0) {
      const remaining = queuedSubmissions.filter(sub => !processed.includes(sub))
      localStorage.setItem('waitlist-queue', JSON.stringify(remaining))
    }
    
  } catch (error) {
    console.error('[SW] Error processing queued submissions:', error)
  }
}

// Utility function to broadcast messages to clients
function broadcastMessage(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message)
    })
  })
}