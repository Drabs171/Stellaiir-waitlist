'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { getAnimationConfig, isMobile } from '@/lib/responsive'

interface HelixStrand {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
}

export default function DNAHelix() {
  const animConfig = getAnimationConfig()
  const isMobileDevice = isMobile()
  
  // Generate helix strands
  const helixStrands = useMemo(() => {
    const strands: HelixStrand[] = []
    // Adaptive strand count based on device capabilities
    const numStrands = animConfig.complexity === 'high' ? 8 : animConfig.complexity === 'medium' ? 6 : 4
    
    for (let i = 0; i < numStrands; i++) {
      const progress = i / numStrands
      const angle = progress * Math.PI * 4 // Two full rotations
      
      strands.push({
        id: i,
        x: Math.cos(angle) * 50,
        y: progress * 400 - 200,
        rotation: (angle * 180) / Math.PI,
        scale: 0.8 + Math.sin(angle) * 0.3,
        opacity: 0.3 + Math.sin(angle + Math.PI / 2) * 0.4,
      })
    }
    
    return strands
  }, [animConfig.complexity])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main DNA Helix Container */}
      <motion.div
        className="absolute left-1/4 top-1/2 w-32 h-96"
        style={{ transformOrigin: 'center center' }}
        animate={{
          transform: [
            'rotate(0deg) translateY(-20px) translateZ(0)',
            'rotate(180deg) translateY(20px) translateZ(0)',
            'rotate(360deg) translateY(-20px) translateZ(0)'
          ],
        }}
        transition={{
          duration: isMobileDevice ? 40 : 60,
          repeat: animConfig.complexity === 'none' ? 0 : Infinity,
          ease: 'linear',
        }}
      >
        {/* DNA Strands */}
        {helixStrands.map((strand, index) => (
          <motion.div
            key={strand.id}
            className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
            style={{
              left: `calc(50% + ${strand.x}px)`,
              top: `calc(50% + ${strand.y}px)`,
              transform: `translate(-50%, -50%) scale(${strand.scale})`,
              opacity: strand.opacity,
            }}
            animate={{
              scale: [strand.scale, strand.scale * 1.2, strand.scale],
              opacity: [strand.opacity, strand.opacity * 1.3, strand.opacity],
            }}
            transition={{
              duration: 3 + index * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          />
        ))}

        {/* Connecting bonds */}
        {helixStrands.slice(0, -1).map((strand, index) => (
          <motion.div
            key={`bond-${strand.id}`}
            className="absolute w-0.5 h-8 bg-gradient-to-b from-purple-400/40 to-transparent"
            style={{
              left: `calc(50% + ${strand.x}px)`,
              top: `calc(50% + ${strand.y}px)`,
              transform: `translate(-50%, -50%) rotate(${strand.rotation}deg)`,
              transformOrigin: 'center bottom',
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + index * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.05,
            }}
          />
        ))}
      </motion.div>

      {/* Secondary DNA Helix (mirrored) - hidden on mobile for performance */}
      {!isMobileDevice && <motion.div
        className="absolute right-1/4 top-1/3 w-24 h-80 opacity-60"
        style={{ transformOrigin: 'center center' }}
        animate={{
          rotate: [360, 0],
          y: [20, -20, 20],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          rotate: {
            duration: 45,
            repeat: Infinity,
            ease: 'linear',
          },
          y: {
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          scale: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {helixStrands.slice(0, 8).map((strand, index) => (
          <motion.div
            key={`secondary-${strand.id}`}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-300 to-purple-400"
            style={{
              left: `calc(50% + ${strand.x * 0.7}px)`,
              top: `calc(50% + ${strand.y * 0.6}px)`,
              transform: `translate(-50%, -50%) scale(${strand.scale * 0.8})`,
              opacity: strand.opacity * 0.7,
            }}
            animate={{
              scale: [strand.scale * 0.8, strand.scale * 1.1, strand.scale * 0.8],
              opacity: [strand.opacity * 0.7, strand.opacity, strand.opacity * 0.7],
            }}
            transition={{
              duration: 4 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.15,
            }}
          />
        ))}
      </motion.div>}

      {/* Floating genetic particles */}
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 rounded-full bg-indigo-400/60"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + (index % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        />
      ))}
    </div>
  )
}