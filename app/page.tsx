"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorBoundary } from "@/components/error-boundary"
import LoadingScreen from "@/components/loading-screen"
import { IntroScreen } from "@/components/intro-screen"
import FIFA25InsightCard from "@/components/fifa25-insight-card"
import FIFA25FinalSummary from "@/components/fifa25-final-summary"
import { insights } from "@/lib/insights"
import type { FPLData } from "@/types/fpl"

const sections = [
  "intro",
  "season-summary",
  "captain-performance",
  "transfer-activity",
  "bench-analysis",
  "biggest-gameweek",
  "one-got-away",
  "you-vs-game",
  "final-summary",
]

type LoadingStage = "fetching" | "processing" | "analyzing" | "finalizing"

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [fplData, setFplData] = useState<FPLData | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("fetching")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [managerId, setManagerId] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchFPLData = async (id: string) => {
    setLoading(true)
    setError(null)
    setLoadingProgress(0)
    setLoadingStage("fetching")

    try {
      console.log("🔄 Starting fetch for ID:", id)

      // Stage 1: Fetching
      setLoadingStage("fetching")
      setLoadingProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const response = await fetch(`/api/fpl-data/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      setLoadingProgress(30)
      console.log("📡 Response status:", response.status)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
        }
        if (response.status === 403) {
          errorMessage = "Unable to fetch FPL data. The service is currently unavailable."
        }
        throw new Error(errorMessage)
      }

      // Stage 2: Processing
      setLoadingStage("processing")
      setLoadingProgress(50)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format. Expected JSON.")
      }

      const data = await response.json()
      console.log("📊 Received data:", {
        keys: Object.keys(data),
        managerName: data.managerName,
        totalPoints: data.totalPoints,
        hasInsightData: !!data.captainPerformance,
      })

      setLoadingProgress(70)

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data received from server")
      }

      // Validate essential fields
      if (!data.managerName || typeof data.totalPoints !== "number") {
        console.error("❌ Data validation failed:", { managerName: data.managerName, totalPoints: data.totalPoints })
        throw new Error("Incomplete data received from server")
      }

      // Stage 3: Analyzing
      setLoadingStage("analyzing")
      setLoadingProgress(85)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Stage 4: Finalizing
      setLoadingStage("finalizing")
      setLoadingProgress(95)
      await new Promise((resolve) => setTimeout(resolve, 400))

      setLoadingProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 300))

      console.log("✅ Setting FPL data and moving to section 1")
      setFplData(data)
      setManagerId(id)
      setCurrentSection(1) // Move to first insight after intro
    } catch (err) {
      console.error("❌ Fetch error:", err)
      let errorMessage = "An unexpected error occurred"

      if (err instanceof Error) {
        if (err.message.includes("403") || err.message.includes("unavailable")) {
          errorMessage = "Unable to fetch FPL data. Please try again later."
        } else if (err.message.includes("404")) {
          errorMessage = "Manager not found. Please check your FPL Manager ID."
        } else if (err.message.includes("429")) {
          errorMessage = "Too many requests. Please wait a moment and try again."
        } else if (err.message.includes("503")) {
          errorMessage = "FPL servers are currently unavailable. Please try again later."
        } else if (err.message.includes("Invalid response format")) {
          errorMessage = "Server returned invalid data. Please try again."
        } else if (err.message.includes("Incomplete data")) {
          errorMessage = "Received incomplete data from server. Please try again."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    console.log("🔄 Next clicked, current section:", currentSection)
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrev = () => {
    console.log("🔄 Prev clicked, current section:", currentSection)
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleHome = () => {
    console.log("🏠 Home clicked")
    setCurrentSection(0)
    setFplData(null)
    setManagerId("")
    setError(null)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (loading) return

    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault()
      handleNext()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      handlePrev()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleHome()
    }
  }

  useEffect(() => {
    if (mounted) {
      window.addEventListener("keydown", handleKeyPress)
      return () => window.removeEventListener("keydown", handleKeyPress)
    }
  }, [currentSection, loading, mounted])

  const renderCurrentSection = () => {
    console.log("🎨 Rendering section:", {
      loading,
      currentSection,
      sectionName: sections[currentSection],
      hasFplData: !!fplData,
    })

    // Show enhanced loading screen during data fetch
    if (loading) {
      return <LoadingScreen stage={loadingStage} progress={loadingProgress} />
    }

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
      return <FIFA25FinalSummary data={fplData} onRestart={handleHome} onHome={handleHome} />
    }

    if (fplData) {
      const insight = insights.find((i) => i.id === sectionName)
      console.log("🔍 Found insight:", { insightId: sectionName, found: !!insight })

      if (insight) {
        try {
          return (
            <FIFA25InsightCard
              insight={insight}
              data={fplData}
              onNext={handleNext}
              onPrev={handlePrev}
              onHome={handleHome}
              currentIndex={currentSection}
              totalSections={sections.length}
            />
          )
        } catch (error) {
          console.error("❌ Error rendering insight:", error)
          return (
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-white text-xl">Error loading insight: {sectionName}</div>
            </div>
          )
        }
      } else {
        console.error("❌ No insight found for section:", sectionName)
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-xl">Insight not found: {sectionName}</div>
          </div>
        )
      }
    }

    console.log("❌ No FPL data available")
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">No data available</div>
      </div>
    )
  }

  // Show loading fallback until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="viewport-fit w-full bg-black min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? "loading" : `section-${currentSection}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            {renderCurrentSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}
