'use client'

import { useEffect, useCallback, useRef, useState } from 'react'

export interface KeyboardNavigationOptions {
  // Enable/disable different navigation modes
  enableArrowKeys?: boolean
  enableTabNavigation?: boolean
  enableEscapeKey?: boolean
  enableEnterKey?: boolean
  enableShortcuts?: boolean
  
  // Custom key handlers
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onEscape?: () => void
  onSpace?: () => void
  
  // Focus management
  focusableSelector?: string
  containerRef?: React.RefObject<HTMLElement>
  
  // Keyboard shortcuts
  shortcuts?: Record<string, () => void>
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = true,
    enableTabNavigation = true,
    enableEscapeKey = true,
    enableEnterKey = true,
    enableShortcuts = true,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onSpace,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    containerRef,
    shortcuts = {},
  } = options

  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)
  const [isNavigating, setIsNavigating] = useState(false)
  const focusableElements = useRef<HTMLElement[]>([])

  // Update focusable elements
  const updateFocusableElements = useCallback(() => {
    const container = containerRef?.current || document
    const elements = Array.from(
      container.querySelectorAll(focusableSelector)
    ) as HTMLElement[]
    
    // Filter out disabled and hidden elements
    focusableElements.current = elements.filter(el => 
      !el.hasAttribute('disabled') && 
      !el.getAttribute('aria-hidden') && 
      el.offsetParent !== null // visible check
    )
  }, [focusableSelector, containerRef])

  // Get keyboard shortcut key combination
  const getShortcutKey = useCallback((event: KeyboardEvent): string => {
    const parts = []
    if (event.ctrlKey) parts.push('ctrl')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')
    if (event.metaKey) parts.push('meta')
    parts.push(event.key.toLowerCase())
    return parts.join('+')
  }, [])

  // Focus element by index
  const focusElementAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < focusableElements.current.length) {
      const element = focusableElements.current[index]
      element.focus()
      setCurrentFocusIndex(index)
      setIsNavigating(true)
    }
  }, [])

  // Navigate to next/previous element
  const navigateToNext = useCallback(() => {
    updateFocusableElements()
    const currentIndex = focusableElements.current.findIndex(
      el => el === document.activeElement
    )
    const nextIndex = (currentIndex + 1) % focusableElements.current.length
    focusElementAtIndex(nextIndex)
  }, [focusElementAtIndex, updateFocusableElements])

  const navigateToPrevious = useCallback(() => {
    updateFocusableElements()
    const currentIndex = focusableElements.current.findIndex(
      el => el === document.activeElement
    )
    const prevIndex = currentIndex <= 0 
      ? focusableElements.current.length - 1 
      : currentIndex - 1
    focusElementAtIndex(prevIndex)
  }, [focusElementAtIndex, updateFocusableElements])

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Handle shortcuts first
    if (enableShortcuts) {
      const shortcutKey = getShortcutKey(event)
      const shortcutHandler = shortcuts[shortcutKey]
      if (shortcutHandler) {
        event.preventDefault()
        shortcutHandler()
        return
      }
    }

    // Handle special keys
    switch (event.key) {
      case 'Escape':
        if (enableEscapeKey) {
          event.preventDefault()
          onEscape?.()
          // Remove focus from current element
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
          setIsNavigating(false)
        }
        break

      case 'Enter':
        if (enableEnterKey && document.activeElement) {
          // Only handle if not in an input
          if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            event.preventDefault()
            onEnter?.()
            // Trigger click on focused element
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.click()
            }
          }
        }
        break

      case ' ':
        // Space key - only handle if not in text input
        if (!['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) {
          event.preventDefault()
          onSpace?.()
          // Trigger click on focused element
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.click()
          }
        }
        break

      case 'ArrowUp':
        if (enableArrowKeys) {
          event.preventDefault()
          onArrowUp ? onArrowUp() : navigateToPrevious()
        }
        break

      case 'ArrowDown':
        if (enableArrowKeys) {
          event.preventDefault()
          onArrowDown ? onArrowDown() : navigateToNext()
        }
        break

      case 'ArrowLeft':
        if (enableArrowKeys) {
          event.preventDefault()
          onArrowLeft ? onArrowLeft() : navigateToPrevious()
        }
        break

      case 'ArrowRight':
        if (enableArrowKeys) {
          event.preventDefault()
          onArrowRight ? onArrowRight() : navigateToNext()
        }
        break

      case 'Tab':
        if (enableTabNavigation) {
          // Let browser handle tab navigation, but track it
          setTimeout(() => {
            updateFocusableElements()
            const currentIndex = focusableElements.current.findIndex(
              el => el === document.activeElement
            )
            setCurrentFocusIndex(currentIndex)
            setIsNavigating(true)
          }, 0)
        }
        break

      case 'Home':
        if (enableArrowKeys) {
          event.preventDefault()
          focusElementAtIndex(0)
        }
        break

      case 'End':
        if (enableArrowKeys) {
          event.preventDefault()
          focusElementAtIndex(focusableElements.current.length - 1)
        }
        break
    }
  }, [
    enableShortcuts, enableEscapeKey, enableEnterKey, enableArrowKeys, 
    enableTabNavigation, getShortcutKey, shortcuts, onEscape, onEnter, 
    onSpace, onArrowUp, onArrowDown, onArrowLeft, onArrowRight,
    navigateToNext, navigateToPrevious, focusElementAtIndex, updateFocusableElements
  ])

  // Handle focus events to track navigation state
  const handleFocus = useCallback(() => {
    setIsNavigating(true)
  }, [])

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (!document.activeElement || document.activeElement === document.body) {
        setIsNavigating(false)
        setCurrentFocusIndex(-1)
      }
    }, 100)
  }, [])

  // Setup event listeners
  useEffect(() => {
    const container = containerRef?.current || document

    container.addEventListener('keydown', handleKeyDown as EventListener)
    container.addEventListener('focusin', handleFocus as EventListener)
    container.addEventListener('focusout', handleBlur as EventListener)

    // Initial setup
    updateFocusableElements()

    return () => {
      container.removeEventListener('keydown', handleKeyDown as EventListener)
      container.removeEventListener('focusin', handleFocus as EventListener)
      container.removeEventListener('focusout', handleBlur as EventListener)
    }
  }, [handleKeyDown, handleFocus, handleBlur, containerRef, updateFocusableElements])

  // Update focusable elements when DOM changes
  useEffect(() => {
    const observer = new MutationObserver(updateFocusableElements)
    const container = containerRef?.current || document.body

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'aria-hidden', 'tabindex']
    })

    return () => observer.disconnect()
  }, [updateFocusableElements, containerRef])

  return {
    currentFocusIndex,
    isNavigating,
    focusableElements: focusableElements.current,
    focusElementAtIndex,
    navigateToNext,
    navigateToPrevious,
    updateFocusableElements,
  }
}

// Specialized hook for feature card navigation
export function useFeatureCardNavigation(
  cardRefs: React.RefObject<HTMLElement>[],
  onCardSelect?: (index: number) => void
) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleArrowLeft = useCallback(() => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : cardRefs.length - 1
    setSelectedIndex(newIndex)
    cardRefs[newIndex]?.current?.focus()
    onCardSelect?.(newIndex)
  }, [selectedIndex, cardRefs, onCardSelect])

  const handleArrowRight = useCallback(() => {
    const newIndex = selectedIndex < cardRefs.length - 1 ? selectedIndex + 1 : 0
    setSelectedIndex(newIndex)
    cardRefs[newIndex]?.current?.focus()
    onCardSelect?.(newIndex)
  }, [selectedIndex, cardRefs, onCardSelect])

  const handleEnter = useCallback(() => {
    cardRefs[selectedIndex]?.current?.click()
  }, [selectedIndex, cardRefs])

  useKeyboardNavigation({
    enableArrowKeys: true,
    onArrowLeft: handleArrowLeft,
    onArrowRight: handleArrowRight,
    onEnter: handleEnter,
  })

  return {
    selectedIndex,
    setSelectedIndex,
  }
}

// Hook for modal keyboard navigation
export function useModalKeyboardNavigation(
  isOpen: boolean,
  onClose?: () => void,
  modalRef?: React.RefObject<HTMLElement>
) {
  const previousFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store current focused element
      previousFocusedElement.current = document.activeElement as HTMLElement
      
      // Focus first element in modal
      setTimeout(() => {
        const firstFocusable = modalRef?.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        firstFocusable?.focus()
      }, 100)
    } else {
      // Restore focus to previous element
      if (previousFocusedElement.current) {
        previousFocusedElement.current.focus()
        previousFocusedElement.current = null
      }
    }
  }, [isOpen, modalRef])

  useKeyboardNavigation({
    enableEscapeKey: true,
    onEscape: onClose,
    containerRef: modalRef,
  })
}