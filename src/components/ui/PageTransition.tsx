'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { pageTransition, staggerContainer, prefersReducedMotion } from '@/lib/animations'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const reducedMotion = prefersReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={reducedMotion ? {} : pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function StaggerContainer({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number 
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      className={className}
      variants={reducedMotion ? {} : staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ '--delay': `${delay}s` } as React.CSSProperties}
    >
      {children}
    </motion.div>
  )
}

export function FadeInWhenVisible({ 
  children, 
  className = '',
  delay = 0,
  threshold = 0.1,
  once = true
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  )
}