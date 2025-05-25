"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"
import type { RetroInsight } from "@/lib/insights-retro"
import RetroIcon from "./retro-icon"
import RetroAvatar from "./retro-avatar"
import { useAudio } from "./audio-manager-enhanced"
import { useEffect, useState } from "react"

interface RetroInsightCardProps {
  insight: RetroInsight
  data: FPLData
  onNext: () => void
  onPrev: () => void
  canGoNext: boolean
  canGoPrev: boolean
  isPaused: boolean
}

// Badge explanations
const badgeExplanations: { [key: string]: string } = {
  "CENTURY CLUB": "Scored 2000+ points this season - you're in the top tier of FPL managers!",
  "TRIPLE DIGITS": "Hit 100+ points in a single gameweek - only elite managers achieve this!",
  "SET & FORGET": "Made 20 or fewer transfers - you trusted your team and it paid off!",
  "TRANSFER KING": "Made 50+ transfers - you love tinkering with your team!",
  "CHIP MASTER": "Used 3+ chips effectively - you know how to maximize your tools!",
  "GREEN MACHINE": "Had 20+ green arrows - your rank kept improving throughout the season!",
  CONSISTENT: "Had 5 or fewer red arrows - you maintained steady performance!",
  "ABOVE AVERAGE": "Beat the gameweek average 25+ times - consistently outperformed other managers!",
  "TOP 100K": "Finished in the top 100,000 managers worldwide - exceptional performance!",
  "ELITE TIER": "Finished in the top 10,000 managers - you're among the very best!",
}

// Background image mapping
const getBackgroundImage = (insightId: string): string => {
  const imageMap: { [key: string]: string } = {
    "season-kickoff": "/images/season-kickoff.png",
    "peak-performance": "/images/peak-performance.jpeg",
    "captaincy-masterclass": "/images/captaincy-masterclass.jpeg",
    "transfer-market": "/images/transfer-market.jpeg",
    "consistency-check": "/images/consistency-check.jpeg",
    "bench-management": "/images/bench-management.png",
    "chip-effectiveness": "/images/chip-effectiveness.png",
    "season-recap": "/images/season-recap.png",
    "you-vs-the-game": "/images/you-vs-the-game.png",
    "mini-league-rivalry": "/images/mini-league-rivalry.png",
    "most-trusted-player": "/images/peak-performance.jpeg", // Reuse peak performance
  }

  return imageMap[insightId] || "/images/season-kickoff.png"
}

export default function RetroInsightCard({
  insight,
  data,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  isPaused,
}: RetroInsightCardProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  let insightData = insight.getData(data)

  // Add arrow explanations
  if (insight.id === "you-vs-the-game") {
    insightData = {
      ...insightData,
      funFact: "Green arrows mean your rank improved, red arrows mean your rank dropped.",
    }
  }

  const { playSound, playMusic } = useAudio()

  useEffect(() => {
    // Play background music for the game (reduced frequency)
    if (insight.id === "season-kickoff") {
      playMusic("background", true)
    }

    // Reduced sound effects - only play on key moments
    if (insight.id === "season-kickoff") {
      playSound("transition")
    } else if (insight.icon === "trophy") {
      setTimeout(() => playSound("goal"), 1000)
    }
  }, [insight.id])

  const handleNext = () => {
    // Reduced sound effects
    if (canGoNext) {
      playSound("coin")
      onNext()
    } else {
      playSound("celebration")
      onNext()
    }
  }

  const handlePrev = () => {
    onPrev()
  }

  const handleBadgeClick = (badge: string) => {
    setSelectedBadge(badge)
    playSound("coin")
  }

  const closeBadgeModal = () => {
    setSelectedBadge(null)
  }

  // Check if this is the season recap card
  const isSeasonRecap = insight.id === "season-recap"

  // Get background image for this insight
  const backgroundImage = getBackgroundImage(insight.id)

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Badge Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeBadgeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="pixel-card p-6 max-w-sm w-full bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-sm text-contrast-dark tracking-wide">{selectedBadge}</h3>
                <Button onClick={closeBadgeModal} className="pixel-button p-1 w-8 h-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="font-body text-xs text-contrast-dark leading-relaxed">
                {badgeExplanations[selectedBadge] || "Achievement unlocked!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm aspect-[3/5] flex flex-col relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-none mb-4"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="pixel-card p-3 text-center bg-white bg-opacity-95"
          >
            <h1 className="font-display text-xs text-contrast-dark tracking-wide">{insight.title}</h1>
          </motion.div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex-1 pixel-card p-6 flex flex-col bg-white bg-opacity-95"
        >
          {/* Character and Icon */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <RetroAvatar isMoving={!isPaused} kitColor="#ef4444" size="medium" role="manager" />
            <RetroIcon type={insight.icon} size="large" animated={!isPaused} />
          </div>

          {/* Main Stat */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="mb-2"
            >
              <div className="font-display text-2xl md:text-3xl text-contrast-dark tracking-wide mb-1">
                {insightData.mainStat}
              </div>
              <div className="font-body text-xs text-contrast-dark tracking-wide">{insightData.mainLabel}</div>
            </motion.div>
          </div>

          {/* Season Recap: Show Badges */}
          {isSeasonRecap ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-4"
            >
              <div className="text-center mb-3">
                <div className="font-display text-sm text-contrast-dark tracking-wide">BADGES EARNED</div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {data.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.9 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    onClick={() => handleBadgeClick(badge)}
                    className="pixel-card p-2 text-center bg-orange-200 cursor-pointer hover:bg-orange-300 transition-colors"
                  >
                    <div className="font-body text-xs text-contrast-dark truncate px-1">{badge}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-2">
                <div className="font-body text-xs text-contrast-dark opacity-70">Tap badges for details</div>
              </div>
            </motion.div>
          ) : (
            /* Regular Secondary Stats for other cards */
            insightData.secondaryStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-2 mb-4"
              >
                {insightData.secondaryStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="pixel-card p-2 text-center bg-white bg-opacity-90"
                  >
                    <div className="font-display text-sm text-contrast-dark tracking-wide truncate px-1">
                      {stat.value}
                    </div>
                    <div className="font-body text-xs text-contrast-dark truncate">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}

          {/* Description */}
          <div className="flex-1 flex flex-col justify-center text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="font-body text-sm text-contrast-dark leading-relaxed mb-3 px-2"
              style={{ lineHeight: "1.4" }}
            >
              {insightData.subtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="font-body text-xs text-contrast-dark leading-relaxed px-2"
              style={{ lineHeight: "1.3" }}
            >
              💡 {insightData.funFact}
            </motion.p>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex-none flex justify-between items-center mt-4 gap-4"
        >
          <Button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="pixel-button px-4 py-2 font-display text-xs tracking-wide disabled:opacity-50 bg-white bg-opacity-95"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext && !canGoPrev}
            className="pixel-button px-4 py-2 font-display text-xs tracking-wide bg-white bg-opacity-95"
          >
            {canGoNext ? "NEXT" : "END"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
