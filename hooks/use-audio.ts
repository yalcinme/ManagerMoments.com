"use client"

import { useState, useEffect } from "react"

export function useAudio() {
  const [audioContext, setAudioContext] = useState<{
    playSound: (soundName: string) => void
    isMuted: boolean
    toggleMute: () => void
  }>({
    playSound: () => {},
    isMuted: true,
    toggleMute: () => {},
  })

  useEffect(() => {
    try {
      // Try to get audio context from AudioManagerEnhanced
      const audioManager = (window as any).__audioManager
      if (audioManager) {
        setAudioContext(audioManager)
      }
    } catch (error) {
      // Fallback if not within AudioManager
      console.log("Audio manager not available, using fallback")
    }
  }, [])

  return audioContext
}
