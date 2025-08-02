'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <motion.div
          className="flex flex-col items-center justify-center p-8 text-center bg-red-900/20 border border-red-500/30 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            Something went wrong
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 max-w-md">
            An error occurred while loading this component. This might be a temporary issue.
          </p>
          
          <motion.button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 p-3 bg-gray-900/50 rounded text-xs text-gray-400 max-w-lg">
              <summary className="cursor-pointer text-red-400 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap text-left overflow-auto">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </motion.div>
      )
    }

    return this.props.children
  }
}

// Animation-specific error boundary with fallback
export function AnimationErrorBoundary({ 
  children, 
  fallbackComponent 
}: { 
  children: ReactNode
  fallbackComponent?: ReactNode 
}) {
  const fallback = fallbackComponent || (
    <div className="animate-pulse bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg h-32 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading animation...</div>
    </div>
  )

  return (
    <ErrorBoundary 
      fallback={fallback}
      onError={(error) => {
        console.warn('Animation component failed to load:', error.message)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Form-specific error boundary
export function FormErrorBoundary({ children }: { children: ReactNode }) {
  const fallback = (
    <motion.div
      className="p-6 border border-yellow-500/30 bg-yellow-900/20 rounded-lg text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
      <h3 className="text-white font-medium mb-2">Form Temporarily Unavailable</h3>
      <p className="text-gray-300 text-sm">
        Please refresh the page to try again. If the problem persists, contact support.
      </p>
    </motion.div>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}