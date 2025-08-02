interface RequestTimestamp {
  timestamp: number
  fingerprint: string
}

interface RateLimitEntry {
  requests: RequestTimestamp[]
  blockedUntil?: number
  violationCount: number
  lastRequest: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const fingerprintMap = new Map<string, Set<string>>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  
  for (const [key, entry] of rateLimitMap.entries()) {
    // Remove old requests from sliding window
    entry.requests = entry.requests.filter(req => now - req.timestamp < maxAge)
    
    // Remove entry if no recent requests and not blocked
    if (entry.requests.length === 0 && (!entry.blockedUntil || now > entry.blockedUntil)) {
      rateLimitMap.delete(key)
    }
  }
  
  // Clean up fingerprint map
  for (const [fingerprint, ips] of fingerprintMap.entries()) {
    const hasActiveIPs = Array.from(ips).some(ip => rateLimitMap.has(ip))
    if (!hasActiveIPs) {
      fingerprintMap.delete(fingerprint)
    }
  }
}, 300000) // Run cleanup every 5 minutes

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  blockDuration?: number
}

export const RATE_LIMIT_CONFIGS = {
  // Standard rate limit for most IPs
  standard: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 requests per minute
    blockDuration: 300 * 1000 // 5 minute block after exceeding
  },
  
  // Stricter limit for suspicious patterns
  strict: {
    windowMs: 60 * 1000, // 1 minute  
    maxRequests: 1, // 1 request per minute
    blockDuration: 900 * 1000 // 15 minute block
  },
  
  // More lenient for trusted networks (if needed)
  lenient: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
    blockDuration: 60 * 1000 // 1 minute block
  }
}

export function getRateLimitConfig(ip: string): RateLimitConfig {
  // Check for localhost/development
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') {
    return RATE_LIMIT_CONFIGS.lenient
  }
  
  // Check for private network ranges (more lenient)
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./
  ]
  
  if (privateRanges.some(range => range.test(ip))) {
    return RATE_LIMIT_CONFIGS.lenient
  }
  
  // Check violation history for stricter limits
  const entry = rateLimitMap.get(ip)
  if (entry && entry.violationCount > 2) {
    return RATE_LIMIT_CONFIGS.strict
  }
  
  return RATE_LIMIT_CONFIGS.standard
}

// Generate request fingerprint from headers
export function generateFingerprint(request: Request): string {
  const headers = request.headers
  const userAgent = headers.get('user-agent') || ''
  const acceptLanguage = headers.get('accept-language') || ''
  const acceptEncoding = headers.get('accept-encoding') || ''
  const dnt = headers.get('dnt') || ''
  
  // Create a hash of identifying characteristics
  const fingerprint = Buffer.from(`${userAgent}:${acceptLanguage}:${acceptEncoding}:${dnt}`)
    .toString('base64')
    .substring(0, 16)
  
  return fingerprint
}

// Check for suspicious patterns
function isSuspiciousActivity(ip: string, fingerprint: string): boolean {
  // Check if this fingerprint is associated with multiple IPs
  if (!fingerprintMap.has(fingerprint)) {
    fingerprintMap.set(fingerprint, new Set([ip]))
  } else {
    fingerprintMap.get(fingerprint)!.add(ip)
    
    // Suspicious if same fingerprint from many different IPs
    if (fingerprintMap.get(fingerprint)!.size > 5) {
      return true
    }
  }
  
  // Check if IP has multiple different fingerprints (possible proxy/bot)
  const entry = rateLimitMap.get(ip)
  if (entry) {
    const uniqueFingerprints = new Set(entry.requests.map(r => r.fingerprint))
    if (uniqueFingerprints.size > 3) {
      return true
    }
  }
  
  return false
}

export function checkRateLimit(ip: string, request?: Request): { allowed: boolean; remainingRequests?: number; resetTime?: number; retryAfter?: number; reason?: string } {
  const now = Date.now()
  const fingerprint = request ? generateFingerprint(request) : 'unknown'
  const config = getRateLimitConfig(ip)
  
  // Initialize entry if not exists
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      requests: [],
      violationCount: 0,
      lastRequest: now
    })
  }

  const entry = rateLimitMap.get(ip)!
  
  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      reason: 'blocked'
    }
  }
  
  // Clear block if expired
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    entry.blockedUntil = undefined
  }

  // Remove old requests (sliding window)
  entry.requests = entry.requests.filter(req => now - req.timestamp < config.windowMs)
  
  // Check for suspicious activity
  const suspicious = isSuspiciousActivity(ip, fingerprint)
  if (suspicious && entry.violationCount > 0) {
    // Apply stricter limits for suspicious activity
    config.maxRequests = Math.max(1, Math.floor(config.maxRequests / 2))
  }
  
  // Check current request count in window
  const currentCount = entry.requests.length
  
  if (currentCount >= config.maxRequests) {
    // Rate limit exceeded
    entry.violationCount++
    entry.lastRequest = now
    
    // Calculate block duration based on violation count
    let blockDuration = config.blockDuration || (config.windowMs * 2)
    if (entry.violationCount > 1) {
      blockDuration *= Math.min(entry.violationCount, 5) // Max 5x multiplier
    }
    if (suspicious) {
      blockDuration *= 2 // Double penalty for suspicious activity
    }
    
    entry.blockedUntil = now + blockDuration
    
    return {
      allowed: false,
      retryAfter: Math.ceil(blockDuration / 1000),
      reason: suspicious ? 'suspicious' : 'rate_limited'
    }
  }

  // Allow request
  entry.requests.push({
    timestamp: now,
    fingerprint
  })
  entry.lastRequest = now
  
  const remaining = config.maxRequests - entry.requests.length
  const resetTime = entry.requests.length > 0 
    ? entry.requests[0].timestamp + config.windowMs
    : now + config.windowMs
  
  return {
    allowed: true,
    remainingRequests: remaining,
    resetTime
  }
}

export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const headers = request.headers
  
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP from the list
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  const cfConnectingIP = headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  const xClientIP = headers.get('x-client-ip')
  if (xClientIP) {
    return xClientIP.trim()
  }
  
  return 'unknown'
}