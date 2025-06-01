"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import RetroInsightCard from "./retro-insight-card"
import RetroFinalCard from "./retro-final-card"
import { retroInsights } from "@/lib/insights-retro"
import { useAudio } from "@/components/simple-audio-manager"

interface RetroGameExperienceProps {
  data: FPLData
  onRestart: () => void
}

export default function RetroGameExperience({ data, onRestart }: RetroGameExperienceProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isUserHolding, setIsUserHolding] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [showFinal, setShowFinal] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const { playSound } = useAudio()
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pressStartTimeRef = useRef<number>(0)
  const pressPositionRef = useRef<{ x: number; y: number } | null>(null)

  const currentInsight = retroInsights[currentInsightIndex]
  const isLastInsight = currentInsightIndex === retroInsights.length - 1

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

  // Preload images for smooth experience
  useEffect(() => {
    const imageUrls = [
      "/images/season-kickoff-new.png",
      "/images/peak-performance-new.png",
      "/images/captaincy-masterclass-new.png",
      "/images/transfer-market-new.png",
      "/images/consistency-check-new.png",
      "/images/bench-management-new.png",
      "/images/stadium-background.jpg",
    ]

    let loadedCount = 0
    const totalImages = imageUrls.length

    const handleImageLoad = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setImagesLoaded(true)
      }
    }

    imageUrls.forEach((url) => {
      const img = new Image()
      img.onload = handleImageLoad
      img.onerror = handleImageLoad // Count errors as loaded to prevent hanging
      img.src = url
    })

    // Fallback timeout
    const timeout = setTimeout(() => {
      setImagesLoaded(true)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  const nextInsight = useCallback(() => {
    if (currentInsightIndex < retroInsights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1)
      playSound("transition")
      trackEvent("insight_next", { insight_index: currentInsightIndex + 1 })
    } else {
      setShowFinal(true)
      playSound("celebration")
      trackEvent("game_complete")
    }
  }, [currentInsightIndex, playSound, trackEvent])

  const prevInsight = useCallback(() => {
    if (currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1)
      playSound("transition")
      trackEvent("insight_prev", { insight_index: currentInsightIndex - 1 })
    }
  }, [currentInsightIndex, playSound, trackEvent])

  const handleHome = useCallback(() => {
    trackEvent("game_restart")
    onRestart()
  }, [onRestart, trackEvent])

  // Get touch/click position
  const getEventPosition = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if ("clientX" in e) {
      return { x: e.clientX, y: e.clientY }
    }
    return { x: 0, y: 0 }
  }

  // Instagram-style touch/mouse handlers
  const handlePressStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
      e.preventDefault()

      const position = getEventPosition(e)
      pressPositionRef.current = position
      pressStartTimeRef.current = Date.now()
      setIsUserHolding(true)

      // Clear any existing timeout
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
      }

      // Set a delay before actually pausing (hold detection)
      holdTimeoutRef.current = setTimeout(() => {
        setIsPaused(true)
        playSound("whistle")
        trackEvent("game_pause")
      }, 300) // 300ms to distinguish between tap and hold
    },
    [playSound, trackEvent],
  )

  const handlePressEnd = useCallback(() => {
    const pressDuration = Date.now() - pressStartTimeRef.current
    const wasHolding = pressDuration >= 300

    setIsUserHolding(false)

    // Clear the timeout if user releases before delay
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }

    // If it was a hold, just resume
    if (wasHolding && isPaused) {
      setIsPaused(false)
      trackEvent("game_resume")
      return
    }

    // If it was a quick tap (not a hold), handle navigation
    if (!wasHolding && pressPositionRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tapX = pressPositionRef.current.x - containerRect.left
      const containerWidth = containerRect.width
      const isRightSide = tapX > containerWidth / 2

      if (isRightSide) {
        // Right side tap - go next
        if (currentInsightIndex < retroInsights.length - 1) {
          nextInsight()
        } else {
          setShowFinal(true)
          playSound("celebration")
          trackEvent("game_complete")
        }
      } else {
        // Left side tap - go previous
        if (currentInsightIndex > 0) {
          prevInsight()
        }
      }
    }

    // Resume if we were paused by user hold
    if (isPaused) {
      setIsPaused(false)
      trackEvent("game_resume")
    }

    pressPositionRef.current = null
  }, [isPaused, currentInsightIndex, nextInsight, prevInsight, playSound, trackEvent])

  // Handle mouse/touch events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => handlePressStart(e)
    const handleMouseUp = () => handlePressEnd()
    const handleMouseLeave = () => {
      // On mouse leave, treat as release but don't navigate
      setIsUserHolding(false)
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
        holdTimeoutRef.current = null
      }
      if (isPaused) {
        setIsPaused(false)
        trackEvent("game_resume")
      }
      pressPositionRef.current = null
    }

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      handlePressStart(e)
    }
    const handleTouchEnd = () => handlePressEnd()
    const handleTouchCancel = () => {
      // On touch cancel, treat as release but don't navigate
      setIsUserHolding(false)
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
        holdTimeoutRef.current = null
      }
      if (isPaused) {
        setIsPaused(false)
        trackEvent("game_resume")
      }
      pressPositionRef.current = null
    }

    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("mouseleave", handleMouseLeave)
    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)
    container.addEventListener("touchcancel", handleTouchCancel)

    return () => {
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mouseup", handleMouseUp)
      container.removeEventListener("mouseleave", handleMouseLeave)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", handleTouchCancel)

      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current)
      }
    }
  }, [handlePressStart, handlePressEnd, isPaused, trackEvent])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextInsight()
      if (e.key === "ArrowLeft") prevInsight()
      if (e.key === " ") {
        e.preventDefault()
        setIsPaused(!isPaused)
        playSound("whistle")
        trackEvent(isPaused ? "game_resume" : "game_pause")
      }
    },
    [nextInsight, prevInsight, isPaused, playSound, trackEvent],
  )

  useEffect(() => {
    if (isPaused || !autoPlay || showFinal || isUserHolding || !imagesLoaded) return

    const timer = setTimeout(() => {
      if (isLastInsight) {
        setShowFinal(true)
        playSound("celebration")
        trackEvent("game_complete")
      } else {
        nextInsight()
      }
    }, 7000)

    return () => clearTimeout(timer)
  }, [
    currentInsightIndex,
    isPaused,
    autoPlay,
    showFinal,
    isLastInsight,
    nextInsight,
    playSound,
    isUserHolding,
    imagesLoaded,
    trackEvent,
  ])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  // Track game start
  useEffect(() => {
    trackEvent("game_start", { manager_id: data.managerId })
  }, [data.managerId, trackEvent])

  if (showFinal) {
    return <RetroFinalCard data={data} onRestart={onRestart} onBack={() => setShowFinal(false)} />
  }

  // Loading state while images are loading
  if (!imagesLoaded) {
    return (
      <div className="safe-screen-height safe-screen-width flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">⚽</div>
          <div className="font-display text-title text-white mb-2">LOADING EXPERIENCE</div>
          <div className="font-body text-small text-gray-300">Preparing your journey...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen relative select-none gpu-accelerated"
      style={{ touchAction: "none" }}
    >
      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <div className="font-body text-small">⏸️ PAUSED</div>
        </div>
      )}

      {/* Hold indicator */}
      {isUserHolding && !isPaused && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 bg-opacity-90 text-black px-4 py-2 rounded-lg">
          <div className="font-body text-small">🤏 HOLD TO PAUSE</div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <RetroInsightCard
          key={currentInsightIndex}
          insight={currentInsight}
          data={data}
          onNext={nextInsight}
          onPrev={prevInsight}
          onHome={handleHome}
          canGoNext={!isLastInsight}
          canGoPrev={currentInsightIndex > 0}
          isPaused={isPaused || isUserHolding}
        />
      </AnimatePresence>
    </div>
  )
}
