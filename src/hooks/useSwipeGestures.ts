'use client'

import { useState, useCallback, useRef } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

interface SwipeOptions {
  minSwipeDistance?: number
  preventDefaultTouchmoveEvent?: boolean
  trackMouse?: boolean
}

interface TouchPoint {
  x: number
  y: number
}

export function useSwipeGestures(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const {
    minSwipeDistance = 50,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false,
  } = options

  const [isSwiping, setIsSwiping] = useState(false)
  const touchStart = useRef<TouchPoint | null>(null)
  const touchEnd = useRef<TouchPoint | null>(null)
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent | MouseEvent) => {
    setIsSwiping(true)
    const point = 'touches' in e ? e.touches[0] : e
    touchStart.current = { x: point.clientX, y: point.clientY }
    touchEnd.current = null
  }, [])

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
    const point = 'touches' in e ? e.touches[0] : e
    touchEnd.current = { x: point.clientX, y: point.clientY }
  }, [preventDefaultTouchmoveEvent])

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      setIsSwiping(false)
      return
    }

    const deltaX = touchStart.current.x - touchEnd.current.x
    const deltaY = touchStart.current.y - touchEnd.current.y
    
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine if swipe was significant enough
    if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
      setIsSwiping(false)
      return
    }

    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        handlers.onSwipeLeft?.()
      } else {
        handlers.onSwipeRight?.()
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        handlers.onSwipeUp?.()
      } else {
        handlers.onSwipeDown?.()
      }
    }

    setIsSwiping(false)
    touchStart.current = null
    touchEnd.current = null
  }, [handlers, minSwipeDistance])

  // Event listeners object for touch events
  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    ...(trackMouse && {
      onMouseDown: handleTouchStart,
      onMouseMove: handleTouchMove,
      onMouseUp: handleTouchEnd,
    }),
  }

  // Ref-based event listeners for more complex scenarios
  const attachSwipeListeners = useCallback((element: HTMLElement | null) => {
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener('touchend', handleTouchEnd)
    
    if (trackMouse) {
      element.addEventListener('mousedown', handleTouchStart)
      element.addEventListener('mousemove', handleTouchMove)
      element.addEventListener('mouseup', handleTouchEnd)
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      
      if (trackMouse) {
        element.removeEventListener('mousedown', handleTouchStart)
        element.removeEventListener('mousemove', handleTouchMove)
        element.removeEventListener('mouseup', handleTouchEnd)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouchmoveEvent, trackMouse])

  return {
    touchHandlers,
    attachSwipeListeners,
    isSwiping,
  }
}

// Helper hook for carousel-specific swipe handling
export function useCarouselSwipe(
  onNext: () => void,
  onPrevious: () => void,
  options?: SwipeOptions
) {
  return useSwipeGestures(
    {
      onSwipeLeft: onNext,
      onSwipeRight: onPrevious,
    },
    options
  )
}