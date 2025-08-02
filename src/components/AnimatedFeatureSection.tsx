'use client'

import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import EnhancedFeatureCard from './EnhancedFeatureCard'
import AnimatedDNAIcon from './icons/AnimatedDNAIcon'
import AnimatedChartIcon from './icons/AnimatedChartIcon'
import AnimatedShieldIcon from './icons/AnimatedShieldIcon'

const features = [
  {
    icon: AnimatedDNAIcon,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms identify genetic mutations and health risks with unprecedented accuracy, providing insights that traditional methods miss.",
  },
  {
    icon: AnimatedChartIcon,
    title: "Personalized Protocols", 
    description: "Get custom supplement and lifestyle recommendations tailored to your unique genetic profile for optimal health outcomes.",
  },
  {
    icon: AnimatedShieldIcon,
    title: "Privacy First",
    description: "Your genetic data is encrypted and never shared. We use zero-knowledge architecture to ensure your information stays private.",
  },
]

export default function AnimatedFeatureSection() {
  const { ref: sectionRef, isInView: sectionInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-100px',
    triggerOnce: true,
  })

  const { ref: titleRef, isInView: titleInView } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '-50px',
    triggerOnce: true,
  })

  return (
    <section 
      ref={sectionRef as React.LegacyRef<HTMLElement>}
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden"
      aria-labelledby="features-heading"
      role="region"
    >
      {/* Background Enhancement */}
      <div className="absolute inset-0">
        {/* Animated Background Gradients */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={sectionInView ? {
            background: [
              'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            ],
          } : {}}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating Background Elements */}
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={`bg-element-${index}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${
                index % 3 === 0 ? '#6366f1' : 
                index % 3 === 1 ? '#22d3ee' : '#10b981'
              }, transparent)`,
              left: `${20 + index * 12}%`,
              top: `${30 + (index % 3) * 20}%`,
            }}
            animate={sectionInView ? {
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            } : {}}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <header ref={titleRef as React.LegacyRef<HTMLElement>} className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={titleInView ? { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            } : {}}
          >
            <motion.h2
              id="features-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
              animate={titleInView ? {
                backgroundImage: [
                  'linear-gradient(90deg, #ffffff 0%, #ffffff 100%)',
                  'linear-gradient(90deg, #6366f1 0%, #22d3ee 50%, #10b981 100%)',
                  'linear-gradient(90deg, #ffffff 0%, #ffffff 100%)',
                ],
                color: ['#ffffff', 'transparent', '#ffffff'],
              } : {}}
              style={{
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Revolutionary Features
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
              aria-describedby="features-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={titleInView ? { 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              } : {}}
            >
              Experience the future of genetic analysis with our cutting-edge AI technology designed for personalized healthcare.
            </motion.p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center mt-8 space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={titleInView ? { 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.6,
                delay: 0.6,
              }
            } : {}}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full"
                style={{
                  background: index === 0 ? '#6366f1' : 
                             index === 1 ? '#22d3ee' : '#10b981',
                }}
                animate={titleInView ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </header>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-0"
          role="group"
          aria-label="Stellaiir feature highlights"
          initial={{ opacity: 0 }}
          animate={sectionInView ? { 
            opacity: 1,
            transition: {
              duration: 0.6,
              delay: 0.8,
            }
          } : {}}
        >
          {features.map((feature, index) => (
            <EnhancedFeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.2 + index * 0.2}
              index={index}
            />
          ))}
        </motion.div>

        {/* Bottom Decorative Element */}
        <motion.div
          className="flex justify-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={sectionInView ? { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              delay: 1.5,
            }
          } : {}}
        >
          <motion.div
            className="w-32 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-green-500"
            animate={sectionInView ? {
              scaleX: [0, 1],
              opacity: [0, 1],
            } : {}}
            transition={{
              duration: 1.5,
              delay: 2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        </motion.div>

        {/* Interactive Connection Lines */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={sectionInView ? { opacity: 0.1 } : {}}
          transition={{ duration: 2, delay: 2.5 }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Connection lines between cards */}
          <motion.path
            d="M200 300 Q400 200 600 300"
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,5"
            animate={sectionInView ? {
              pathLength: [0, 1],
              opacity: [0, 0.6, 0.2],
            } : {}}
            transition={{
              duration: 3,
              delay: 3,
              ease: 'easeInOut',
            }}
          />
          
          <motion.path
            d="M600 300 Q400 400 200 300"
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,5"
            animate={sectionInView ? {
              pathLength: [0, 1],
              opacity: [0, 0.6, 0.2],
            } : {}}
            transition={{
              duration: 3,
              delay: 3.5,
              ease: 'easeInOut',
            }}
          />
        </motion.svg>
      </div>
    </section>
  )
}