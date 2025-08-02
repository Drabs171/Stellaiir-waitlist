'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { buttonHover, animationConfig, prefersReducedMotion } from '@/lib/animations'

interface RippleEffect {
  id: number
  x: number
  y: number
}

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  magnetic?: boolean
  ripple?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function AnimatedButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  magnetic = true,
  ripple = true,
  className = '',
  type = 'button'
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<RippleEffect[]>()
  const [isHovered, setIsHovered] = useState(false)
  const reducedMotion = prefersReducedMotion()

  // Magnetic hover effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, animationConfig.easing.spring)
  const springY = useSpring(y, animationConfig.easing.spring)

  // Handle magnetic hover
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!magnetic || reducedMotion || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const magneticStrength = 0.3
    const deltaX = (event.clientX - centerX) * magneticStrength
    const deltaY = (event.clientY - centerY) * magneticStrength

    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  // Ripple effect
  const createRipple = (event: React.MouseEvent) => {
    if (!ripple || reducedMotion || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple: RippleEffect = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...(prev || []), newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev?.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  const handleClick = (event: React.MouseEvent) => {
    if (disabled || loading) return

    createRipple(event)
    onClick?.(event)
  }

  // Style variants
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600',
    ghost: 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-transparent hover:from-red-700 hover:to-pink-700 focus:ring-red-500'
  }

  // Touch-friendly sizes (minimum 44px height for accessibility)
  const sizes = {
    sm: 'px-4 py-3 text-sm min-h-[44px]', // 44px minimum touch target
    md: 'px-6 py-3 text-base min-h-[48px]', // 48px for better UX
    lg: 'px-8 py-4 text-lg min-h-[52px]'  // 52px for large buttons
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-lg border font-medium
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      variants={reducedMotion ? {} : buttonHover}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      style={magnetic && !reducedMotion ? { x: springX, y: springY } : {}}
    >
      {/* Loading spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          opacity: loading ? 0 : 1,
          scale: loading ? 0.8 : 1
        }}
        transition={animationConfig.easing.spring}
      >
        {children}
      </motion.span>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples?.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ 
              width: 200, 
              height: 200, 
              opacity: 0,
              transition: { duration: 0.6, ease: 'easeOut' }
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
        animate={{
          opacity: isHovered && !disabled && !loading ? 0.4 : 0,
          scale: isHovered && !disabled && !loading ? 1.1 : 1,
        }}
        transition={animationConfig.easing.spring}
      />

      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)',
          }}
          animate={isHovered ? {
            x: ['100%', '300%'],
            transition: { duration: 0.8, ease: 'easeOut' }
          } : {}}
        />
      )}
    </motion.button>
  )
}