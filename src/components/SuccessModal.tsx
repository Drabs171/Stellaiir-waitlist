'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Share2, Users, TrendingUp, Twitter, Linkedin, Facebook } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    id: string
    email: string
    referralCode: string
    position: number
    joinedAt: string
  }
}

export default function SuccessModal({ isOpen, onClose, userData }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [displayPosition, setDisplayPosition] = useState(0)

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${userData.referralCode}`

  // Trigger confetti when modal opens and handle body scroll
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      
      // Animate position counter
      const interval = setInterval(() => {
        setDisplayPosition(prev => {
          if (prev >= userData.position) {
            clearInterval(interval)
            return userData.position
          }
          return prev + Math.ceil((userData.position - prev) / 10)
        })
      }, 50)
      
      return () => {
        clearInterval(interval)
        document.body.style.overflow = 'unset'
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, userData.position])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareOnTwitter = () => {
    const text = `🧬 Just joined the Stellaiir waitlist! Get early access to AI-powered genetic analysis and unlock your genetic potential. Join me: ${referralUrl}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareOnLinkedIn = () => {
    const text = `Excited to join Stellaiir's waitlist for revolutionary AI-powered genetic analysis! This could transform personalized healthcare. ${referralUrl}`
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&summary=${encodeURIComponent(text)}`, '_blank')
  }

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Advanced Confetti System */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-3 h-3"
                  style={{
                    backgroundColor: ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 6],
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                    borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                  }}
                  initial={{ 
                    y: -20, 
                    x: 0, 
                    rotate: 0, 
                    scale: 0 
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    x: (Math.random() - 0.5) * 300,
                    rotate: Math.random() * 720,
                    scale: [0, 1, 0.8, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: i * 0.1,
                  }}
                />
              ))}
              
              {/* Burst particles from center */}
              {Array.from({ length: 30 }).map((_, i) => {
                const angle = (i * 12) * Math.PI / 180
                return (
                  <motion.div
                    key={`burst-${i}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ['#6366f1', '#22d3ee', '#10b981'][i % 3],
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      x: Math.cos(angle) * (150 + Math.random() * 100),
                      y: Math.sin(angle) * (150 + Math.random() * 100),
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      ease: 'easeOut',
                      delay: 0.5 + i * 0.05,
                    }}
                  />
                )
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-lg max-h-[90vh] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-y-auto my-8 z-[9999]"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 300,
            delay: 0.1 
          }}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Success Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 15, 
                delay: 0.5 
              }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Welcome to Stellaiir!
            </motion.h2>
            
            <motion.p
              className="text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              You&apos;re successfully on the waitlist
            </motion.p>
          </motion.div>

          {/* Position Display */}
          <motion.div
            className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400 uppercase tracking-wide">Your Position</span>
            </div>
            
            <motion.div
              className="text-4xl font-bold text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              #{displayPosition.toLocaleString()}
            </motion.div>
            
            <motion.p
              className="text-sm text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Refer friends to move up faster!
            </motion.p>
          </motion.div>

          {/* Referral Incentive */}
          <motion.div
            className="mb-8 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Refer 3 friends, move up 3 spots!</p>
                <p className="text-sm text-gray-400">Share your link and climb the waitlist</p>
              </div>
            </div>
          </motion.div>

          {/* Referral Link */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Referral Link
            </label>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono overflow-hidden">
                <div className="truncate">{referralUrl}</div>
              </div>
              
              <motion.button
                onClick={copyToClipboard}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="copied"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            
            <AnimatePresence>
              {copied && (
                <motion.p
                  className="text-green-400 text-sm mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  ✓ Link copied to clipboard!
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Social Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-sm text-gray-300 mb-4 text-center">Share with friends</p>
            
            <div className="flex justify-center gap-3">
              <motion.button
                onClick={shareOnTwitter}
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={shareOnLinkedIn}
                className="p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={shareOnFacebook}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={copyToClipboard}
                className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <p className="text-xs text-gray-400">
                              We&apos;ll email you when it&apos;s your turn. Thanks for joining Stellaiir!
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}