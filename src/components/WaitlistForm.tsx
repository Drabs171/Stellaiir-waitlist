'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { waitlistSchema, type WaitlistFormData } from '@/lib/validations'

interface WaitlistFormProps {
  className?: string
}

export default function WaitlistForm({ className = '' }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className={`w-full max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      role="region"
      aria-label="Waitlist signup form"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Join the Stellaiir waitlist">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden="true" />
          <input
            {...register('email')}
            type="email"
            placeholder="Enter your email address"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            disabled={isSubmitting}
            aria-label="Your email address"
            aria-describedby={errors.email ? "email-error" : "email-help"}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-required="true"
            autoComplete="email"
          />
        </div>
        
        {errors.email && (
          <motion.p
            id="email-error"
            className="text-red-400 text-sm flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {errors.email.message}
          </motion.p>
        )}

        {submitStatus === 'error' && (
          <motion.p
            className="text-red-400 text-sm flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {errorMessage}
          </motion.p>
        )}

        {submitStatus === 'success' && (
          <motion.p
            className="text-green-400 text-sm flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
          >
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
            Successfully added to waitlist! We&apos;ll notify you when we launch.
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-describedby="submit-button-help"
          aria-live="polite"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Joining waitlist...</span>
              <span className="sr-only">Please wait, submitting your email address</span>
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle className="h-5 w-5" aria-hidden="true" />
              <span>Joined!</span>
              <span className="sr-only">Successfully joined the waitlist</span>
            </>
          ) : (
            'Join the Waitlist'
          )}
        </motion.button>
      </form>

      <p className="text-gray-400 text-xs text-center mt-4" id="email-help">
        We respect your privacy. No spam, ever.
      </p>
      
      <div id="submit-button-help" className="sr-only">
                  Submit this form to join the Stellaiir waitlist and receive notifications when the platform launches.
      </div>
    </motion.div>
  )
}