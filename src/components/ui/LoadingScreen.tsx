'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Brain } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/animations'

interface LoadingScreenProps {
  isVisible: boolean
  message?: string
  variant?: 'splash' | 'inline' | 'overlay'
}

export default function LoadingScreen({ 
  isVisible, 
  message = 'Loading...', 
  variant = 'splash' 
}: LoadingScreenProps) {
  const reducedMotion = prefersReducedMotion()

  if (variant === 'inline') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="flex items-center justify-center p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <DNALoader size="md" />
              <motion.p
                className="mt-4 text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  if (variant === 'overlay') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-center">
                <DNALoader size="lg" />
                <motion.p
                  className="mt-4 text-gray-900 dark:text-white font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {message}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Splash screen variant
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="text-center relative z-10">
            {/* Logo with pulse effect */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1,
                ease: [0.68, -0.55, 0.265, 1.55]
              }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-2xl shadow-2xl"
                animate={reducedMotion ? {} : {
                  boxShadow: [
                    '0 0 30px rgba(99, 102, 241, 0.3)',
                    '0 0 60px rgba(99, 102, 241, 0.6)',
                    '0 0 30px rgba(99, 102, 241, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <motion.div
                  animate={reducedMotion ? {} : { rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Stellaiir
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-xl text-indigo-200 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Unlocking Genetic Potential
            </motion.p>

            {/* DNA Loader */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <DNALoader size="lg" />
            </motion.div>

            {/* Loading message */}
            <motion.p
              className="mt-6 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// DNA Loader Component
function DNALoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const reducedMotion = prefersReducedMotion()
  
  const sizes = {
    sm: { container: 'w-12 h-16', dot: 'w-2 h-2' },
    md: { container: 'w-16 h-20', dot: 'w-3 h-3' },
    lg: { container: 'w-20 h-24', dot: 'w-4 h-4' }
  }

  return (
    <div className={`relative mx-auto ${sizes[size].container}`}>
      {/* DNA Helix */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${sizes[size].dot} bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full`}
          style={{
            left: '50%',
            top: `${(i / 7) * 100}%`,
          }}
          animate={reducedMotion ? {} : {
            x: [
              Math.sin((i / 7) * Math.PI * 4) * 20,
              Math.sin((i / 7) * Math.PI * 4 + Math.PI) * 20,
              Math.sin((i / 7) * Math.PI * 4) * 20
            ],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Center line */}
      <motion.div
        className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-indigo-400/30 to-cyan-400/30 transform -translate-x-1/2"
        animate={reducedMotion ? {} : {
          scaleY: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Connecting bonds */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`bond-${i}`}
          className="absolute w-8 h-0.5 bg-gradient-to-r from-indigo-400/50 to-cyan-400/50"
          style={{
            left: '50%',
            top: `${((i + 0.5) / 4) * 100}%`,
            transformOrigin: 'center',
          }}
          animate={reducedMotion ? {} : {
            scaleX: [0.5, 1, 0.5],
            rotate: [0, 5, -5, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

export { DNALoader }