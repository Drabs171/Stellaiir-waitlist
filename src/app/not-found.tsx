'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Home, Search, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AnimatedButton from '@/components/ui/AnimatedButton'

// DNA-themed 404 error animation
function DNA404Animation() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Generate DNA strands for 404 display
  const dnaStrands = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.cos((i / 12) * Math.PI * 2) * 80,
    y: i * 30 - 150,
    delay: i * 0.1,
  }))

  return (
    <div className="relative">
      {/* Animated 404 with DNA structure */}
      <motion.div
        className="text-center relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Large 404 Text */}
        <motion.h1
          className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text relative z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          404
        </motion.h1>

        {/* DNA Helix Animation Around 404 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {dnaStrands.map((strand) => (
            <motion.div
              key={strand.id}
              className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500"
              style={{
                left: `calc(50% + ${strand.x}px)`,
                top: `calc(50% + ${strand.y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 1, 0.8],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                delay: strand.delay,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Connecting bonds */}
          {dnaStrands.slice(0, -1).map((strand, index) => (
            <motion.div
              key={`bond-${strand.id}`}
              className="absolute w-0.5 h-12 bg-gradient-to-b from-purple-400/60 to-transparent"
              style={{
                left: `calc(50% + ${strand.x}px)`,
                top: `calc(50% + ${strand.y}px)`,
                transform: `translate(-50%, -50%) rotate(${index * 15}deg)`,
                transformOrigin: 'center bottom',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 0.8],
                opacity: [0, 0.6, 0.4]
              }}
              transition={{
                duration: 1.5,
                delay: strand.delay + 0.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Floating genetic particles */}
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={`particle-${index}`}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400/60 to-cyan-400/60"
            style={{
              left: `${20 + index * 10}%`,
              top: `${30 + (index % 4) * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(index) * 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.3,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default function NotFound() {
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    // Show suggestions after a delay
    const timer = setTimeout(() => setShowSuggestions(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background DNA Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dnaPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="2" fill="currentColor" />
              <circle cx="75" cy="75" r="2" fill="currentColor" />
              <path d="M25 25 Q50 50 75 75" stroke="currentColor" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dnaPattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* DNA Animation Component */}
        <DNA404Animation />

        {/* Error Message */}
        <motion.div
          className="mt-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gene Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The genetic sequence you&apos;re looking for seems to have mutated or doesn&apos;t exist in our genome database.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <Link href="/" aria-label="Return to home page">
            <AnimatedButton
              variant="primary"
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Home className="h-5 w-5" />
              Return to Lab
            </AnimatedButton>
          </Link>

          <AnimatedButton
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-300 border-gray-600 hover:bg-white/10"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </AnimatedButton>

          <AnimatedButton
            variant="ghost"
            size="lg"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-gray-300 border-gray-600 hover:bg-white/10"
            aria-label="Reload current page"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </AnimatedButton>
        </motion.div>

        {/* Helpful Suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">
                  Suggested Genetic Pathways
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <Link 
                  href="/"
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                  aria-label="Go to waitlist signup"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300" />
                    <span className="text-white font-medium">Join Waitlist</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Sign up for early access to genetic analysis
                  </p>
                </Link>

                <div className="p-3 rounded-lg bg-white/5 opacity-75">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded bg-purple-400" />
                    <span className="text-white font-medium">Research Lab</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Coming soon - Advanced genetic research tools
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3 }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Brain className="h-5 w-5 text-indigo-400" />
            <span className="text-sm">
              Stellaiir - Error in the genetic sequence
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}