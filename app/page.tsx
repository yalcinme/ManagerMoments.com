"use client"

import { useState, Suspense, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import RetroIntroScreen from "@/components/retro-intro-screen"
import RetroLoadingScreen from "@/components/retro-loading-screen"
import ErrorBoundary from "@/components/error-boundary"
import { setupGlobalErrorHandling, ProductionMonitor } from "@/lib/monitoring"
import type { FPLData } from "@/types/fpl"

// Lazy load components with proper error handling
const AudioManagerEnhanced = dynamic(() => import("@/components/audio-manager-enhanced"), {
  loading: () => <div>Loading audio...</div>,
  ssr: false,
})

const AudioFallback = dynamic(() => import("@/components/audio-fallback"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})

const RetroGameExperience = dynamic(() => import("@/components/retro-game-experience"), {
  loading: () => <RetroLoadingScreen />,
  ssr: false,
})

export default function Home() {
  const [gameState, setGameState] = useState<"intro" | "loading" | "playing">("intro")
  const [fplData, setFPLData] = useState<FPLData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [audioError, setAudioError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Initialize monitoring
  useEffect(() => {
    setupGlobalErrorHandling()
    const monitor = ProductionMonitor.getInstance()
    monitor.trackUserAction("app_loaded")
  }, [])

  const handleStartGame = async (managerId: string) => {
    const monitor = ProductionMonitor.getInstance()
    setGameState("loading")
    setError(null)
    setRetryCount(0)

    try {
      monitor.trackUserAction("game_start_attempted", { managerId })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // Increased timeout

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

      // Enhanced data validation
      if (!data || typeof data !== "object" || !data.managerName) {
        throw new Error("Invalid response data received")
      }

      // Additional validation
      if (typeof data.totalPoints !== "number" || data.totalPoints < 0) {
        throw new Error("Invalid points data received")
      }

      setFPLData(data)
      setGameState("playing")
      monitor.trackUserAction("game_start_success", { managerId })
    } catch (err) {
      console.error("Error fetching FPL data:", err)
      monitor.trackError(err instanceof Error ? err : String(err), { managerId, retryCount })

      let errorMessage = "An unexpected error occurred. Please try again."

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again or use demo mode."
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (err.message.includes("Manager not found")) {
          errorMessage = "Manager not found. Please check your Manager ID or try demo mode."
        } else if (err.message.includes("Too many requests")) {
          errorMessage = "Too many requests. Please wait a moment before trying again."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      setGameState("intro")
      setRetryCount((prev) => prev + 1)
    }
  }

  const handleRestart = () => {
    const monitor = ProductionMonitor.getInstance()
    monitor.trackUserAction("game_restart")

    setGameState("intro")
    setFPLData(null)
    setError(null)
    setRetryCount(0)
  }

  // Audio Manager with fallback
  const AudioManager = audioError ? AudioFallback : AudioManagerEnhanced

  return (
    <ErrorBoundary>
      <ErrorBoundary
        onError={(error) => {
          console.log("Audio manager failed, using fallback")
          const monitor = ProductionMonitor.getInstance()
          monitor.trackError("Audio manager failed", { error: error.message })
          setAudioError(true)
        }}
      >
        <AudioManager>
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
        </AudioManager>
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
