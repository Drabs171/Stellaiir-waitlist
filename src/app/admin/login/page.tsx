'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import AnimatedButton from '@/components/ui/AnimatedButton'
import AnimatedInput from '@/components/ui/AnimatedInput'
import { PageTransition, StaggerContainer } from '@/components/ui/PageTransition'
import { fadeInUp, prefersReducedMotion } from '@/lib/animations'

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const router = useRouter()
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    // Check if already authenticated
    checkAuth()
    
    // Handle lockout countdown
    const interval = setInterval(() => {
      if (lockoutUntil && Date.now() >= lockoutUntil) {
        setLockoutUntil(null)
        setError('')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockoutUntil])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        router.push('/admin')
      }
    } catch {
      // Not authenticated, stay on login page
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin')
      } else {
        setError(data.error || 'Login failed')
        
        if (data.lockoutUntil) {
          setLockoutUntil(data.lockoutUntil)
        }
        
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts)
        }
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getLockoutTimeRemaining = () => {
    if (!lockoutUntil) return 0
    return Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000))
  }

  const isLockedOut = Boolean(lockoutUntil && Date.now() < lockoutUntil)

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-200/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={reducedMotion ? {} : {
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        <StaggerContainer className="max-w-md w-full space-y-8 relative z-10">
          <motion.div
            variants={fadeInUp}
            className="text-center"
          >
            <motion.div
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
              animate={reducedMotion ? {} : {
                boxShadow: [
                  '0 10px 25px rgba(59, 130, 246, 0.3)',
                  '0 20px 40px rgba(59, 130, 246, 0.4)',
                  '0 10px 25px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <motion.div
                animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
            <motion.h2
              className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Admin Dashboard
            </motion.h2>
            <motion.p
              className="mt-2 text-center text-sm text-gray-600"
              variants={fadeInUp}
            >
              Sign in to access the admin panel
            </motion.p>
          </motion.div>
        
          <motion.form 
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
            variants={fadeInUp}
          >
            <div className="space-y-4">
              <motion.div variants={fadeInUp}>
                <AnimatedInput
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  placeholder="Enter username"
                  required
                  disabled={isLoading || isLockedOut}
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  icon={<Shield className="h-5 w-5" />}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <AnimatedInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  required
                  disabled={isLoading || isLockedOut}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  error={error}
                />
              </motion.div>
            </div>

            {/* Additional error info */}
            {error && remainingAttempts !== null && remainingAttempts > 0 && (
              <motion.div
                className="rounded-lg bg-amber-50 border border-amber-200 p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-sm text-amber-800">
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                </div>
              </motion.div>
            )}

            {isLockedOut && (
              <motion.div
                className="rounded-lg bg-red-50 border border-red-200 p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-sm text-red-800">
                  Too many failed attempts. Please wait {getLockoutTimeRemaining()} seconds before trying again.
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeInUp}>
              <AnimatedButton
                type="submit"
                disabled={isLoading || isLockedOut}
                loading={isLoading}
                variant="primary"
                size="lg"
                className="w-full"
                magnetic={true}
                ripple={true}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </AnimatedButton>
            </motion.div>
          </motion.form>

          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <p className="text-xs text-gray-500">
              Contact your administrator if you need access credentials.
            </p>
          </motion.div>
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}