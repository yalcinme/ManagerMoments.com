"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"
import type { RetroInsight } from "@/lib/insights-retro"
import RetroIcon from "./retro-icon"
import { useAudio } from "./audio-manager-enhanced"
import { useEffect, useState } from "react"

interface RetroInsightCardProps {
  insight: RetroInsight
  data: FPLData
  onNext: () => void
  onPrev: () => void
  onHome: () => void
  canGoNext: boolean
  canGoPrev: boolean
  isPaused: boolean
}

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

const getBackgroundImage = (insightId: string): string => {
  const imageMap: { [key: string]: string } = {
    "season-kickoff": "/images/season-kickoff-new.png",
    "peak-performance": "/images/peak-performance-new.png",
    "captaincy-masterclass": "/images/captaincy-masterclass-new.png",
    "transfer-market": "/images/transfer-market-new.png",
    "consistency-check": "/images/consistency-check-new.png",
    "bench-management": "/images/bench-management-new.png",
    "chip-effectiveness": "/images/peak-performance-new.png",
    "season-recap": "/images/peak-performance-new.png",
    "you-vs-the-game": "/images/consistency-check-new.png",
    "mini-league-rivalry": "/images/transfer-market-new.png",
    "most-trusted-player": "/images/captaincy-masterclass-new.png",
  }

  return imageMap[insightId] || "/images/season-kickoff-new.png"
}

const getCardGradient = (insightId: string): string => {
  const gradientMap: { [key: string]: string } = {
    "season-kickoff": "from-green-600 via-green-500 to-emerald-600",
    "peak-performance": "from-yellow-600 via-orange-500 to-red-600",
    "captaincy-masterclass": "from-blue-600 via-cyan-500 to-blue-700",
    "transfer-market": "from-purple-600 via-pink-500 to-purple-700",
    "consistency-check": "from-teal-600 via-cyan-500 to-teal-700",
    "bench-management": "from-red-600 via-orange-500 to-red-700",
    "mini-league-rivalry": "from-indigo-600 via-purple-500 to-indigo-700",
    "most-trusted-player": "from-emerald-600 via-green-500 to-emerald-700",
    "chip-effectiveness": "from-cyan-600 via-blue-500 to-cyan-700",
    "you-vs-the-game": "from-pink-600 via-rose-500 to-pink-700",
    "season-recap": "from-amber-600 via-yellow-500 to-amber-700",
  }

  return gradientMap[insightId] || "from-gray-600 to-gray-700"
}

export default function RetroInsightCard({
  insight,
  data,
  onNext,
  onPrev,
  onHome,
  canGoNext,
  canGoPrev,
  isPaused,
}: RetroInsightCardProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const { playSound, playMusic } = useAudio()

  let insightData = insight.getData(data)

  if (insight.id === "you-vs-the-game") {
    insightData = {
      ...insightData,
      funFact: "Green arrows mean your rank improved, red arrows mean your rank dropped.",
    }
  }

  if (insight.id === "mini-league-rivalry") {
    insightData = {
      ...insightData,
      funFact:
        "Biggest Lead: The maximum points gap you had ahead of your closest rival in any mini-league during the season. This shows your dominance at your peak performance!",
    }
  }

  useEffect(() => {
    if (insight.id === "season-kickoff") {
      playMusic("background", true)
    }

    if (insight.id === "season-kickoff") {
      playSound("transition")
    } else if (insight.icon === "trophy") {
      const timer = setTimeout(() => playSound("goal"), 1000)
      return () => clearTimeout(timer)
    }
  }, [insight.id, insight.icon, playMusic, playSound])

  const handleNext = () => {
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

  const handleHome = () => {
    playSound("click")
    onHome()
  }

  const handleBadgeClick = (badge: string) => {
    setSelectedBadge(badge)
    playSound("coin")
  }

  const closeBadgeModal = () => {
    setSelectedBadge(null)
  }

  const isSeasonRecap = insight.id === "season-recap"
  const backgroundImage = getBackgroundImage(insight.id)
  const cardGradient = getCardGradient(insight.id)

  return (
    <div className="h-screen w-screen flex items-center justify-center p-responsive-sm relative overflow-hidden">
      {/* Enhanced Background with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isPaused ? "brightness(0.6) blur(1px)" : "brightness(0.9)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
      </div>

      {/* Floating Pixel Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
              y: (typeof window !== "undefined" ? window.innerHeight : 600) + 20,
              opacity: 0.3,
            }}
            animate={{
              y: -20,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 8,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

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
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              className="pixel-card p-responsive-lg container-responsive-sm bg-white relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-body text-gray-900">{selectedBadge}</h3>
                <Button
                  onClick={closeBadgeModal}
                  className="pixel-button p-1"
                  style={{ width: "clamp(24px, 6vw, 32px)", height: "clamp(24px, 6vw, 32px)" }}
                >
                  <X className="icon-responsive-sm" />
                </Button>
              </div>
              <p className="font-body text-small text-gray-700 leading-relaxed">
                {badgeExplanations[selectedBadge] || "Achievement unlocked!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Responsive Design */}
      <div className="w-full container-responsive-md h-full flex flex-col relative z-10 py-4">
        {/* Floating Title with Glow Effect */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex-none m-responsive-sm relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 0 20px rgba(255,255,255,0.3)",
                "0 0 30px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="pixel-card p-responsive-sm text-center bg-white bg-opacity-95 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
            <h1 className="font-display text-small text-gray-900">{insight.title}</h1>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          </motion.div>
        </motion.div>

        {/* Main Content Card - Responsive Layout */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
          className={`flex-1 pixel-card p-responsive-lg flex flex-col bg-gradient-to-br ${cardGradient} text-white relative overflow-hidden`}
          style={{
            boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-white/30"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-white/30"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-white/30"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-white/30"></div>

          {/* Icon Section - Centered and Prominent */}
          <div className="flex items-center justify-center m-responsive-md relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="flex-shrink-0"
            >
              <RetroIcon type={insight.icon} size="xl" animated={!isPaused} />
            </motion.div>
          </div>

          {/* Main Stats - Responsive Design */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center m-responsive-md relative"
          >
            <div className="pixel-card p-responsive-lg bg-white/95 backdrop-blur-sm border-2 border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent"></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
                className="relative z-10"
              >
                <div className="font-display text-title text-gray-900 font-bold mb-2 drop-shadow-sm">
                  {insightData.mainStat}
                </div>
                <div className="font-body text-small text-gray-700 font-semibold">{insightData.mainLabel}</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Secondary Stats or Badges - Enhanced Grid */}
          {isSeasonRecap ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="m-responsive-md"
            >
              <div className="text-center m-responsive-sm">
                <div className="font-display text-body text-gray-900 font-bold bg-white/90 p-responsive-sm rounded pixel-card">
                  BADGES EARNED
                </div>
              </div>
              <div
                className="grid grid-cols-2 space-responsive-sm overflow-y-auto"
                style={{ maxHeight: "clamp(120px, 30vw, 180px)" }}
              >
                {data.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 1.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="pixel-card p-responsive-sm text-center bg-white/90 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                    <div className="font-body text-nano text-gray-900 truncate px-1 font-semibold text-ellipsis">
                      {badge}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            insightData.secondaryStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-2 space-responsive-sm m-responsive-md"
              >
                {insightData.secondaryStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotateY: -90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                    className="pixel-card p-responsive-sm text-center bg-white/90 backdrop-blur-sm relative overflow-hidden hover:scale-105 transition-transform"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                    <div className="font-display text-micro text-gray-900 truncate px-1 font-bold text-ellipsis">
                      {stat.value}
                    </div>
                    <div className="font-body text-nano text-gray-700 truncate font-semibold text-ellipsis">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}

          {/* Content Text - Enhanced Typography with More Space */}
          <div className="flex-1 flex flex-col justify-center text-center relative">
            <div className="pixel-card p-responsive-md bg-white/90 backdrop-blur-sm border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white/50"></div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="font-body text-content-subtitle text-gray-800 leading-relaxed m-responsive-sm px-2 font-semibold relative z-10"
              >
                {insightData.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="pixel-card p-responsive-sm bg-yellow-50 border border-yellow-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                <p className="font-body text-content-funfact text-gray-800 leading-relaxed px-2 font-semibold">
                  💡 {insightData.funFact}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Navigation - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="flex-none flex justify-between items-center m-responsive-sm space-responsive-sm"
          style={{ pointerEvents: isPaused ? "none" : "auto" }}
        >
          <Button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="cta-button-secondary disabled:opacity-50 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 border-2 border-black font-bold shadow-lg flex-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            <ChevronLeft className="icon-responsive-sm mr-1 relative z-10" />
            <span className="text-button font-bold relative z-10">BACK</span>
          </Button>

          <Button
            onClick={handleHome}
            className="cta-button-secondary bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 border-2 border-black font-bold shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            <Home className="icon-responsive-sm relative z-10" />
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext && !canGoPrev}
            className="cta-button-secondary disabled:opacity-50 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 border-2 border-black font-bold shadow-lg flex-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            <span className="text-button font-bold relative z-10">{canGoNext ? "NEXT" : "END"}</span>
            <ChevronRight className="icon-responsive-sm ml-1 relative z-10" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
