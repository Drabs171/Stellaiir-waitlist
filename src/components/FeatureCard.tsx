'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  const cardId = `feature-${title.toLowerCase().replace(/\s+/g, '-')}`
  const descriptionId = `${cardId}-description`

  return (
    <motion.article
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      role="article"
      aria-labelledby={cardId}
      aria-describedby={descriptionId}
      tabIndex={0}
    >
      <header className="flex items-center gap-4 mb-4">
        <div 
          className="p-3 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-lg group-hover:from-indigo-500/30 group-hover:to-cyan-500/30 transition-all duration-300"
          aria-hidden="true"
        >
          <Icon className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
        </div>
        <h3 
          id={cardId}
          className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300"
        >
          {title}
        </h3>
      </header>
      <p 
        id={descriptionId}
        className="text-gray-300 leading-relaxed"
      >
        {description}
      </p>
    </motion.article>
  )
}