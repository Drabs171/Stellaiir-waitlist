'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface EnhancedFeatureCardProps {
  icon: React.ComponentType<{ isHovered: boolean; className?: string }>
  title: string
  description: string
  delay?: number
  index: number
}

export default function EnhancedFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0,
  index 
}: EnhancedFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { ref, isInView } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px',
    triggerOnce: true,
    delay: delay * 1000,
  })

  const handleHoverStart = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovered(true)
  }, [])

  const handleHoverEnd = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
      hoverTimeoutRef.current = null
    }, 100) // Increased debounce to prevent rapid state changes
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      ref={ref as React.LegacyRef<HTMLDivElement>}
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          delay: delay,
          ease: 'easeOut'
        }
      } : {}}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* Simplified Border Animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2"
        style={{
          borderColor: index === 0 ? '#6366f1' : 
                      index === 1 ? '#22d3ee' : '#10b981',
          willChange: 'opacity'
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut'
        }}
      />

      {/* Main Card Content */}
      <motion.div
        className="relative backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl p-8 overflow-hidden"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          pointerEvents: 'auto'
        }}
        animate={isHovered ? {
          y: -4,
          scale: 1.01,
          transition: { 
            duration: 0.15,
            ease: 'easeOut'
          }
        } : {
          y: 0,
          scale: 1,
          transition: { 
            duration: 0.15,
            ease: 'easeOut'
          }
        }}
      >
        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              ${index === 0 ? 'rgba(99, 102, 241, 0.1)' : 
                index === 1 ? 'rgba(34, 211, 238, 0.1)' : 
                'rgba(16, 185, 129, 0.1)'} 0%, 
              transparent 70%)`,
            willChange: 'transform, opacity'
          }}
          animate={isHovered ? {
            scale: 1.1,
            opacity: 0.4,
          } : {
            scale: 1,
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeOut'
          }}
        />

        {/* Simplified Floating Particles */}
        {isHovered && Array.from({ length: 2 }).map((_, particleIndex) => (
          <motion.div
            key={`particle-${index}-${particleIndex}`}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              background: index === 0 ? '#6366f1' : 
                         index === 1 ? '#22d3ee' : '#10b981',
              left: `${30 + particleIndex * 20}%`,
              top: `${45 + particleIndex * 10}%`,
            }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: -30,
              scale: [0, 1, 0.5],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 1.2,
              delay: particleIndex * 0.15,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Icon Container */}
        <motion.div
          className="flex items-center justify-center w-20 h-20 mb-6 mx-auto relative"
          style={{
            willChange: 'transform'
          }}
          animate={isHovered ? {
            scale: 1.03,
          } : {
            scale: 1,
          }}
          transition={{
            duration: 0.15,
            ease: 'easeOut'
          }}
        >
          {/* Icon Background Glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-lg"
            style={{
              background: index === 0 ? 
                'linear-gradient(135deg, #6366f1, #8b5cf6)' : 
                index === 1 ? 
                'linear-gradient(135deg, #22d3ee, #06b6d4)' : 
                'linear-gradient(135deg, #10b981, #059669)',
              willChange: 'opacity'
            }}
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
            }}
            transition={{
              duration: 0.15,
              ease: 'easeOut'
            }}
          />
          
          {/* Icon Component */}
          <div className="relative z-10">
            <Icon isHovered={isHovered} className="w-12 h-12" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-2xl font-bold text-white mb-4 text-center"
          animate={isHovered ? {
            color: index === 0 ? '#a5b4fc' : 
                  index === 1 ? '#67e8f9' : '#6ee7b7',
          } : {
            color: '#ffffff'
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-gray-300 leading-relaxed text-center"
          animate={isHovered ? {
            color: '#e2e8f0',
          } : {
            color: '#d1d5db'
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {description}
        </motion.p>


        {/* Simplified Corner Indicators */}
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 rounded-full"
          style={{
            background: index === 0 ? '#6366f1' : 
                       index === 1 ? '#22d3ee' : '#10b981',
          }}
          animate={{ 
            opacity: isHovered ? 1 : 0.3,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Simplified Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px ${
            index === 0 ? 'rgba(99, 102, 241, 0.2)' : 
            index === 1 ? 'rgba(34, 211, 238, 0.2)' : 
            'rgba(16, 185, 129, 0.2)'
          }`,
          willChange: 'box-shadow'
        }}
        animate={{
          boxShadow: isHovered ? `0 0 20px 2px ${
            index === 0 ? 'rgba(99, 102, 241, 0.2)' : 
            index === 1 ? 'rgba(34, 211, 238, 0.2)' : 
            'rgba(16, 185, 129, 0.2)'
          }` : `0 0 0 1px ${
            index === 0 ? 'rgba(99, 102, 241, 0.2)' : 
            index === 1 ? 'rgba(34, 211, 238, 0.2)' : 
            'rgba(16, 185, 129, 0.2)'
          }`,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut'
        }}
      />
    </motion.div>
  )
}