"use client"

import type React from "react"
import { createContext, useContext } from "react"

interface AudioContextType {
  playSound: (soundName: string) => void
  playMusic: (musicName: string, loop?: boolean) => void
  stopMusic: () => void
  isMuted: boolean
  toggleMute: () => void
  setVolume: (volume: number) => void
}

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
  playMusic: () => {},
  stopMusic: () => {},
  isMuted: true,
  toggleMute: () => {},
  setVolume: () => {},
})

export function useAudio() {
  return useContext(AudioContext)
}

interface AudioFallbackProps {
  children: React.ReactNode
}

// Minimal fallback audio manager that does nothing but prevents errors
export default function AudioFallback({ children }: AudioFallbackProps) {
  const contextValue: AudioContextType = {
    playSound: () => {},
    playMusic: () => {},
    stopMusic: () => {},
    isMuted: true,
    toggleMute: () => {},
    setVolume: () => {},
  }

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>
}
