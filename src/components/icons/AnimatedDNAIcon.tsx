'use client'

import { motion } from 'framer-motion'

interface AnimatedDNAIconProps {
  isHovered: boolean
  className?: string
}

export default function AnimatedDNAIcon({ isHovered, className = "w-8 h-8" }: AnimatedDNAIconProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* DNA Helix Strands */}
        <motion.path
          d="M20 10 Q50 25 80 40 Q50 55 20 70 Q50 85 80 100"
          stroke="url(#dnaGradient1)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            pathLength: isHovered ? [0, 1] : 1,
            opacity: isHovered ? [0.5, 1] : 0.8,
          }}
          transition={{
            pathLength: { duration: 2, ease: "easeInOut" },
            opacity: { duration: 0.5 },
          }}
        />
        
        <motion.path
          d="M80 10 Q50 25 20 40 Q50 55 80 70 Q50 85 20 100"
          stroke="url(#dnaGradient2)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            pathLength: isHovered ? [0, 1] : 1,
            opacity: isHovered ? [0.5, 1] : 0.8,
          }}
          transition={{
            pathLength: { duration: 2, ease: "easeInOut", delay: 0.2 },
            opacity: { duration: 0.5 },
          }}
        />

        {/* Base Pairs */}
        {[20, 35, 50, 65, 80].map((y, index) => (
          <motion.g key={index}>
            <motion.line
              x1="25"
              y1={y}
              x2="75"
              y2={y}
              stroke="url(#basePairGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                opacity: isHovered ? [0.3, 0.8, 0.3] : 0.4,
                scaleX: isHovered ? [0.8, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                delay: index * 0.1,
              }}
            />
            
            {/* Base pair nodes */}
            <motion.circle
              cx="25"
              cy={y}
              r="2"
              fill="url(#nodeGradient1)"
              animate={{
                scale: isHovered ? [1, 1.5, 1] : 1,
                opacity: isHovered ? [0.6, 1, 0.6] : 0.7,
              }}
              transition={{
                duration: 1,
                repeat: isHovered ? Infinity : 0,
                delay: index * 0.15,
              }}
            />
            
            <motion.circle
              cx="75"
              cy={y}
              r="2"
              fill="url(#nodeGradient2)"
              animate={{
                scale: isHovered ? [1, 1.5, 1] : 1,
                opacity: isHovered ? [0.6, 1, 0.6] : 0.7,
              }}
              transition={{
                duration: 1,
                repeat: isHovered ? Infinity : 0,
                delay: index * 0.15 + 0.1,
              }}
            />
          </motion.g>
        ))}

        {/* Floating particles */}
        {isHovered && Array.from({ length: 8 }).map((_, index) => (
          <motion.circle
            key={`particle-${index}`}
            cx={20 + Math.random() * 60}
            cy={10 + Math.random() * 80}
            r="1"
            fill="url(#particleGradient)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="dnaGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          
          <linearGradient id="dnaGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          <linearGradient id="basePairGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
          </linearGradient>
          
          <radialGradient id="nodeGradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </radialGradient>
          
          <radialGradient id="nodeGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          
          <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </radialGradient>
        </defs>
      </svg>

      {/* Rotating background glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-lg"
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.8 : 0.3,
        }}
        transition={{
          rotate: { duration: 3, repeat: isHovered ? Infinity : 0, ease: "linear" },
          scale: { duration: 0.5 },
          opacity: { duration: 0.5 },
        }}
      />
    </div>
  )
}