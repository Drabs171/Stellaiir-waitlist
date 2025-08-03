'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Shield, Zap } from 'lucide-react'
import AnimatedGradient from '@/components/AnimatedGradient'
import { LazyDNAHelix, LazyParticleSystem, LazyAnimationWrapper } from '@/components/LazyAnimations'
import { FormErrorBoundary } from '@/components/ErrorBoundary'
import EnhancedWaitlistForm from '@/components/EnhancedWaitlistForm'
import LiveCounter from '@/components/LiveCounter'
import AnimatedFeatureSection from '@/components/AnimatedFeatureSection'
import CountdownTimer from '@/components/CountdownTimer'
import EasterEggEffects from '@/components/EasterEggEffects'
import AudioSettings from '@/components/AudioSettings'
import NoScriptWaitlistForm from '@/components/NoScriptWaitlistForm'
import { useEasterEggs } from '@/hooks/useKonamiCode'
import { useAudioSystem } from '@/lib/audioSystem'

export default function Home() {
  // Set fixed launch date - May 15, 2025 at 12:00 PM EST
  const launchDate = new Date('2025-05-15T12:00:00-05:00')
  
  // Easter eggs system
  const { activeEggs } = useEasterEggs()
  
  // Audio system
  const { playKonamiSuccess } = useAudioSystem()
  
  // Play special sound when Konami code is activated
  useEffect(() => {
    if (activeEggs.includes('konami')) {
      playKonamiSuccess()
    }
  }, [activeEggs, playKonamiSuccess])
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Skip Navigation Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <a 
        href="#waitlist-form" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 z-50 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Skip to waitlist form
      </a>
      {/* Enhanced Background Effects */}
      <AnimatedGradient />
      <LazyAnimationWrapper threshold={0.1} rootMargin="200px">
        <LazyDNAHelix />
      </LazyAnimationWrapper>
      <LazyAnimationWrapper threshold={0.1} rootMargin="200px">
        <LazyParticleSystem />
      </LazyAnimationWrapper>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 py-4 sm:py-8" role="banner">
        <motion.nav
          className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
                      <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="h-8 w-8 text-indigo-400" />
          </motion.div>
          <span className="text-xl sm:text-2xl font-bold text-white">Stellaiir</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.div
              className="text-xs sm:text-sm text-gray-400 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 px-2 sm:px-3 py-1 rounded-full border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              role="status"
              aria-label="Platform status: Coming Soon"
            >
              Coming Soon
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AudioSettings />
            </motion.div>
          </div>
        </motion.nav>
      </header>

      {/* Enhanced Hero Section */}
      <main id="main-content" className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 min-h-screen flex items-center" role="main">
        <div className="max-w-5xl mx-auto text-center w-full">
          {/* Main Headlines */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Unlock Your
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Genetic Potential
              </motion.span>
              <motion.span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 sm:mt-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                with AI
              </motion.span>
            </motion.h1>
            
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Join the waitlist for early access to personalized health insights powered by advanced AI analysis
            </motion.p>
          </motion.div>

          {/* Live Counter */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <LiveCounter />
          </motion.div>

          {/* Enhanced Waitlist Form */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            {/* Enhanced form for JS-enabled browsers */}
            <div className="js-only waitlist-form">
              <FormErrorBoundary>
                <EnhancedWaitlistForm />
              </FormErrorBoundary>
            </div>
            
            {/* Fallback form for no-JS environments */}
            <NoScriptWaitlistForm />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-400 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: '#22d3ee' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield className="h-4 w-4" />
              </motion.div>
              <span>HIPAA Compliant</span>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: '#22d3ee' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
              <span>99.9% Accuracy</span>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05, color: '#22d3ee' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <Brain className="h-4 w-4" />
              </motion.div>
              <span>AI-Powered Analysis</span>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Countdown Timer Section */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-16" aria-labelledby="countdown-heading">
        <div className="max-w-4xl mx-auto">
          <CountdownTimer 
            targetDate={launchDate}
            title="Official Launch Countdown"
            description="Be among the first to experience revolutionary genetic analysis"
            className="mb-8"
          />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <LazyAnimationWrapper threshold={0.1} rootMargin="100px">
        <AnimatedFeatureSection />
      </LazyAnimationWrapper>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-20" aria-labelledby="cta-heading">
        <motion.div
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to unlock your genetic potential?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of researchers, clinicians, and individuals who are already using Stellaiir to transform genetic analysis.
          </p>
          {/* Enhanced form for JS-enabled browsers */}
          <div className="js-only waitlist-form">
            <FormErrorBoundary>
              <EnhancedWaitlistForm />
            </FormErrorBoundary>
          </div>
          
          {/* Fallback form for no-JS environments */}
          <NoScriptWaitlistForm />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
            <span className="text-lg sm:text-xl font-bold text-white">Stellaiir</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm px-4 sm:px-0">
            © 2024 Stellaiir. All rights reserved. Revolutionizing genetic analysis with AI.
          </p>
        </div>
      </footer>

      {/* Easter Egg Effects */}
      <EasterEggEffects activeEggs={activeEggs} />
    </div>
  )
}
