'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, CheckCircle, AlertCircle, Sparkles, Shield } from 'lucide-react'
import { waitlistSchema, type WaitlistFormData } from '@/lib/validations'
import SuccessModal from './SuccessModal'
import HCaptcha from '@hcaptcha/react-hcaptcha'

interface SuccessData {
  id: string
  email: string
  referralCode: string
  position: number
  joinedAt: string
  referredBy?: {
    referralCode: string
    email: string
  } | null
}

interface EnhancedWaitlistFormProps {
  className?: string
  onSuccess?: (data: SuccessData) => void
}

export default function EnhancedWaitlistForm({ className = '', onSuccess }: EnhancedWaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const captchaRef = useRef<HCaptcha>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  const emailValue = watch('email')

  const onSubmit = async (data: WaitlistFormData, event?: React.BaseSyntheticEvent) => {
    // Check honeypot field
    const formData = new FormData(event?.target)
    const honeypotValue = formData.get('website')
    if (honeypotValue && String(honeypotValue).trim() !== '') {
      // Bot detected - fail silently or show generic error
      setErrorMessage('Something went wrong. Please try again.')
      return
    }

    // Show CAPTCHA on first submission attempt
    if (!captchaToken && !showCaptcha) {
      setShowCaptcha(true)
      return
    }

    // Require CAPTCHA token before submission
    if (!captchaToken) {
      setErrorMessage('Please complete the security verification')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          captchaToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setSubmitStatus('success')
      setShowConfetti(true)
      setSuccessData(result.data)
      setShowSuccessModal(true)
      reset()
      setCaptchaToken(null)
      setShowCaptcha(false)
      
      // Reset CAPTCHA
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000)
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result.data)
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
      
      // Reset CAPTCHA on error
      setCaptchaToken(null)
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
      
      // Trigger shake animation
      if (formRef.current) {
        formRef.current.style.animation = 'shake 0.5s ease-in-out'
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.style.animation = ''
          }
        }, 500)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

      <motion.div
        ref={formRef}
        className={`relative w-full max-w-md mx-auto px-4 sm:px-0 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#6366f1', '#22d3ee', '#10b981', '#f59e0b'][i % 4],
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    ease: 'easeOut',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden from users but visible to bots */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              opacity: 0,
              overflow: 'hidden'
            }}
            aria-hidden="true"
            onChange={(e) => {
              // If bot fills this field, we'll detect it on submission
              if (e.target.value) {
                console.warn('Honeypot field filled - potential bot detected')
              }
            }}
          />
          
          {/* Email Input Container */}
          <motion.div
            className="relative"
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Glassmorphism Input Background */}
            <motion.div
              className="absolute inset-0 rounded-xl backdrop-blur-md border border-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
              }}
              animate={{
                borderColor: isFocused 
                  ? 'rgba(99, 102, 241, 0.5)' 
                  : errors.email 
                  ? 'rgba(239, 68, 68, 0.5)'
                  : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isFocused 
                  ? '0 0 30px rgba(99, 102, 241, 0.2)' 
                  : '0 0 10px rgba(255, 255, 255, 0.05)',
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Animated Border Gradient */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0"
              style={{
                background: 'linear-gradient(45deg, #6366f1, #22d3ee, #6366f1)',
                backgroundSize: '200% 200%',
                padding: '2px',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
              }}
              animate={{
                opacity: isFocused ? 1 : 0,
                backgroundPosition: isFocused ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
              }}
              transition={{
                opacity: { duration: 0.3 },
                backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
              }}
            />

            {/* Mail Icon */}
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              animate={{
                color: isFocused ? '#6366f1' : errors.email ? '#ef4444' : '#9ca3af',
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Mail className="h-5 w-5" />
            </motion.div>

            {/* Email Input */}
            <input
              {...register('email')}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              enterKeyHint="done"
              placeholder="Enter your email address"
              className="relative w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none z-10 rounded-xl text-base sm:text-lg min-h-[48px]"
              disabled={isSubmitting}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {/* Typing Animation Indicator */}
            <AnimatePresence>
              {emailValue && emailValue.length > 0 && !errors.email && (
                <motion.div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {errors.email && (
              <motion.div
                className="flex items-center gap-2 text-red-400 text-sm"
                initial={{ opacity: 0, y: -10, x: -5 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                >
                  <AlertCircle className="h-4 w-4" />
                </motion.div>
                {errors.email.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* API Error Message */}
          <AnimatePresence>
            {submitStatus === 'error' && (
              <motion.div
                className="flex items-center gap-2 text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                className="flex items-center gap-2 text-green-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
                Successfully joined the waitlist! Check your email for confirmation.
              </motion.div>
            )}
          </AnimatePresence>

          {/* CAPTCHA */}
          <AnimatePresence>
            {showCaptcha && (
              <motion.div
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Shield className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                  <span>Security verification required</span>
                </div>
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full flex justify-center"
                >
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
                    onVerify={(token) => {
                      setCaptchaToken(token)
                      setErrorMessage('')
                    }}
                    onError={() => {
                      setCaptchaToken(null)
                      setErrorMessage('CAPTCHA verification failed. Please try again.')
                    }}
                    onExpire={() => {
                      setCaptchaToken(null)
                      setErrorMessage('CAPTCHA expired. Please verify again.')
                    }}
                    theme="dark"
                    size="normal"
                  />
                </motion.div>
                
                {captchaToken && (
                  <motion.div
                    className="flex items-center gap-2 text-green-400 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Verification successful</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success' || (showCaptcha && !captchaToken)}
            className="relative w-full py-4 px-6 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)',
            }}
          >
            {/* Button Background Animation */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%)',
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-2">
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-5 w-5" />
                    </motion.div>
                    Joining waitlist...
                  </motion.div>
                ) : submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Joined!
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Join the Waitlist
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Button Shimmer Effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ skewX: '-20deg' }}
            />
          </motion.button>
        </form>

        {/* Privacy Notice */}
        <motion.p
          className="text-gray-400 text-xs text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
        </motion.p>

        {/* Success Modal */}
        {successData && (
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            userData={successData}
          />
        )}
      </motion.div>
    </>
  )
}