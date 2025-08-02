'use client'

// Responsive breakpoints and utilities
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

// Device detection utilities
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < breakpoints.sm) return 'mobile'
  if (width < breakpoints.lg) return 'tablet'
  return 'desktop'
}

export const isMobile = () => getDeviceType() === 'mobile'
export const isTablet = () => getDeviceType() === 'tablet'
export const isDesktop = () => getDeviceType() === 'desktop'

// Touch device detection
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Network-aware loading
export const getConnectionSpeed = () => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown'
  }
  
  const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection
  if (!connection) return 'unknown'
  
  const effectiveType = connection.effectiveType
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return 'slow'
    case '3g':
      return 'medium'
    case '4g':
      return 'fast'
    default:
      return 'unknown'
  }
}

// Animation configuration based on device capabilities
export const getAnimationConfig = () => {
  const deviceType = getDeviceType()
  const connectionSpeed = getConnectionSpeed()
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReducedMotion) {
    return {
      duration: 0,
      particles: 0,
      complexity: 'none' as const,
    }
  }
  
  if (deviceType === 'mobile' || connectionSpeed === 'slow') {
    return {
      duration: 0.2,
      particles: 10,
      complexity: 'low' as const,
    }
  }
  
  if (deviceType === 'tablet' || connectionSpeed === 'medium') {
    return {
      duration: 0.3,
      particles: 20,
      complexity: 'medium' as const,
    }
  }
  
  return {
    duration: 0.5,
    particles: 30,
    complexity: 'high' as const,
  }
}

// Responsive spacing utilities
export const getResponsiveSpacing = (base: number) => {
  const deviceType = getDeviceType()
  switch (deviceType) {
    case 'mobile':
      return {
        x: Math.max(16, base * 0.5),
        y: Math.max(12, base * 0.6),
      }
    case 'tablet':
      return {
        x: Math.max(24, base * 0.75),
        y: Math.max(20, base * 0.8),
      }
    default:
      return {
        x: base,
        y: base,
      }
  }
}

// Font size optimization
export const getOptimalFontSize = (baseSize: number) => {
  const deviceType = getDeviceType()
  switch (deviceType) {
    case 'mobile':
      return Math.max(16, baseSize * 0.875) // Minimum 16px for no zoom
    case 'tablet':
      return baseSize * 0.9375
    default:
      return baseSize
  }
}