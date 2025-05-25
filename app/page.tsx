"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Loader2 } from "lucide-react"
import RetroIntroScreen from "@/components/retro-intro-screen"
import RetroGameExperience from "@/components/retro-game-experience"
import type { FPLData } from "@/types/fpl"

type GameState = "intro" | "loading" | "game" | "error"

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [fplData, setFplData] = useState<FPLData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Simple analytics function
  const trackEvent = useCallback((eventName: string, properties?: any) => {
    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", eventName, properties || {})
      }
    } catch (error) {
      // Silent fail
    }
  }, [])

  // Preload critical images
  useEffect(() => {
    const preloadImages = [
      "/images/season-kickoff-new.png",
      "/images/peak-performance-new.png",
      "/images/captaincy-masterclass-new.png",
      "/images/transfer-market-new.png",
      "/images/consistency-check-new.png",
      "/images/bench-management-new.png",
      "/images/stadium-background.jpg",
    ]

    preloadImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const handleStartGame = async (managerId: string) => {
    setError(null)
    setGameState("loading")

    trackEvent("manager_id_submit", {
      event_category: "user_input",
      event_label: "manager_id_entered",
      value: Number.parseInt(managerId) || 0,
    })

    try {
      const response = await fetch(`/api/fpl-data/${managerId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch FPL data")
      }

      setFplData(data)
      setGameState("game")

      trackEvent("game_start", {
        event_category: "game_flow",
        event_label: "fpl_data_loaded",
        manager_id: managerId,
        total_points: data.totalPoints,
        overall_rank: data.overallRank,
      })
    } catch (err) {
      console.error("Error fetching FPL data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      setGameState("error")

      trackEvent("error", {
        event_category: "error",
        event_label: "fpl_data_fetch_failed",
        error_message: err instanceof Error ? err.message : "Unknown error",
        manager_id: managerId,
      })
    }
  }

  const handleRestart = () => {
    setGameState("intro")
    setFplData(null)
    setError(null)

    trackEvent("game_restart", {
      event_category: "game_flow",
      event_label: "user_restarted_experience",
    })
  }

  if (gameState === "intro") {
    return <RetroIntroScreen onStart={handleStartGame} error={error} />
  }

  if (gameState === "game" && fplData) {
    return <RetroGameExperience data={fplData} onRestart={handleRestart} />
  }

  return (
    <div className="safe-screen-height safe-screen-width relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat gpu-accelerated"
        style={{
          backgroundImage: "url('/images/stadium-background.jpg')",
          filter: "brightness(0.7)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-responsive-md">
        <div className="w-full container-responsive-md">
          <AnimatePresence mode="wait">
            {gameState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="pixel-card p-responsive-lg bg-white text-center gpu-accelerated"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="text-4xl mb-4"
                >
                  ⚽
                </motion.div>
                <h2 className="font-display text-title text-high-contrast-dark mb-2">LOADING YOUR SEASON</h2>
                <p className="font-body text-small text-gray-700 mb-4">Analyzing your FPL journey...</p>
                <div className="flex items-center justify-center space-responsive-xs">
                  <Loader2 className="icon-responsive-md animate-spin" />
                  <span className="font-body text-small text-gray-600">Please wait</span>
                </div>
              </motion.div>
            )}

            {gameState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="pixel-card p-responsive-lg bg-white text-center gpu-accelerated"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

                <div className="text-4xl mb-4">❌</div>
                <h2 className="font-display text-title text-high-contrast-dark mb-2">OOPS!</h2>
                <p className="font-body text-small text-gray-700 mb-4">{error}</p>
                <div className="space-responsive-sm">
                  <Button
                    onClick={handleRestart}
                    className="cta-button w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-2 border-black font-bold gpu-accelerated"
                  >
                    <span className="text-button font-bold">TRY AGAIN</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Home Button */}
        {gameState !== "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Button
              onClick={handleRestart}
              className="pixel-button p-3 bg-white bg-opacity-90 hover:bg-opacity-100 border-2 border-black shadow-lg gpu-accelerated"
              style={{
                width: "clamp(44px, 10vw + 0.5rem, 60px)",
                height: "clamp(44px, 10vw + 0.5rem, 60px)",
              }}
            >
              <Home className="icon-responsive-md" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
