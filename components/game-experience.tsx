"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import InsightCard from "./insight-card"
import GameControls from "./game-controls"
import ProgressIndicator from "./progress-indicator"
import SceneWrapper from "./scene-wrapper"
import FinalSummary from "./final-summary"
import AudioToggle from "./audio-toggle"
import { insights } from "@/lib/insights"
import { useAudio } from "@/hooks/use-audio"

interface GameExperienceProps {
  data: FPLData
  onRestart: () => void
}

export default function GameExperience({ data, onRestart }: GameExperienceProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [showFinal, setShowFinal] = useState(false)
  const { playSound } = useAudio()

  const currentInsight = insights[currentInsightIndex]
  const isLastInsight = currentInsightIndex === insights.length - 1

  useEffect(() => {
    if (isPaused || !autoPlay || showFinal) return

    const timer = setTimeout(() => {
      if (isLastInsight) {
        setShowFinal(true)
        playSound("celebration")
      } else {
        nextInsight()
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [currentInsightIndex, isPaused, autoPlay, isLastInsight])

  const nextInsight = () => {
    if (currentInsightIndex < insights.length - 1) {
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

  const jumpToInsight = (index: number) => {
    setCurrentInsightIndex(index)
    setShowFinal(false)
    playSound("click")
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
    return <FinalSummary data={data} onRestart={onRestart} onBack={() => setShowFinal(false)} />
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* TV Frame */}
      <div className="tv-frame h-full w-full p-4">
        <SceneWrapper scene={currentInsight.scene as any}>
          {/* Fixed UI Elements */}
          <ProgressIndicator
            current={currentInsightIndex}
            total={insights.length}
            onJumpTo={jumpToInsight}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
          />

          <GameControls
            isPaused={isPaused}
            autoPlay={autoPlay}
            onPause={() => {
              setIsPaused(!isPaused)
              playSound("whistle")
            }}
            onAutoPlayToggle={() => {
              setAutoPlay(!autoPlay)
              playSound("click")
            }}
            onSkip={() => {
              setShowFinal(true)
              playSound("celebration")
            }}
            onRestart={onRestart}
            className="absolute top-4 right-4 z-20"
          />

          <AudioToggle className="absolute bottom-4 right-4 z-20" />

          {/* Main Content Area */}
          <div className="h-full w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <InsightCard
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
          </div>
        </SceneWrapper>
      </div>
    </div>
  )
}
