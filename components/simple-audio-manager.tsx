"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

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

interface SimpleAudioManagerProps {
  children: React.ReactNode
}

export default function SimpleAudioManager({ children }: SimpleAudioManagerProps) {
  const [isMuted, setIsMuted] = useState(false)

  const playSound = (soundName: string) => {
    if (isMuted) return

    try {
      // Simple beep sound using Web Audio API
      if (typeof window !== "undefined" && window.AudioContext) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Different frequencies for different sounds
        const frequencies: { [key: string]: number } = {
          click: 800,
          whistle: 1000,
          goal: 600,
          transition: 400,
          celebration: 500,
          powerup: 300,
          coin: 900,
          jump: 700,
        }

        oscillator.frequency.value = frequencies[soundName] || 440
        oscillator.type = "square"

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      }
    } catch (error) {
      // Silently fail if audio doesn't work
      console.log("Audio not available")
    }
  }

  const playMusic = (musicName: string, loop = true) => {
    // Simple implementation - just play a sound for now
    if (!isMuted) {
      playSound("celebration")
    }
  }

  const stopMusic = () => {
    // No-op for now
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const setVolume = (volume: number) => {
    // No-op for now
  }

  const contextValue: AudioContextType = {
    playSound,
    playMusic,
    stopMusic,
    isMuted,
    toggleMute,
    setVolume,
  }

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>
}
