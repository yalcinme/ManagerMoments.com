"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"

interface AudioContextType {
  playSound: (soundName: string) => void
  isMuted: boolean
  toggleMute: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

// Export the context for use in the hook
export { AudioContext }

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within AudioManager")
  }
  return context
}

export default function AudioManager({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    // Initialize audio files
    const sounds = {
      click: "/sounds/click.mp3",
      whistle: "/sounds/whistle.mp3",
      goal: "/sounds/goal.mp3",
      transition: "/sounds/transition.mp3",
      celebration: "/sounds/celebration.mp3",
    }

    Object.entries(sounds).forEach(([name, src]) => {
      const audio = new Audio(src)
      audio.volume = 0.3
      audio.preload = "auto"
      audioRefs.current[name] = audio
    })
  }, [])

  const playSound = (soundName: string) => {
    if (isMuted) return

    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      })
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return <AudioContext.Provider value={{ playSound, isMuted, toggleMute }}>{children}</AudioContext.Provider>
}
