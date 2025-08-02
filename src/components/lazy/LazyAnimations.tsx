'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Lazy load heavy animation components
export const LazyParticleSystem = dynamic(
  () => import('../ParticleSystem'),
  {
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 animate-pulse" />
    ),
    ssr: false
  }
)

export const LazyDNAHelix = dynamic(
  () => import('../DNAHelix'),
  {
    loading: () => (
      <div className="h-64 w-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full animate-pulse" />
    ),
    ssr: false
  }
)

export const LazyAnimatedGradient = dynamic(
  () => import('../AnimatedGradient'),
  {
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" />
    ),
    ssr: false
  }
)

export const LazyEasterEggEffects = dynamic(
  () => import('../EasterEggEffects'),
  {
    loading: () => null,
    ssr: false
  }
)

// Intersection observer based lazy loading
export const LazyAnimatedFeatureSection = dynamic(
  () => import('../AnimatedFeatureSection'),
  {
    loading: () => (
      <div className="h-96 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-lg animate-pulse" />
    ),
    ssr: false
  }
)

// Performance optimized versions with reduced complexity for mobile
export const OptimizedParticleSystem = dynamic(
  () => import('../ParticleSystem').then(mod => {
    // Wrap component to reduce particles on mobile
    const Component = mod.default
    return (props: any) => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      return isMobile ? null : <Component {...props} />
    }
  }),
  {
    loading: () => null,
    ssr: false
  }
)

export default {
  LazyParticleSystem,
  LazyDNAHelix,
  LazyAnimatedGradient,
  LazyEasterEggEffects,
  LazyAnimatedFeatureSection,
  OptimizedParticleSystem
}