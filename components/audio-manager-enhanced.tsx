"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"

interface AudioContextType {
  playSound: (soundName: string) => void
  playMusic: (musicName: string, loop?: boolean) => void
  stopMusic: () => void
  isMuted: boolean
  toggleMute: () => void
  setVolume: (volume: number) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export { AudioContext }

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within AudioManager")
  }
  return context
}

// Enhanced 16-bit style sound generation using Web Audio API
class RetroSoundGenerator {
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  generateBeep(frequency: number, duration: number, type: OscillatorType = "square") {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  generateWhistle() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1)
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2)
    oscillator.type = "square"

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  generateGoal() {
    if (!this.audioContext) return

    // Goal celebration sound - ascending notes with harmony
    const frequencies = [262, 330, 392, 523, 659] // C, E, G, C, E
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.generateBeep(freq, 0.3, "square")
        // Add harmony
        if (index > 0) {
          setTimeout(() => this.generateBeep(freq * 1.25, 0.2, "triangle"), 50)
        }
      }, index * 120)
    })
  }

  generatePowerUp() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.5)
    oscillator.type = "sawtooth"

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.5)
  }

  generateCoin() {
    if (!this.audioContext) return

    // Classic coin sound - two quick ascending notes
    this.generateBeep(660, 0.1, "square")
    setTimeout(() => this.generateBeep(880, 0.1, "square"), 100)
  }

  generateJump() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.1)
    oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 0.2)
    oscillator.type = "square"

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }

  generateCelebration() {
    if (!this.audioContext) return

    // Multi-layered celebration with fireworks effect
    this.generateGoal()
    setTimeout(() => this.generatePowerUp(), 300)
    setTimeout(() => this.generateCoin(), 600)
    setTimeout(() => this.generateGoal(), 900)
  }

  generateMenuMusic() {
    if (!this.audioContext) return

    // Simple melody loop for menu
    const melody = [262, 294, 330, 349, 392, 440, 494, 523] // C major scale
    melody.forEach((freq, index) => {
      setTimeout(() => {
        this.generateBeep(freq, 0.4, "triangle")
      }, index * 500)
    })
  }
}

export default function AudioManagerEnhanced({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(0.3)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const soundGenerator = useRef<RetroSoundGenerator | null>(null)

  useEffect(() => {
    soundGenerator.current = new RetroSoundGenerator()

    // Initialize audio files
    const sounds = {
      click: "/sounds/retro-click.mp3",
      whistle: "/sounds/retro-whistle.mp3",
      goal: "/sounds/retro-goal.mp3",
      transition: "/sounds/retro-transition.mp3",
      celebration: "/sounds/retro-celebration.mp3",
      powerup: "/sounds/retro-powerup.mp3",
      coin: "/sounds/retro-coin.mp3",
      jump: "/sounds/retro-jump.mp3",
    }

    const music = {
      background: "/music/retro-background.mp3",
      champions: "/music/champions-league-theme.mp3",
      menu: "/music/retro-menu.mp3",
    }

    // Load sound effects
    Object.entries(sounds).forEach(([name, src]) => {
      const audio = new Audio()
      audio.preload = "auto"
      audio.volume = volume
      audio.onerror = () => {
        console.log(`Audio file ${src} not found, using generated sound`)
      }
      try {
        audio.src = src
      } catch (e) {
        console.log(`Could not load ${src}`)
      }
      audioRefs.current[name] = audio
    })

    // Load music
    Object.entries(music).forEach(([name, src]) => {
      const audio = new Audio()
      audio.preload = "auto"
      audio.volume = volume * 0.5
      audio.loop = true
      try {
        audio.src = src
      } catch (e) {
        console.log(`Could not load ${src}`)
      }
      audioRefs.current[`music_${name}`] = audio
    })
  }, [])

  useEffect(() => {
    // Update volume for all audio elements
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio.src.includes("music")) {
        audio.volume = volume * 0.5
      } else {
        audio.volume = volume
      }
    })
    if (musicRef.current) {
      musicRef.current.volume = volume * 0.5
    }
  }, [volume])

  const playSound = (soundName: string) => {
    if (isMuted) return

    const audio = audioRefs.current[soundName]
    if (audio && audio.src) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Fallback to generated sound
        playGeneratedSound(soundName)
      })
    } else {
      // Use generated sound
      playGeneratedSound(soundName)
    }
  }

  const playGeneratedSound = (soundName: string) => {
    if (isMuted || !soundGenerator.current) return

    switch (soundName) {
      case "click":
        soundGenerator.current.generateBeep(800, 0.1, "square")
        break
      case "whistle":
        soundGenerator.current.generateWhistle()
        break
      case "goal":
        soundGenerator.current.generateGoal()
        break
      case "transition":
        soundGenerator.current.generateBeep(400, 0.2, "triangle")
        break
      case "celebration":
        soundGenerator.current.generateCelebration()
        break
      case "powerup":
        soundGenerator.current.generatePowerUp()
        break
      case "coin":
        soundGenerator.current.generateCoin()
        break
      case "jump":
        soundGenerator.current.generateJump()
        break
    }
  }

  const playMusic = (musicName: string, loop = true) => {
    if (isMuted) return

    // Stop current music
    stopMusic()

    const audio = audioRefs.current[`music_${musicName}`]
    if (audio && audio.src) {
      audio.loop = loop
      audio.currentTime = 0
      musicRef.current = audio
      audio.play().catch(() => {
        console.log("Could not play music:", musicName)
        // Fallback to generated music for menu
        if (musicName === "menu") {
          soundGenerator.current?.generateMenuMusic()
        }
      })
    } else if (musicName === "menu") {
      // Generate menu music if file not available
      soundGenerator.current?.generateMenuMusic()
    }
  }

  const stopMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause()
      musicRef.current.currentTime = 0
      musicRef.current = null
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopMusic()
    }
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }

  return (
    <AudioContext.Provider value={{ playSound, playMusic, stopMusic, isMuted, toggleMute, setVolume }}>
      {children}
    </AudioContext.Provider>
  )
}
