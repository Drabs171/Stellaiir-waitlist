'use client'

import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { inputFocus, animationConfig, prefersReducedMotion } from '@/lib/animations'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface AnimatedInputProps {
  id?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  autoFocus?: boolean
  label?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  autoComplete,
  autoFocus = false,
  label,
  error,
  success = false,
  icon,
  className = '',
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasValue, setHasValue] = useState(!!value || !!defaultValue)
  const reducedMotion = prefersReducedMotion()

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    onChange?.(e)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type
  const hasError = !!error
  const showPasswordToggle = type === 'password'

  return (
    <motion.div 
      className={`relative ${className}`}
      initial="initial"
      animate={isFocused ? "focus" : hasError ? "error" : "initial"}
    >
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id}
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          animate={{
            color: isFocused 
              ? '#6366f1' 
              : hasError 
              ? '#ef4444' 
              : success 
              ? '#10b981' 
              : '#6b7280'
          }}
          transition={animationConfig.easing.spring}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <motion.div 
        className="relative"
        animate={{
          scale: reducedMotion ? 1 : (isFocused ? 1.02 : 1)
        }}
        transition={animationConfig.easing.spring}
      >
        {/* Background with glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          variants={reducedMotion ? {} : inputFocus}
        />

        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, #6366f1, #22d3ee, #6366f1)',
            backgroundSize: '200% 200%',
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            maskComposite: 'xor' as any,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
          animate={{
            opacity: isFocused && !hasError && !reducedMotion ? 1 : 0,
            backgroundPosition: isFocused ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
          }}
          transition={{
            opacity: { duration: animationConfig.durations.normal },
            backgroundPosition: { 
              duration: 2, 
              repeat: Infinity, 
              ease: 'linear' 
            },
          }}
        />

        {/* Left Icon */}
        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
            animate={{
              color: isFocused 
                ? '#6366f1' 
                : hasError 
                ? '#ef4444' 
                : success 
                ? '#10b981' 
                : '#9ca3af',
              scale: isFocused && !reducedMotion ? 1.1 : 1,
            }}
            transition={animationConfig.easing.spring}
          >
            {icon}
          </motion.div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={`
            relative w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none z-10 rounded-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${icon ? 'pl-10' : 'pl-4'}
            ${showPasswordToggle || success || hasError ? 'pr-10' : 'pr-4'}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-2">
          {/* Success Icon */}
          <AnimatePresence>
            {success && !hasError && (
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={animationConfig.easing.springBounce}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Icon */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: [0, -10, 10, -5, 5, 0] 
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  scale: animationConfig.easing.springBounce,
                  rotate: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                }}
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Toggle */}
          {showPasswordToggle && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={animationConfig.easing.spring}
            >
              <motion.div
                animate={{ rotate: showPassword ? 180 : 0 }}
                transition={animationConfig.easing.spring}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Input value indicator */}
        <AnimatePresence>
          {hasValue && !hasError && !success && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={animationConfig.easing.spring}
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && error && (
          <motion.div
            className="flex items-center gap-2 mt-2 text-red-500 text-sm"
            initial={{ opacity: 0, y: -10, x: -5 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={animationConfig.easing.springBounce}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 1 }}
            >
              <AlertCircle className="h-4 w-4" />
            </motion.div>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus ring effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          opacity: isFocused && !hasError && !reducedMotion ? 0.6 : 0,
          scale: isFocused && !reducedMotion ? 1.05 : 1,
        }}
        transition={animationConfig.easing.spring}
      />
    </motion.div>
  )
})

AnimatedInput.displayName = 'AnimatedInput'

export default AnimatedInput