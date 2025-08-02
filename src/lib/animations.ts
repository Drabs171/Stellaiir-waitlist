// Animation configuration and utilities
import { Variants } from 'framer-motion'

// Global animation configuration
export const animationConfig = {
  // Duration presets
  durations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
  
  // Easing presets
  easing: {
    spring: { type: 'spring', damping: 25, stiffness: 120 },
    springBounce: { type: 'spring', damping: 15, stiffness: 100 },
    smooth: [0.4, 0, 0.2, 1],
    ease: [0.25, 0.1, 0.25, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  
  // Common delays
  delays: {
    stagger: 0.1,
    cascade: 0.15,
    sequence: 0.2,
  },

  // Performance optimizations
  performance: {
    // Use GPU acceleration for transforms
    willChange: 'transform, opacity',
    // Optimize for 60fps
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.3,
    },
  }
} as const

// Common animation variants (optimized for 60fps)
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    transform: 'translateY(20px) translateZ(0)',
    willChange: 'transform, opacity'
  },
  animate: { 
    opacity: 1, 
    transform: 'translateY(0px) translateZ(0)',
    transition: animationConfig.performance.transition
  },
  exit: { 
    opacity: 0, 
    transform: 'translateY(-10px) translateZ(0)',
    willChange: 'auto'
  }
}

export const fadeInDown: Variants = {
  initial: { 
    opacity: 0, 
    transform: 'translateY(-20px) translateZ(0)',
    willChange: 'transform, opacity'
  },
  animate: { 
    opacity: 1, 
    transform: 'translateY(0px) translateZ(0)',
    transition: animationConfig.performance.transition
  },
  exit: { 
    opacity: 0, 
    transform: 'translateY(10px) translateZ(0)',
    willChange: 'auto'
  }
}

export const fadeInLeft: Variants = {
  initial: { 
    opacity: 0, 
    transform: 'translateX(-20px) translateZ(0)',
    willChange: 'transform, opacity'
  },
  animate: { 
    opacity: 1, 
    transform: 'translateX(0px) translateZ(0)',
    transition: animationConfig.performance.transition
  },
  exit: { 
    opacity: 0, 
    transform: 'translateX(10px) translateZ(0)',
    willChange: 'auto'
  }
}

export const fadeInRight: Variants = {
  initial: { 
    opacity: 0, 
    transform: 'translateX(20px) translateZ(0)',
    willChange: 'transform, opacity'
  },
  animate: { 
    opacity: 1, 
    transform: 'translateX(0px) translateZ(0)',
    transition: animationConfig.performance.transition
  },
  exit: { 
    opacity: 0, 
    transform: 'translateX(-10px) translateZ(0)',
    willChange: 'auto'
  }
}

export const scaleIn: Variants = {
  initial: { 
    opacity: 0, 
    transform: 'scale(0.8) translateZ(0)',
    willChange: 'transform, opacity'
  },
  animate: { 
    opacity: 1, 
    transform: 'scale(1) translateZ(0)',
    transition: animationConfig.performance.transition
  },
  exit: { 
    opacity: 0, 
    transform: 'scale(0.9) translateZ(0)',
    willChange: 'auto'
  }
}

export const slideUp: Variants = {
  initial: { 
    transform: 'translateY(100%) translateZ(0)',
    willChange: 'transform'
  },
  animate: { 
    transform: 'translateY(0%) translateZ(0)',
    transition: animationConfig.performance.transition
  },
  exit: { 
    transform: 'translateY(100%) translateZ(0)',
    willChange: 'auto'
  }
}

// Stagger container variants
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: animationConfig.delays.stagger,
      delayChildren: 0.1
    }
  },
  exit: {
    transition: {
      staggerChildren: animationConfig.delays.stagger,
      staggerDirection: -1
    }
  }
}

export const cascadeContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: animationConfig.delays.cascade,
      delayChildren: 0.2
    }
  }
}

// Page transition variants
export const pageTransition: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: animationConfig.durations.slow,
      ease: animationConfig.easing.smooth
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.02, 
    y: -10,
    transition: {
      duration: animationConfig.durations.fast,
      ease: animationConfig.easing.smooth
    }
  }
}

// Button interaction variants
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: animationConfig.easing.spring
  },
  tap: { 
    scale: 0.95,
    transition: { duration: animationConfig.durations.fast }
  }
}

export const magneticHover: Variants = {
  initial: { x: 0, y: 0 },
  hover: { 
    x: 0, 
    y: 0,
    transition: animationConfig.easing.spring
  }
}

// Loading animation variants
export const pulseGlow: Variants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const shimmer: Variants = {
  initial: { backgroundPosition: '-200% 0%' },
  animate: {
    backgroundPosition: '200% 0%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// Form interaction variants
export const inputFocus: Variants = {
  initial: { 
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)'
  },
  focus: {
    borderColor: 'rgba(99, 102, 241, 0.6)',
    boxShadow: '0 0 20px 0 rgba(99, 102, 241, 0.3)',
    transition: animationConfig.easing.spring
  },
  error: {
    borderColor: 'rgba(239, 68, 68, 0.6)',
    boxShadow: '0 0 20px 0 rgba(239, 68, 68, 0.3)',
    transition: animationConfig.easing.spring
  }
}

// Utility functions
export const createStaggerDelay = (index: number, baseDelay = 0) => 
  baseDelay + (index * animationConfig.delays.stagger)

export const createCascadeDelay = (index: number, baseDelay = 0) => 
  baseDelay + (index * animationConfig.delays.cascade)

// Reduced motion support
export const getReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {}
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key]
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        transition: { duration: 0 }
      }
    } else {
      reducedVariants[key] = variant
    }
  })
  
  return reducedVariants
}

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}