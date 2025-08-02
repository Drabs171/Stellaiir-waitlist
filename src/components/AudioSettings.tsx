'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Settings, Play } from 'lucide-react'
import { useAudioSystem } from '@/lib/audioSystem'

interface AudioSettingsProps {
  className?: string
}

const AudioSettings = ({ className = '' }: AudioSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isEnabled,
    volume,
    isSupported,
    toggleEnabled,
    updateVolume,
    playSound,
  } = useAudioSystem()

  if (!isSupported) {
    return null // Don't show if audio is not supported
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    updateVolume(newVolume)
    
    // Play test sound
    if (isEnabled) {
      playSound('hover', newVolume)
    }
  }

  const testSound = (soundName: string) => {
    if (isEnabled) {
      playSound(soundName)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Audio settings - ${isEnabled ? 'enabled' : 'disabled'}`}
      >
        {isEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
        <Settings className="h-3 w-3" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-6 z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Audio Settings</h3>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Sound Effects</label>
                    <p className="text-sm text-gray-400 mt-1">
                      Enable subtle UI sound feedback
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={toggleEnabled}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200
                      ${isEnabled ? 'bg-indigo-500' : 'bg-gray-600'}
                    `}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`${isEnabled ? 'Disable' : 'Enable'} sound effects`}
                  >
                    <motion.div
                      className={`
                        absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200
                        ${isEnabled ? 'translate-x-6' : 'translate-x-0.5'}
                      `}
                      layout
                    />
                  </motion.button>
                </div>

                {/* Volume Slider */}
                <AnimatePresence>
                  {isEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <label className="text-white font-medium">Volume</label>
                      
                      <div className="flex items-center gap-3">
                        <VolumeX className="h-4 w-4 text-gray-400" />
                        
                        <div className="flex-1 relative">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                            }}
                          />
                        </div>
                        
                        <Volume2 className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="text-center text-sm text-gray-400">
                        {Math.round(volume * 100)}%
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sound Test Buttons */}
                <AnimatePresence>
                  {isEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <label className="text-white font-medium">Test Sounds</label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'hover', label: 'Hover', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
                          { name: 'click', label: 'Click', color: 'bg-green-500/20 border-green-500/30 text-green-300' },
                          { name: 'success', label: 'Success', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
                          { name: 'error', label: 'Error', color: 'bg-red-500/20 border-red-500/30 text-red-300' },
                        ].map(({ name, label, color }) => (
                          <motion.button
                            key={name}
                            onClick={() => testSound(name)}
                            className={`
                              flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium
                              transition-all duration-200 hover:scale-105 ${color}
                            `}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play className="h-3 w-3" />
                            {label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Info */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sound effects enhance the user experience with subtle audio feedback. 
                    They can be disabled at any time and respect your system preferences.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  )
}

export default AudioSettings