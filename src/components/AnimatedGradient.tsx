'use client'

import { motion } from 'framer-motion'

export default function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary animated gradient layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-cyan-500/30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '400% 400%',
        }}
      />

      {/* Secondary gradient layer for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tl from-cyan-400/20 via-indigo-500/15 to-purple-700/25"
        animate={{
          backgroundPosition: ['100% 100%', '0% 0%', '100% 100%'],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '300% 300%',
        }}
      />

      {/* Tertiary gradient for subtle movement */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent"
        animate={{
          x: ['-100%', '100%', '-100%'],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.15),transparent_50%)]" />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}