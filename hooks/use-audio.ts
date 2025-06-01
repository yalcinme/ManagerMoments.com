"use client"

// Simplified audio hook without external dependencies
export function useAudio() {
  const playSound = (soundType: string) => {
    // No-op function - audio functionality removed
    console.log(`Sound would play: ${soundType}`)
  }

  return {
    playSound,
    isEnabled: false,
    toggle: () => {},
    setEnabled: () => {},
  }
}
