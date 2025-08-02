'use client'

import React, { lazy, Suspense, ComponentType } from 'react'
import { motion } from 'framer-motion'

interface LazyLoaderProps {
  children?: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

// Default loading skeleton
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={`animate-pulse ${className || ''}`}>
    <div className="h-full w-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg" />
  </div>
)

// Intersection Observer hook for lazy loading
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, threshold])

  return { ref: setRef, isVisible }
}

// Lazy component wrapper with intersection observer
export function LazyComponent<P extends object>({
  component: Component,
  fallback,
  threshold = 0.1,
  ...props
}: {
  component: ComponentType<P>
  fallback?: React.ReactNode
  threshold?: number
} & P) {
  const { ref, isVisible } = useLazyLoad(threshold)

  return (
    <div ref={ref} className="w-full h-full">
      {isVisible ? (
        <Suspense fallback={fallback || <DefaultFallback />}>
          <Component {...(props as P)} />
        </Suspense>
      ) : (
        fallback || <DefaultFallback />
      )}
    </div>
  )
}

// Lazy wrapper for any component
export default function LazyLoader({ 
  children, 
  fallback, 
  className 
}: LazyLoaderProps) {
  const { ref, isVisible } = useLazyLoad()

  return (
    <motion.div 
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {isVisible ? children : (fallback || <DefaultFallback className={className} />)}
    </motion.div>
  )
}