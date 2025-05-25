"use client"

import { useAudio as useAudioFromManager } from "@/components/audio-manager"
import { useState, useEffect } from "react"

export function useAudio() {
  const [audioContext, setAudioContext] = useState<{
    playSound: () => void
    isMuted: boolean
    toggleMute: () => void
  }>({
    playSound: () => {},
    isMuted: true,
    toggleMute: () => {},
  })

  useEffect(() => {
    try {
      setAudioContext(useAudioFromManager())
    } catch (error) {
      // Fallback if not within AudioManager
      // Keep the default state
    }
  }, [])

  return audioContext
}
