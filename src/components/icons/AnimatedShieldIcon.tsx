'use client'

import { motion } from 'framer-motion'

interface AnimatedShieldIconProps {
  isHovered: boolean
  className?: string
}

export default function AnimatedShieldIcon({ isHovered, className = "w-8 h-8" }: AnimatedShieldIconProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Shield Shape */}
        <motion.path
          d="M50 10 L25 25 L25 55 Q25 75 50 85 Q75 75 75 55 L75 25 Z"
          fill="url(#shieldGradient)"
          stroke="url(#shieldBorder)"
          strokeWidth="2"
          animate={{
            scale: isHovered ? [1, 1.05, 1] : 1,
            opacity: isHovered ? [0.8, 1, 0.9] : 0.8,
          }}
          transition={{
            duration: 1,
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse",
          }}
        />

        {/* Inner Shield Layers for Depth */}
        <motion.path
          d="M50 18 L32 28 L32 52 Q32 68 50 76 Q68 68 68 52 L68 28 Z"
          fill="url(#innerShieldGradient)"
          animate={{
            opacity: isHovered ? [0.3, 0.6, 0.4] : 0.4,
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse",
          }}
        />

        {/* Lock Icon in Center */}
        <motion.g
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          {/* Lock Body */}
          <motion.rect
            x="42"
            y="48"
            width="16"
            height="12"
            rx="2"
            fill="url(#lockGradient)"
            animate={{
              y: isHovered ? [48, 46, 48] : 48,
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
          
          {/* Lock Shackle */}
          <motion.path
            d="M46 48 L46 42 Q46 38 50 38 Q54 38 54 42 L54 48"
            stroke="url(#lockGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{
              pathLength: isHovered ? [1, 0.3, 1] : 1,
              opacity: isHovered ? [1, 0.5, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
          
          {/* Lock Keyhole */}
          <motion.circle
            cx="50"
            cy="54"
            r="1.5"
            fill="url(#keyholeGradient)"
            animate={{
              scale: isHovered ? [1, 1.5, 1] : 1,
              opacity: isHovered ? [0.8, 1, 0.8] : 0.8,
            }}
            transition={{
              duration: 1.2,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
        </motion.g>

        {/* Security Particles */}
        {isHovered && Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30) * Math.PI / 180
          const radius = 35
          const startX = 50 + Math.cos(angle) * radius
          const startY = 50 + Math.sin(angle) * radius
          
          return (
            <motion.circle
              key={`security-${index}`}
              cx={startX}
              cy={startY}
              r="1"
              fill="url(#securityParticle)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.cos(angle) * 10, Math.cos(angle) * 15],
                y: [0, Math.sin(angle) * 10, Math.sin(angle) * 15],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            />
          )
        })}

        {/* Protective Barrier Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="url(#barrierGradient)"
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{
            rotate: isHovered ? 360 : 0,
            opacity: isHovered ? [0.3, 0.8, 0.3] : 0,
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: { duration: 3, repeat: isHovered ? Infinity : 0, ease: "linear" },
            opacity: { duration: 1.5, repeat: isHovered ? Infinity : 0, repeatType: "reverse" },
            scale: { duration: 1, repeat: isHovered ? Infinity : 0, repeatType: "reverse" },
          }}
        />

        {/* Energy Waves */}
        {isHovered && [40, 45, 50].map((radius, index) => (
          <motion.circle
            key={`wave-${index}`}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.5, 2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Data Encryption Lines */}
        {[30, 45, 60].map((y, index) => (
          <motion.g key={`encrypt-${index}`}>
            <motion.line
              x1="15"
              y1={y}
              x2="35"
              y2={y}
              stroke="url(#encryptGradient)"
              strokeWidth="1"
              strokeDasharray="2,2"
              animate={{
                opacity: isHovered ? [0, 1, 0] : 0,
                x1: isHovered ? [15, 25, 35] : 15,
                x2: isHovered ? [35, 45, 55] : 35,
              }}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
            
            <motion.line
              x1="65"
              y1={y}
              x2="85"
              y2={y}
              stroke="url(#encryptGradient)"
              strokeWidth="1"
              strokeDasharray="2,2"
              animate={{
                opacity: isHovered ? [0, 1, 0] : 0,
                x1: isHovered ? [65, 55, 45] : 65,
                x2: isHovered ? [85, 75, 65] : 85,
              }}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                delay: index * 0.2 + 0.1,
                ease: "easeInOut",
              }}
            />
          </motion.g>
        ))}

        {/* Gradients and Definitions */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          
          <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          
          <linearGradient id="innerShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
          </linearGradient>
          
          <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
          
          <radialGradient id="keyholeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>
          
          <radialGradient id="securityParticle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </radialGradient>
          
          <linearGradient id="barrierGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
          </linearGradient>
          
          <radialGradient id="waveGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
          </radialGradient>
          
          <linearGradient id="encryptGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background Security Glow */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-lg"
        animate={{
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.9 : 0.3,
          rotate: isHovered ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.5 },
          opacity: { duration: 0.5 },
          rotate: { duration: 2, repeat: isHovered ? Infinity : 0 },
        }}
      />
    </div>
  )
}