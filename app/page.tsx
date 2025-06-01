"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingFallback } from "@/components/loading-fallback"
import { IntroScreen } from "@/components/intro-screen"
import { FIFA25InsightCard } from "@/components/fifa25-insight-card"
import { FIFA25FinalSummary } from "@/components/fifa25-final-summary"
import { insights } from "@/lib/insights"
import type { FPLData } from "@/types/fpl"

const sections = [
  "intro",
  "season-summary",
  "captain-performance",
  "transfer-activity",
  "bench-analysis",
  "biggest-gameweek",
  "mvp-analysis",
  "form-player",
  "one-got-away",
  "you-vs-game",
  "final-summary",
]

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [fplData, setFplData] = useState<FPLData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [managerId, setManagerId] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const fetchFPLData = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Fetching FPL data for ID:", id)

      const response = await fetch(`/api/fpl-data/${id}`, {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Received data:", data)

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data received from server")
      }

      // Validate required fields
      if (!data.managerName || !data.totalPoints) {
        throw new Error("Incomplete data received from server")
      }

      setFplData(data)
      setManagerId(id)
      setCurrentSection(1) // Move to first insight after intro
    } catch (err) {
      console.error("Fetch error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentSection(currentSection + 1)
      setTimeout(() => setIsTransitioning(false), 800)
    }
  }

  const handlePrev = () => {
    if (currentSection > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentSection(currentSection - 1)
      setTimeout(() => setIsTransitioning(false), 800)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isTransitioning) return

    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault()
      handleNext()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      handlePrev()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentSection, isTransitioning])

  const renderCurrentSection = () => {
    const sectionName = sections[currentSection]

    if (sectionName === "intro") {
      return (
        <IntroScreen
          onStart={fetchFPLData}
          error={error}
          loading={loading}
          managerId={managerId}
          setManagerId={setManagerId}
        />
      )
    }

    if (sectionName === "final-summary" && fplData) {
      return (
        <FIFA25FinalSummary
          data={fplData}
          onRestart={() => {
            setIsTransitioning(true)
            setCurrentSection(0)
            setFplData(null)
            setManagerId("")
            setError(null)
            setTimeout(() => setIsTransitioning(false), 800)
          }}
        />
      )
    }

    if (fplData) {
      const insight = insights.find((i) => i.id === sectionName)
      if (insight) {
        return (
          <FIFA25InsightCard
            insight={insight}
            data={fplData}
            onNext={handleNext}
            onPrev={handlePrev}
            currentIndex={currentSection}
            totalSections={sections.length}
            isTransitioning={isTransitioning}
          />
        )
      }
    }

    return <LoadingFallback />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="min-h-screen w-full"
          >
            {renderCurrentSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}
