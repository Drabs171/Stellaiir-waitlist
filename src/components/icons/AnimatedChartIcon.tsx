'use client'

import { motion } from 'framer-motion'

interface AnimatedChartIconProps {
  isHovered: boolean
  className?: string
}

export default function AnimatedChartIcon({ isHovered, className = "w-8 h-8" }: AnimatedChartIconProps) {
  const barData = [
    { height: 60, delay: 0 },
    { height: 80, delay: 0.1 },
    { height: 45, delay: 0.2 },
    { height: 90, delay: 0.3 },
    { height: 70, delay: 0.4 },
  ]

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chart Background */}
        <motion.rect
          x="10"
          y="20"
          width="80"
          height="60"
          rx="4"
          fill="url(#chartBg)"
          stroke="url(#chartBorder)"
          strokeWidth="1"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Grid Lines */}
        {[30, 45, 60].map((y, index) => (
          <motion.line
            key={index}
            x1="15"
            y1={y}
            x2="85"
            y2={y}
            stroke="url(#gridGradient)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            animate={{
              opacity: isHovered ? 0.6 : 0.2,
              pathLength: isHovered ? 1 : 0.5,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
            }}
          />
        ))}

        {/* Animated Data Bars */}
        {barData.map((bar, index) => (
          <motion.rect
            key={index}
            x={20 + index * 12}
            y={75 - bar.height * 0.6}
            width="8"
            height={bar.height * 0.6}
            rx="2"
            fill="url(#barGradient)"
            initial={{ scaleY: 0, y: 75 }}
            animate={{
              scaleY: isHovered ? [0, 1.2, 1] : 1,
              y: isHovered ? [75, 75 - bar.height * 0.7, 75 - bar.height * 0.6] : 75 - bar.height * 0.6,
            }}
            transition={{
              duration: 1,
              delay: isHovered ? bar.delay : 0,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "bottom" }}
          />
        ))}

        {/* Data Points and Connecting Line */}
        <motion.path
          d="M24 55 L36 40 L48 62 L60 25 L72 45"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            pathLength: isHovered ? [0, 1] : 1,
            opacity: isHovered ? [0.5, 1] : 0.7,
          }}
          transition={{
            pathLength: { duration: 1.5, ease: "easeInOut" },
            opacity: { duration: 0.5 },
          }}
        />

        {/* Data Point Circles */}
        {[
          { x: 24, y: 55 },
          { x: 36, y: 40 },
          { x: 48, y: 62 },
          { x: 60, y: 25 },
          { x: 72, y: 45 },
        ].map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2"
            fill="url(#pointGradient)"
            animate={{
              scale: isHovered ? [1, 2, 1.5] : 1,
              opacity: isHovered ? [0.6, 1, 0.8] : 0.8,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Floating Analysis Particles */}
        {isHovered && Array.from({ length: 6 }).map((_, index) => (
          <motion.g key={`analysis-${index}`}>
            <motion.circle
              cx={30 + index * 10}
              cy={85}
              r="1"
              fill="url(#analysisParticle)"
              initial={{ opacity: 0, y: 85 }}
              animate={{
                opacity: [0, 1, 0],
                y: [85, 15, 10],
                scale: [0.5, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeOut",
              }}
            />
          </motion.g>
        ))}

        {/* Progress Indicator */}
        <motion.rect
          x="15"
          y="85"
          width="70"
          height="3"
          rx="1.5"
          fill="url(#progressBg)"
        />
        
        <motion.rect
          x="15"
          y="85"
          width="0"
          height="3"
          rx="1.5"
          fill="url(#progressFill)"
          animate={{
            width: isHovered ? [0, 70, 70] : 35,
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />

        {/* Gradients and Definitions */}
        <defs>
          <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="chartBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          
          <radialGradient id="pointGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </radialGradient>
          
          <linearGradient id="analysisParticle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          <linearGradient id="progressBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          
          <linearGradient id="progressFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg"
        animate={{
          scale: isHovered ? 1.3 : 1,
          opacity: isHovered ? 0.8 : 0.3,
        }}
        transition={{
          duration: 0.5,
        }}
      />
    </div>
  )
}