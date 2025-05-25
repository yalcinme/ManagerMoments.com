"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import RetroInsightCard from "./retro-insight-card"
import RetroFinalCard from "./retro-final-card"
import { retroInsights } from "@/lib/insights-retro"
import { useAudio } from "@/hooks/use-audio"

interface RetroGameExperienceProps {
  data: FPLData
  onRestart: () => void
}

export default function RetroGameExperience({ data, onRestart }: RetroGameExperienceProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [showFinal, setShowFinal] = useState(false)
  const { playSound } = useAudio()

  const currentInsight = retroInsights[currentInsightIndex]
  const isLastInsight = currentInsightIndex === retroInsights.length - 1

  useEffect(() => {
    if (isPaused || !autoPlay || showFinal) return

    const timer = setTimeout(() => {
      if (isLastInsight) {
        setShowFinal(true)
        playSound("celebration")
      } else {
        nextInsight()
      }
    }, 7000) // Increased from 4000ms to 7000ms for better readability

    return () => clearTimeout(timer)
  }, [currentInsightIndex, isPaused, autoPlay, isLastInsight])

  const nextInsight = () => {
    if (currentInsightIndex < retroInsights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1)
      playSound("transition")
    } else {
      setShowFinal(true)
      playSound("celebration")
    }
  }

  const prevInsight = () => {
    if (currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1)
      playSound("transition")
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") nextInsight()
    if (e.key === "ArrowLeft") prevInsight()
    if (e.key === " ") {
      e.preventDefault()
      setIsPaused(!isPaused)
      playSound("whistle")
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentInsightIndex, isPaused])

  if (showFinal) {
    return <RetroFinalCard data={data} onRestart={onRestart} onBack={() => setShowFinal(false)} />
  }

  return (
    <AnimatePresence mode="wait">
      <RetroInsightCard
        key={currentInsightIndex}
        insight={currentInsight}
        data={data}
        onNext={nextInsight}
        onPrev={prevInsight}
        canGoNext={!isLastInsight}
        canGoPrev={currentInsightIndex > 0}
        isPaused={isPaused}
      />
    </AnimatePresence>
  )
}
