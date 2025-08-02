'use client'

import { motion } from 'framer-motion'
import { shimmer, pulseGlow, prefersReducedMotion } from '@/lib/animations'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
  animation?: 'pulse' | 'shimmer' | 'none'
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animation = 'shimmer'
}: SkeletonProps) {
  const reducedMotion = prefersReducedMotion()
  const shouldAnimate = animation !== 'none' && !reducedMotion

  const baseClasses = "bg-gray-200 dark:bg-gray-700 relative overflow-hidden"
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  }

  const skeletonStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '2rem')
  }

  const AnimatedSkeleton = ({ className: itemClassName = '' }: { className?: string }) => (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${itemClassName}`}
      style={skeletonStyle}
      variants={shouldAnimate ? (animation === 'pulse' ? pulseGlow : {}) : {}}
      animate={shouldAnimate && animation === 'pulse' ? 'animate' : 'initial'}
    >
      {/* Shimmer effect */}
      {shouldAnimate && animation === 'shimmer' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ backgroundSize: '200% 100%' }}
          variants={shimmer}
          animate="animate"
        />
      )}
    </motion.div>
  )

  if (lines > 1 && variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <AnimatedSkeleton
            key={index}
            className={index === lines - 1 ? 'w-3/4' : ''}
          />
        ))}
      </div>
    )
  }

  return <AnimatedSkeleton className={className} />
}

// Specialized skeleton components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton variant="rectangular" height={200} />
        <div className="space-y-2">
          <Skeleton variant="text" width="75%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </motion.div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4, className = '' }: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} variant="text" width="60%" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <motion.div
            key={`row-${rowIndex}`}
            className="p-4 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                variant="text"
                width={colIndex === 0 ? '80%' : '60%'}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Chart title */}
        <Skeleton variant="text" width="40%" height={24} />
        
        {/* Chart area */}
        <div className="relative h-64">
          <Skeleton variant="rectangular" className="w-full h-full" />
          
          {/* Animated chart bars */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            {Array.from({ length: 7 }).map((_, index) => (
              <motion.div
                key={index}
                className="bg-blue-300 dark:bg-blue-600 w-8 rounded-t"
                style={{ height: `${30 + Math.random() * 60}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${30 + Math.random() * 60}%` }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.8,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton variant="circular" width={12} height={12} />
              <Skeleton variant="text" width={60} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function SkeletonStats({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="rectangular" width={24} height={16} />
          </div>
          <div>
            <Skeleton variant="text" width="60%" height={32} className="mb-2" />
            <Skeleton variant="text" width="40%" height={16} className="mb-2" />
            <Skeleton variant="text" width="80%" height={12} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40, className = '' }: { 
  size?: number
  className?: string 
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  )
}

export function SkeletonList({ items = 5, className = '' }: { 
  items?: number
  className?: string 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <SkeletonAvatar size={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="rectangular" width={80} height={32} />
        </motion.div>
      ))}
    </div>
  )
}

// Waitlist-specific skeleton components
export function WaitlistFormSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-0 space-y-6" role="status" aria-label="Loading waitlist form">
      {/* Form container */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        {/* Email input skeleton */}
        <div className="space-y-4">
          <div className="relative">
            <Skeleton variant="rounded" height="56px" animation="shimmer" />
            {/* Input icon placeholder */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Skeleton variant="circular" width="20px" height="20px" />
            </div>
          </div>
          
          {/* Submit button skeleton */}
          <Skeleton variant="rounded" height="48px" className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30" />
        </div>
      </div>
      
      {/* Trust indicators skeleton */}
      <div className="flex justify-center gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton variant="circular" width="16px" height="16px" />
            <Skeleton variant="text" width="80px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CounterSkeleton() {
  return (
    <div className="text-center space-y-4" role="status" aria-label="Loading counter">
      {/* Counter number */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 inline-block">
        <Skeleton variant="text" width="120px" height="48px" animation="pulse" />
      </div>
      
      {/* Counter label */}
      <Skeleton variant="text" width="180px" height="16px" className="mx-auto" />
    </div>
  )
}

export function FeatureCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4" role="status" aria-label="Loading feature card">
      {/* Icon */}
      <div className="flex justify-center">
        <Skeleton variant="circular" width="48px" height="48px" animation="pulse" />
      </div>
      
      {/* Title */}
      <Skeleton variant="text" height="24px" className="mx-auto" width="140px" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" lines={3} animation="shimmer" />
      </div>
    </div>
  )
}

export function FeatureSectionSkeleton() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" role="status" aria-label="Loading features section">
      <div className="max-w-7xl mx-auto">
        {/* Section title skeleton */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-6">
          <Skeleton variant="text" height="48px" width="300px" className="mx-auto" />
          <Skeleton variant="text" lines={2} className="max-w-3xl mx-auto" />
        </div>
        
        {/* Feature cards grid skeleton */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <FeatureCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function HeroSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 min-h-screen flex items-center" role="status" aria-label="Loading hero section">
      <div className="max-w-5xl mx-auto text-center w-full space-y-8">
        {/* Main headline skeleton */}
        <div className="space-y-4">
          <Skeleton variant="text" height="72px" width="400px" className="mx-auto" animation="pulse" />
          <Skeleton variant="text" height="72px" width="500px" className="mx-auto" animation="pulse" />
          <Skeleton variant="text" height="64px" width="300px" className="mx-auto" animation="pulse" />
        </div>
        
        {/* Subtitle skeleton */}
        <Skeleton variant="text" lines={2} className="max-w-4xl mx-auto" />
        
        {/* Counter skeleton */}
        <CounterSkeleton />
        
        {/* Form skeleton */}
        <WaitlistFormSkeleton />
      </div>
    </section>
  )
}

export function DNAHelixSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" role="status" aria-label="Loading DNA animation">
      {/* Main helix placeholder */}
      <div className="absolute left-1/4 top-1/2 w-32 h-96 transform -translate-y-1/2">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400/30 to-cyan-400/30"
            style={{
              left: `calc(50% + ${Math.cos((index / 8) * Math.PI * 2) * 50}px)`,
              top: `calc(50% + ${index * 40 - 160}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 rounded-full bg-indigo-400/40"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + (index % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        />
      ))}
    </div>
  )
}