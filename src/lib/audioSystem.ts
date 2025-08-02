'use client'

// Audio system for subtle UI sound effects
export class AudioSystem {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private isEnabled: boolean = false
  private volume: number = 0.3

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext()
      this.loadStoredSettings()
    }
  }

  private initializeAudioContext() {
    try {
      // Use AudioContext with fallback to webkitAudioContext
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioContext = new AudioContextClass()
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  private loadStoredSettings() {
    try {
          const storedEnabled = localStorage.getItem('stellaiir-audio-enabled')
    const storedVolume = localStorage.getItem('stellaiir-audio-volume')
      
      this.isEnabled = storedEnabled === 'true'
      this.volume = storedVolume ? parseFloat(storedVolume) : 0.3
    } catch (error) {
      console.warn('Could not load audio settings:', error)
    }
  }

  private saveSettings() {
    try {
          localStorage.setItem('stellaiir-audio-enabled', String(this.isEnabled))
    localStorage.setItem('stellaiir-audio-volume', String(this.volume))
    } catch (error) {
      console.warn('Could not save audio settings:', error)
    }
  }

  // Generate synthetic sounds using Web Audio API
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      let sample = 0

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
          break
        case 'triangle':
          sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
          break
      }

      // Apply envelope (fade in/out)
      const fadeIn = Math.min(1, t * 10) // 100ms fade in
      const fadeOut = Math.min(1, (duration - t) * 10) // 100ms fade out
      const envelope = fadeIn * fadeOut

      data[i] = sample * envelope * 0.1 // Keep volume low
    }

    return buffer
  }

  // Initialize sound library
  public initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext) {
        resolve()
        return
      }

      // Generate subtle UI sounds
      const soundDefinitions = [
        { name: 'hover', frequency: 800, duration: 0.1, type: 'sine' as OscillatorType },
        { name: 'click', frequency: 1200, duration: 0.05, type: 'sine' as OscillatorType },
        { name: 'success', frequency: 523, duration: 0.3, type: 'sine' as OscillatorType }, // C note
        { name: 'error', frequency: 220, duration: 0.2, type: 'square' as OscillatorType }, // Low A
        { name: 'notification', frequency: 880, duration: 0.15, type: 'triangle' as OscillatorType }, // A note
        { name: 'milestone', frequency: 659, duration: 0.4, type: 'sine' as OscillatorType }, // E note
      ]

      soundDefinitions.forEach(({ name, frequency, duration, type }) => {
        const buffer = this.createTone(frequency, duration, type)
        if (buffer) {
          this.sounds.set(name, buffer)
        }
      })

      resolve()
    })
  }

  // Play a sound effect
  public play(soundName: string, volumeOverride?: number): void {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundName)) {
      return
    }

    try {
      // Resume audio context if suspended (required for autoplay policies)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }

      const buffer = this.sounds.get(soundName)!
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Set volume
      const finalVolume = volumeOverride ?? this.volume
      gainNode.gain.value = finalVolume

      source.start(0)
    } catch (error) {
      console.warn(`Could not play sound "${soundName}":`, error)
    }
  }

  // Enable/disable audio
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    this.saveSettings()
  }

  // Set volume (0-1)
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  // Getters
  public getEnabled(): boolean {
    return this.isEnabled
  }

  public getVolume(): number {
    return this.volume
  }

  // Check if audio is supported
  public isSupported(): boolean {
    return this.audioContext !== null
  }

  // Play complex sequences
  public playSequence(sounds: { name: string; delay: number; volume?: number }[]): void {
    if (!this.isEnabled) return

    sounds.forEach(({ name, delay, volume }) => {
      setTimeout(() => {
        this.play(name, volume)
      }, delay)
    })
  }

  // Special effects
  public playSuccessChime(): void {
    this.playSequence([
      { name: 'success', delay: 0, volume: 0.4 },
      { name: 'milestone', delay: 200, volume: 0.3 },
    ])
  }

  public playErrorBuzz(): void {
    this.playSequence([
      { name: 'error', delay: 0, volume: 0.2 },
      { name: 'error', delay: 100, volume: 0.15 },
    ])
  }

  public playKonamiSuccess(): void {
    // Play ascending notes
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047] // C major scale
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const buffer = this.createTone(frequency, 0.2, 'sine')
        if (buffer && this.audioContext) {
          const source = this.audioContext.createBufferSource()
          const gainNode = this.audioContext.createGain()
          
          source.buffer = buffer
          source.connect(gainNode)
          gainNode.connect(this.audioContext.destination)
          gainNode.gain.value = 0.2
          
          source.start(0)
        }
      }, index * 100)
    })
  }
}

// Global audio system instance
let audioSystem: AudioSystem | null = null

export function getAudioSystem(): AudioSystem {
  if (!audioSystem) {
    audioSystem = new AudioSystem()
  }
  return audioSystem
}

// React hook for audio system
import { useState, useEffect } from 'react'

export function useAudioSystem() {
  const [audio] = useState(() => getAudioSystem())
  const [isEnabled, setIsEnabled] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Initialize audio system
    audio.initialize().then(() => {
      setIsEnabled(audio.getEnabled())
      setVolume(audio.getVolume())
      setIsSupported(audio.isSupported())
    })
  }, [audio])

  const toggleEnabled = () => {
    const newEnabled = !isEnabled
    audio.setEnabled(newEnabled)
    setIsEnabled(newEnabled)
  }

  const updateVolume = (newVolume: number) => {
    audio.setVolume(newVolume)
    setVolume(newVolume)
  }

  const playSound = (soundName: string, volumeOverride?: number) => {
    audio.play(soundName, volumeOverride)
  }

  return {
    isEnabled,
    volume,
    isSupported,
    toggleEnabled,
    updateVolume,
    playSound,
    playSuccessChime: () => audio.playSuccessChime(),
    playErrorBuzz: () => audio.playErrorBuzz(),
    playKonamiSuccess: () => audio.playKonamiSuccess(),
  }
}