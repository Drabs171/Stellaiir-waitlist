'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { getAnimationConfig, isMobile } from '@/lib/responsive'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export default function ParticleSystem() {
  const particles = useMemo(() => {
    const particleArray: Particle[] = []
    // Adaptive particle count based on device capabilities
    const animConfig = getAnimationConfig()
    const numParticles = animConfig.particles
    
    for (let i = 0; i < numParticles; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })
    }
    
    return particleArray
  }, [])

  const animConfig = getAnimationConfig()
  const isMobileDevice = isMobile()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-indigo-400/30 to-cyan-400/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            transform: [
              'translateY(0px) translateX(0px) scale(1) translateZ(0)',
              `translateY(-50px) translateX(${Math.sin(particle.id) * 20}px) scale(1.5) translateZ(0)`,
              'translateY(0px) translateX(0px) scale(1) translateZ(0)'
            ],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: isMobileDevice ? particle.duration * 0.5 : particle.duration,
            repeat: animConfig.complexity === 'none' ? 0 : Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Molecular structure particles - simplified for mobile */}
      {!isMobileDevice && Array.from({ length: animConfig.complexity === 'high' ? 8 : 4 }).map((_, index) => (
        <motion.div
          key={`molecule-${index}`}
          className="absolute"
          style={{
            left: `${15 + index * 12}%`,
            top: `${20 + (index % 4) * 15}%`,
          }}
        >
          {/* Central atom */}
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-400/50 relative"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.3,
            }}
          >
            {/* Electron orbits */}
            {[0, 120, 240].map((angle, orbitIndex) => (
              <motion.div
                key={orbitIndex}
                className="absolute w-1 h-1 rounded-full bg-cyan-300/60"
                style={{ transformOrigin: '4px 4px' }}
                animate={{
                  rotate: [angle, angle + 360],
                }}
                transition={{
                  duration: 6 + orbitIndex,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div 
                  className="absolute w-1 h-1 rounded-full bg-cyan-300/60"
                  style={{ transform: 'translate(8px, 0)' }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}

      {/* Data stream particles - reduced for mobile */}
      {Array.from({ length: isMobileDevice ? 6 : 12 }).map((_, index) => (
        <motion.div
          key={`data-${index}`}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-indigo-300/40 to-transparent"
          style={{
            left: `${5 + index * 8}%`,
            top: `${10 + (index % 3) * 30}%`,
            transform: `rotate(${index * 15}deg)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -100],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: index * 0.5,
          }}
        />
      ))}

      {/* Genetic code visualization */}
      <div className="absolute bottom-10 left-10 opacity-30">
        {['A', 'T', 'G', 'C', 'A', 'T'].map((base, index) => (
          <motion.span
            key={`base-${index}`}
            className="inline-block text-sm font-mono text-cyan-300 mx-1"
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          >
            {base}
          </motion.span>
        ))}
      </div>

      {/* Neural network nodes */}
      <div className="absolute top-1/4 right-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={`node-${index}`}
            className="absolute w-1 h-1 rounded-full bg-indigo-400/50"
            style={{
              left: (index % 3) * 20,
              top: Math.floor(index / 3) * 30,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.4,
            }}
          >
            {/* Connection lines */}
            {index < 3 && (
              <motion.div
                className="absolute w-20 h-0.5 bg-gradient-to-r from-indigo-400/20 to-transparent"
                style={{ top: '50%', left: '100%' }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scaleX: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.3,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}