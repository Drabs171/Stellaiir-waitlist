'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Brain, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EasterEggEffectsProps {
  activeEggs: string[]
  className?: string
}

const EasterEggEffects = ({ activeEggs, className = '' }: EasterEggEffectsProps) => {
  const [showKonamiMessage, setShowKonamiMessage] = useState(false)
  const [showDNAAnimation, setShowDNAAnimation] = useState(false)
  const [showGenomeSecret, setShowGenomeSecret] = useState(false)

  useEffect(() => {
    if (activeEggs.includes('konami')) {
      setShowKonamiMessage(true)
      // Show particle explosion
      setTimeout(() => setShowKonamiMessage(false), 5000)
    }
    
    if (activeEggs.includes('dna')) {
      setShowDNAAnimation(true)
      setTimeout(() => setShowDNAAnimation(false), 3000)
    }
    
    if (activeEggs.includes('genome')) {
      setShowGenomeSecret(true)
      setTimeout(() => setShowGenomeSecret(false), 4000)
    }
  }, [activeEggs])

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {/* Konami Code - Particle Explosion */}
      <AnimatePresence>
        {showKonamiMessage && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background Flash */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5 }}
            />

            {/* Message */}
            <motion.div
              className="relative bg-black/80 backdrop-blur-md border border-purple-500/50 rounded-2xl p-8 text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                Konami Code Activated!
              </h2>
              
              <p className="text-gray-300 text-lg">
                Welcome, fellow gamer! 🚀
              </p>
              
              <motion.div
                className="mt-4 text-sm text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                You&apos;ve unlocked the secret developer mode!
              </motion.div>
            </motion.div>

            {/* Particle Explosion */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`konami-particle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'][i % 4],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: (Math.cos((i / 30) * Math.PI * 2) * 300) + (Math.random() - 0.5) * 100,
                  y: (Math.sin((i / 30) * Math.PI * 2) * 300) + (Math.random() - 0.5) * 100,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2,
                  ease: 'easeOut',
                  delay: i * 0.02,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DNA Sequence - Helix Animation */}
      <AnimatePresence>
        {showDNAAnimation && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* DNA Helix */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0 }}
                transition={{ duration: 3, ease: 'easeOut' }}
                className="relative w-32 h-96"
              >
                {Array.from({ length: 20 }).map((_, index) => (
                  <motion.div
                    key={`dna-${index}`}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: index % 2 === 0 ? '#22d3ee' : '#8b5cf6',
                      left: `calc(50% + ${Math.cos((index / 20) * Math.PI * 4) * 60}px)`,
                      top: `${index * 18}px`,
                      transformOrigin: '50% 50%',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: [0, 1.5, 1],
                      rotate: 360 
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                ))}

                {/* DNA Message */}
                <motion.div
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Brain className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-cyan-300 font-bold text-lg">
                    DNA Decoded! 🧬
                  </div>
                  <div className="text-gray-400 text-sm">
                    Genetic secrets revealed
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genome Secret - Neural Network */}
      <AnimatePresence>
        {showGenomeSecret && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Neural Network Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-cyan-900/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Secret Message */}
            <motion.div
              className="relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-12 text-center max-w-lg"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -50 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <motion.div
                className="mb-6"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: 'easeInOut' 
                }}
              >
                <Brain className="h-16 w-16 text-indigo-400 mx-auto" />
              </motion.div>

              <motion.h2
                className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Genome Unlocked! 🧠
              </motion.h2>

              <motion.p
                className="text-gray-300 text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                You&apos;ve discovered the neural pathway to genetic intelligence
              </motion.p>

              <motion.div
                className="bg-black/30 rounded-lg p-4 font-mono text-sm text-green-400"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="typing-animation">
                  {'> genome.decode("ATCG") => "Life unlocked"'}
                </div>
              </motion.div>

              {/* Floating Hearts */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`heart-${i}`}
                  className="absolute"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 3) * 15}%`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    y: [20, -30, -50],
                    rotate: Math.random() * 360 
                  }}
                  transition={{
                    duration: 2,
                    delay: 1 + i * 0.2,
                    ease: 'easeOut',
                  }}
                >
                  <Heart className="h-4 w-4 text-pink-400 fill-current" />
                </motion.div>
              ))}
            </motion.div>

            {/* Neural Network Connections */}
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.line
                  key={`connection-${i}`}
                  x1={`${10 + i * 7}%`}
                  y1={`${20 + (i % 4) * 20}%`}
                  x2={`${30 + i * 5}%`}
                  y2={`${40 + (i % 3) * 15}%`}
                  stroke="url(#neuralGradient)"
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.1,
                    ease: 'easeOut' 
                  }}
                />
              ))}
              
              <defs>
                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator for Active Sequences */}
      <AnimatePresence>
        {activeEggs.length > 0 && (
          <motion.div
            className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center gap-2 text-sm text-white">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>Easter Egg Active!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .typing-animation {
          animation: typing 2s steps(30, end), blink-caret 0.75s step-end infinite;
          white-space: nowrap;
          overflow: hidden;
          border-right: 3px solid;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #10b981; }
        }
      `}</style>
    </div>
  )
}

export default EasterEggEffects