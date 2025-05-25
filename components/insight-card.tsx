"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"
import type { Insight } from "@/lib/insights"
import PixelAvatar from "./pixel-avatar"
import FootballIcon from "./football-icon"
import { useAudio } from "@/components/audio-manager"

interface InsightCardProps {
  insight: Insight
  data: FPLData
  onNext: () => void
  onPrev: () => void
  canGoNext: boolean
  canGoPrev: boolean
  isPaused: boolean
}

export default function InsightCard({
  insight,
  data,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  isPaused,
}: InsightCardProps) {
  const insightData = insight.getData(data)
  const { playSound } = useAudio()

  const handleNext = () => {
    playSound("goal")
    onNext()
  }

  const handlePrev = () => {
    playSound("click")
    onPrev()
  }

  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto p-4">
      {/* Scene Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-none text-center py-4"
      >
        <div className="modern-card inline-block px-6 py-3 rounded-xl">
          <span className="text-white font-display text-lg">{insight.sceneTitle}</span>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-6 px-4 min-h-0">
        {/* Character and Icon Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex items-center justify-center space-x-8"
        >
          <PixelAvatar isMoving={!isPaused} teamColor="#667eea" size="large" />
          <FootballIcon type={insight.iconType || "ball"} animated={!isPaused} size="large" />
        </motion.div>

        {/* Main Metric Display */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="modern-card rounded-2xl p-6 text-center max-w-lg w-full"
        >
          {/* Title */}
          <h2 className="text-2xl font-display text-white mb-4 text-clamp-2">{insightData.title}</h2>

          {/* Big Number */}
          {insightData.primaryValue && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="mb-4"
            >
              <div className="text-5xl md:text-6xl font-display text-gradient-accent mb-2">
                {insightData.primaryValue}
              </div>
              {insightData.primaryLabel && (
                <div className="text-white font-body text-sm text-ellipsis">{insightData.primaryLabel}</div>
              )}
            </motion.div>
          )}

          {/* Secondary Stats Grid */}
          {insightData.secondaryStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-3 mb-4"
            >
              {insightData.secondaryStats.slice(0, 4).map((stat, index) => (
                <div key={index} className="modern-card rounded-lg p-3 text-center">
                  <div className="text-xl font-display text-white mb-1 text-ellipsis">{stat.value}</div>
                  <div className="text-xs font-body text-slate-200 text-ellipsis">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Caption and Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex-none p-4 space-y-4"
      >
        {/* Caption */}
        <div className="text-center">
          <p className="text-lg font-body text-white leading-relaxed max-w-lg mx-auto text-clamp-3">
            {insightData.description}
          </p>
          {insightData.funFact && (
            <p className="text-sm font-body text-cyan-200 mt-2 max-w-lg mx-auto text-clamp-2">
              💡 {insightData.funFact}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="modern-button disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-white rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span className="font-display">Back</span>
          </Button>

          <Button onClick={handleNext} disabled={!canGoNext} className="modern-button px-6 py-3 text-white rounded-xl">
            <span className="font-display">{canGoNext ? "Next" : "Finish"}</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
