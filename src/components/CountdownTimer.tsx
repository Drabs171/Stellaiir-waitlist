'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, Users, Calendar } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: Date
  title?: string
  description?: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer = ({ 
  targetDate, 
  title = "Launch Countdown", 
  description = "Get ready for the future of genetic analysis",
  className = "" 
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering for accurate countdown
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      // Debug logging
      console.log('🚀 COUNTDOWN DEBUG:')
      console.log('Current time:', new Date().toISOString())
      console.log('Target time:', targetDate.toISOString())
      console.log('Difference (ms):', difference)
      console.log('Difference (days):', difference / (1000 * 60 * 60 * 24))

      if (difference <= 0) {
        console.log('❌ COUNTDOWN: Target date has passed, showing expired state')
        setIsExpired(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      console.log('✅ COUNTDOWN: Target is in future, calculating time left')

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isClient])

  if (!isClient) {
    // Render skeleton during SSR
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4 w-64 mx-auto"></div>
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-4 w-20 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <motion.div 
        className={`text-center space-y-6 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Zap className="h-16 w-16 text-yellow-400 mx-auto" />
          <motion.div
            className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🎉 It&apos;s Time!
          </h2>
          <p className="text-lg text-gray-300">
                          The future of genetic analysis is here. Welcome to Stellaiir!
          </p>
        </div>
      </motion.div>
    )
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: Calendar },
    { label: 'Hours', value: timeLeft.hours, icon: Clock },
    { label: 'Minutes', value: timeLeft.minutes, icon: Clock },
    { label: 'Seconds', value: timeLeft.seconds, icon: Zap },
  ]

  return (
    <motion.div 
      className={`text-center space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="timer"
      aria-label={`Countdown to launch: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
    >
      {/* Title and Description */}
      <div className="space-y-2">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-gray-300 text-sm md:text-base"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      </div>

      {/* Countdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
        {timeUnits.map((unit, index) => (
          <CountdownUnit
            key={unit.label}
            label={unit.label}
            value={unit.value}
            icon={unit.icon}
            delay={index * 0.1}
            isUrgent={timeLeft.days === 0 && timeLeft.hours < 1}
          />
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="space-y-4">
        <motion.div 
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                background: timeLeft.days > 7 ? '#6366f1' : 
                           timeLeft.days > 1 ? '#f59e0b' : '#ef4444',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Urgency Message */}
        <AnimatePresence>
          {timeLeft.days === 0 && (
            <motion.div
              className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 text-red-300">
                <Zap className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">
                  {timeLeft.hours < 1 ? 'Less than 1 hour left!' : 'Final hours remaining!'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestone Celebration */}
        <AnimatePresence>
          {(timeLeft.days === 7 || timeLeft.days === 1 || timeLeft.hours === 1) && (
            <motion.div
              className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 text-indigo-300">
                <Users className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">
                  Milestone reached! Almost there! 🎉
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

interface CountdownUnitProps {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  delay: number
  isUrgent: boolean
}

const CountdownUnit = ({ label, value, icon: Icon, delay, isUrgent }: CountdownUnitProps) => {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Background */}
      <motion.div
        className={`
          relative bg-white/5 backdrop-blur-md border rounded-xl p-4 
          transition-all duration-300 group-hover:bg-white/10
          ${isUrgent ? 'border-red-400/50' : 'border-white/10'}
        `}
        animate={isUrgent ? {
          borderColor: ['rgba(248, 113, 113, 0.5)', 'rgba(239, 68, 68, 0.8)', 'rgba(248, 113, 113, 0.5)'],
        } : {}}
        transition={isUrgent ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {}}
      >
        {/* Glow Effect */}
        <motion.div
          className={`
            absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ${isUrgent ? 'bg-red-400/10' : 'bg-indigo-400/10'}
          `}
          style={{
            boxShadow: isUrgent 
              ? '0 0 20px rgba(248, 113, 113, 0.3)' 
              : '0 0 20px rgba(99, 102, 241, 0.3)',
          }}
        />

        {/* Content */}
        <div className="relative space-y-3">
          {/* Icon */}
          <motion.div
            className="flex justify-center"
            animate={isUrgent ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={isUrgent ? {
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            } : {}}
          >
            <Icon className={`h-6 w-6 ${isUrgent ? 'text-red-400' : 'text-indigo-400'}`} aria-hidden="true" />
          </motion.div>

          {/* Value */}
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              className={`
                text-2xl md:text-3xl font-bold font-mono
                ${isUrgent ? 'text-red-300' : 'text-white'}
              `}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {value.toString().padStart(2, '0')}
            </motion.div>
          </AnimatePresence>

          {/* Label */}
          <div className={`text-xs md:text-sm font-medium ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
            {label}
          </div>
        </div>

        {/* Pulse Animation for Urgent */}
        {isUrgent && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-red-400/50"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default CountdownTimer