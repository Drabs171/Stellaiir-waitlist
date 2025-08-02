'use client'

import { useEffect, useState, useCallback } from 'react'

// Classic Konami Code sequence: ↑↑↓↓←→←→BA
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

interface UseKonamiCodeOptions {
  onSuccess?: () => void
  resetTimeout?: number // Reset sequence after timeout (ms)
  sequence?: string[] // Custom sequence
}

export function useKonamiCode({
  onSuccess,
  resetTimeout = 5000,
  sequence = KONAMI_CODE
}: UseKonamiCodeOptions = {}) {
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [isActivated, setIsActivated] = useState(false)
  const [progress, setProgress] = useState(0)

  const resetSequence = useCallback(() => {
    setKeySequence([])
    setProgress(0)
  }, [])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Ignore if typing in input fields
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    setKeySequence(prev => {
      const newSequence = [...prev, event.code]
      const currentProgress = newSequence.length
      
      // Check if the current sequence matches the expected sequence so far
      const isCorrectSoFar = newSequence.every((key, index) => key === sequence[index])
      
      if (!isCorrectSoFar) {
        // Wrong key, reset sequence
        setProgress(0)
        return []
      }
      
      // Update progress
      setProgress(currentProgress)
      
      if (currentProgress === sequence.length) {
        // Sequence completed!
        setIsActivated(true)
        setProgress(sequence.length)
        onSuccess?.()
        
        // Reset after a delay to allow for re-activation
        setTimeout(() => {
          setIsActivated(false)
          setProgress(0)
        }, 1000)
        
        return []
      }
      
      return newSequence
    })
  }, [sequence, onSuccess])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, { passive: true })
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // Reset sequence after timeout
  useEffect(() => {
    if (keySequence.length === 0) return

    const timeout = setTimeout(resetSequence, resetTimeout)
    return () => clearTimeout(timeout)
  }, [keySequence, resetTimeout, resetSequence])

  return {
    isActivated,
    progress,
    totalSteps: sequence.length,
    progressPercentage: (progress / sequence.length) * 100,
    reset: resetSequence
  }
}

// Hook for multiple Easter egg sequences
export function useEasterEggs() {
  const [activeEggs, setActiveEggs] = useState<string[]>([])
  
  // Konami Code - Classic
  const konami = useKonamiCode({
    onSuccess: () => {
      setActiveEggs(prev => [...prev, 'konami'])
      setTimeout(() => {
        setActiveEggs(prev => prev.filter(egg => egg !== 'konami'))
      }, 5000)
    }
  })

  // DNA Sequence - Custom sequence
  const dnaSequence = useKonamiCode({
    sequence: ['KeyD', 'KeyN', 'KeyA'],
    onSuccess: () => {
      setActiveEggs(prev => [...prev, 'dna'])
      setTimeout(() => {
        setActiveEggs(prev => prev.filter(egg => egg !== 'dna'))
      }, 3000)
    }
  })

  // Genome Code - Another custom sequence
  const genomeCode = useKonamiCode({
    sequence: ['KeyG', 'KeyE', 'KeyN', 'KeyO', 'KeyM', 'KeyE'],
    onSuccess: () => {
      setActiveEggs(prev => [...prev, 'genome'])
      setTimeout(() => {
        setActiveEggs(prev => prev.filter(egg => egg !== 'genome'))
      }, 4000)
    }
  })

  return {
    activeEggs,
    konami,
    dnaSequence,
    genomeCode,
    isAnyActive: activeEggs.length > 0
  }
}