'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { AnimationErrorBoundary } from './ErrorBoundary'

// Lazy load heavy animation components
const ParticleSystem = lazy(() => import('./ParticleSystem'))
const DNAHelix = lazy(() => import('./DNAHelix'))

// Loading fallback component
function AnimationFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Minimal loading animation */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Simple loading dots */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="inline-block w-2 h-2 rounded-full bg-indigo-400/40 mx-1"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Lazy particle system with intersection observer
export function LazyParticleSystem() {
  return (
    <AnimationErrorBoundary>
      <Suspense fallback={<AnimationFallback />}>
        <ParticleSystem />
      </Suspense>
    </AnimationErrorBoundary>
  )
}

// Lazy DNA helix with intersection observer
export function LazyDNAHelix() {
  return (
    <AnimationErrorBoundary>
      <Suspense fallback={<AnimationFallback />}>
        <DNAHelix />
      </Suspense>
    </AnimationErrorBoundary>
  )
}

// Performance-optimized wrapper with intersection observer
interface LazyAnimationWrapperProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
}

export function LazyAnimationWrapper({ 
  children, 
  threshold = 0.1, 
  rootMargin = '100px' 
}: LazyAnimationWrapperProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: rootMargin, amount: threshold }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}