"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import type { Insight } from "@/lib/insights"

interface ModernInsightCardProps {
  insight: Insight
  data: FPLData
  onNext: () => void
  onPrev: () => void
  currentIndex: number
  totalSections: number
}

const getBackgroundImage = (sceneTitle: string) => {
  const imageMap: Record<string, string> = {
    "SEASON SUMMARY": "/images/season-kickoff-new.png",
    "CAPTAIN'S ARMBAND": "/images/captain-new.png",
    "TRANSFER MARKET": "/images/transfers-new.png",
    "BENCH MANAGEMENT": "/images/bench-new.png",
    "BIGGEST GAMEWEEK": "/images/best-gameweek-new.png",
    "MVP (MOST TRUSTED)": "/images/consistency-check-new.png",
    "FORM PLAYER": "/images/consistency-check-new.png",
    "THE ONE THAT GOT AWAY": "/images/transfers-new.png",
    "YOU VS THE GAME": "/images/you-vs-game-new.png",
    "FINAL SCORECARD": "/images/season-recap-new.png",
    "CHIP STRATEGY": "/images/chip-usage-new.png",
    RIVALRY: "/images/rivalry-new.png",
  }
  return imageMap[sceneTitle] || "/images/season-kickoff-new.png"
}

export function ModernInsightCard({
  insight,
  data,
  onNext,
  onPrev,
  currentIndex,
  totalSections,
}: ModernInsightCardProps) {
  const insightData = insight.getData(data)
  const backgroundImage = getBackgroundImage(insight.sceneTitle)

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-black/80" />

      {/* Progress indicator */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/80">
            {currentIndex} of {totalSections - 2}
          </div>
          <div className="text-sm text-white/80 uppercase tracking-wider font-semibold">{insight.sceneTitle}</div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (totalSections - 2)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Main insight card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden mb-8"
          >
            {/* Header */}
            <div className="relative p-8 pb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {insightData.title}
                </h2>
                <p className="text-gray-300 text-lg">{insight.sceneTitle}</p>
              </div>
            </div>

            {/* Main content */}
            <div className="px-8 pb-8">
              {/* Primary stat */}
              {insightData.primaryValue && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <div className="inline-flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                    >
                      {insightData.primaryValue}
                    </motion.div>
                  </div>
                  <p className="text-xl text-gray-200 mt-4 font-medium">{insightData.primaryLabel}</p>
                </motion.div>
              )}

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10"
              >
                <p className="text-gray-200 leading-relaxed text-center text-lg">{insightData.description}</p>
                {insightData.funFact && (
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                    className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
                  >
                    <p className="text-blue-200 text-sm text-center flex items-center justify-center gap-2">
                      <span className="text-lg">💡</span>
                      {insightData.funFact}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Secondary stats */}
              {insightData.secondaryStats && insightData.secondaryStats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {insightData.secondaryStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                      className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                        {stat.value}
                        {stat.trend === "up" && <ArrowUp className="w-4 h-4 text-green-400" />}
                        {stat.trend === "down" && <ArrowDown className="w-4 h-4 text-red-400" />}
                      </div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <Button
              onClick={onPrev}
              disabled={currentIndex <= 1}
              className="h-12 px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-xl disabled:opacity-50 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-white/60 text-sm">Use arrow keys or space to navigate</p>
            </div>

            <Button
              onClick={onNext}
              disabled={currentIndex >= totalSections - 1}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ModernInsightCard
