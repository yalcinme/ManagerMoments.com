"use client"

import { useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import RetroIntroScreen from "@/components/retro-intro-screen"
import RetroLoadingScreen from "@/components/retro-loading-screen"
import AudioManagerEnhanced from "@/components/audio-manager-enhanced"
import ErrorBoundary from "@/components/error-boundary"
import type { FPLData } from "@/types/fpl"

// Lazy load the game experience for better performance
const RetroGameExperience = dynamic(() => import("@/components/retro-game-experience"), {
  loading: () => <RetroLoadingScreen />,
  ssr: false, // Disable SSR for this component as it uses browser APIs
})

export default function Home() {
  const [gameState, setGameState] = useState<"intro" | "loading" | "playing">("intro")
  const [fplData, setFPLData] = useState<FPLData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleStartGame = async (managerId: string) => {
    setGameState("loading")
    setError(null)

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(`/api/fpl-data/${encodeURIComponent(managerId)}`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      // Validate response data
      if (!data || typeof data !== "object" || !data.managerName) {
        throw new Error("Invalid response data")
      }

      setFPLData(data)
      setGameState("playing")
    } catch (err) {
      console.error("Error fetching FPL data:", err)

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.")
        } else if (err.message.includes("Failed to fetch")) {
          setError("Network error. Please check your connection and try again.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }

      setGameState("intro")
    }
  }

  const handleRestart = () => {
    setGameState("intro")
    setFPLData(null)
    setError(null)
  }

  return (
    <ErrorBoundary>
      <AudioManagerEnhanced>
        <div className="h-screen w-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {gameState === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RetroIntroScreen onStart={handleStartGame} error={error} />
              </motion.div>
            )}

            {gameState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RetroLoadingScreen />
              </motion.div>
            )}

            {gameState === "playing" && fplData && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Suspense fallback={<RetroLoadingScreen />}>
                  <RetroGameExperience data={fplData} onRestart={handleRestart} />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AudioManagerEnhanced>
    </ErrorBoundary>
  )
}
