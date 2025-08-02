'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, TrendingUp } from 'lucide-react'

interface CounterData {
  total: number
  today: number
  referrals: number
  referralRate: number
  lastUpdated: string
  status?: string
}

interface LiveCounterProps {
  className?: string
}

export default function LiveCounter({ className = '' }: LiveCounterProps) {
  const [data, setData] = useState<CounterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Fetch counter data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/waitlist/count')
      const result = await response.json()
      
      if (response.ok && result.data) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch counter data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Animate counter
  useEffect(() => {
    if (data) {
      const startCount = displayCount
      const endCount = data.total
      const duration = 2000 // 2 seconds
      const startTime = Date.now()

      const animateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentCount = Math.floor(startCount + (endCount - startCount) * easeOutCubic)
        
        setDisplayCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }
      
      animateCount()
    }
  }, [data])

  // Intersection Observer for visibility detection
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Fetch data immediately on mount
  useEffect(() => {
    fetchData()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading waitlist counter">
        <motion.div
          className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
        <span className="sr-only">Loading current waitlist count</span>
      </div>
    )
  }

  if (!data) return null

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Live waitlist statistics"
    >
      {/* Main Counter */}
      <div className="relative" role="banner" aria-label="Current waitlist count">
        <motion.div
          className="text-4xl md:text-6xl font-bold text-white mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          role="img"
          aria-label={`${displayCount.toLocaleString()} researchers on the waitlist`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={displayCount}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              aria-live="polite"
            >
              {displayCount.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          
          {/* Glow effect behind number */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-cyan-400/20 blur-xl"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ zIndex: -1 }}
          />
        </motion.div>

        <motion.p
          className="text-gray-300 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          id="counter-description"
        >
          researchers on the waitlist
        </motion.p>

        {/* Stats Row */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          role="group"
          aria-label="Waitlist statistics details"
        >
          {/* Today's signups */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 20 }}
            role="status"
            aria-label={`${data.today} new signups today`}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <TrendingUp className="h-4 w-4 text-green-400" aria-hidden="true" />
            </motion.div>
            <span>+{data.today} today</span>
          </motion.div>

          {/* Referral rate */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 20 }}
            role="status"
            aria-label={`${data.referralRate} percent of users were referred by others`}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              <Users className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            </motion.div>
            <span>{data.referralRate}% referred</span>
          </motion.div>

          {/* Live indicator */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 20 }}
            role="status"
            aria-label="Counter is updating live"
          >
            <motion.div
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full" aria-hidden="true" />
            </motion.div>
            <span>Live</span>
          </motion.div>
        </motion.div>

        {/* Milestone celebrations */}
        <AnimatePresence>
          {displayCount > 0 && displayCount % 1000 === 0 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Celebration particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-400"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2,
                    ease: 'easeOut',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Last updated timestamp */}
      <motion.p
        className="text-xs text-gray-500 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        role="status"
        aria-label={`Statistics last updated at ${new Date(data.lastUpdated).toLocaleTimeString()}`}
      >
        Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
      </motion.p>
    </motion.div>
  )
}