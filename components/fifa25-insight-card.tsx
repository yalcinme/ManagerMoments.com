"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Info, Zap } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import type { Insight } from "@/lib/insights"

interface FIFA25InsightCardProps {
  insight: Insight
  data: FPLData
  onNext: () => void
  onPrev: () => void
  currentIndex: number
  totalSections: number
  isTransitioning?: boolean
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
  }
  return imageMap[sceneTitle] || "/images/season-kickoff-new.png"
}

const getIconForInsight = (iconType: string) => {
  const icons = {
    ball: "⚽",
    goal: "🥅",
    trophy: "🏆",
    card: "🔄",
    target: "🎯",
    bench: "🪑",
    chip: "🎲",
  }
  return icons[iconType as keyof typeof icons] || "⚽"
}

const getExplanationForInsight = (insightId: string) => {
  const explanations: Record<string, string> = {
    "season-summary":
      "Your overall season performance compared to 11+ million FPL managers worldwide. Points per gameweek shows consistency.",
    "captain-performance":
      "Captain choices are crucial - they double your player's points. A good captain averages 8+ points, elite managers achieve 10+.",
    "transfer-activity":
      "Smart transfers can gain 50+ points per season. Too many hits (-4 points each) can hurt your rank significantly.",
    "bench-analysis":
      "Your bench players' points when they didn't play. Good bench management means having playing substitutes who can cover.",
    "biggest-gameweek":
      "Your highest single gameweek score. Elite scores are 80+ points, with perfect weeks reaching 100+ points.",
    "mvp-analysis":
      "Your most reliable player who appeared most often. Consistency beats explosive players who get rotated.",
    "form-player":
      "Recent form matters for transfers. This player performed best in their last 6 gameweeks under your management.",
    "one-got-away":
      "The player who scored big but you never owned them. Shows market awareness and timing opportunities missed.",
    "you-vs-game": "How your decisions compare to other managers. Shows your strengths and areas for improvement.",
    "final-scorecard": "Your complete season summary with achievements unlocked and final standing among all managers.",
  }
  return explanations[insightId] || "Performance insight from your FPL season."
}

export function FIFA25InsightCard({
  insight,
  data,
  onNext,
  onPrev,
  currentIndex,
  totalSections,
  isTransitioning = false,
}: FIFA25InsightCardProps) {
  const insightData = insight.getData(data)
  const backgroundImage = getBackgroundImage(insight.sceneTitle)
  const explanation = getExplanationForInsight(insight.id)
  const icon = getIconForInsight(insight.iconType || "ball")

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* FIFA 25 Style Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-900/40 to-purple-900/60" />

      {/* FIFA 25 Style Corner Decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-yellow-400/20 to-transparent" />
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-bl from-blue-400/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-green-400/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-tl from-purple-400/20 to-transparent" />

      {/* Scrollable Content Container */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        {/* Progress Bar - FIFA 25 Style */}
        <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl lg:text-3xl">{icon}</div>
              <div>
                <div className="text-xs sm:text-sm text-yellow-300 font-bold uppercase tracking-wider">
                  {currentIndex} of {totalSections - 2}
                </div>
                <div className="text-sm sm:text-lg lg:text-xl text-white font-bold uppercase tracking-wider">
                  {insight.sceneTitle}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-black/40 rounded-full h-1.5 sm:h-2 border border-yellow-400/30">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 h-1.5 sm:h-2 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${(currentIndex / (totalSections - 2)) * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
          <div className="max-w-4xl mx-auto">
            {/* Main FIFA 25 Style Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* FIFA 25 Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20 rounded-2xl sm:rounded-3xl blur-xl" />

              <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border-2 border-yellow-400/30 shadow-2xl overflow-hidden">
                {/* FIFA 25 Header with Holographic Effect */}
                <div className="relative p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6 bg-gradient-to-r from-yellow-400/10 via-blue-400/10 to-purple-400/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

                  <div className="relative flex items-center gap-3 sm:gap-4 mb-4">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="text-2xl sm:text-3xl lg:text-4xl"
                    >
                      {icon}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-white to-blue-300 bg-clip-text mb-1 sm:mb-2 break-words text-center">
                        {insightData.title}
                      </h2>
                      <p className="text-yellow-300/80 text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-wider text-center">
                        {insight.sceneTitle}
                      </p>
                    </div>
                  </div>

                  {/* Explanation Box */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-blue-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-400/20"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-100 text-xs sm:text-sm leading-relaxed text-center">{explanation}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                  {/* Primary Stat - FIFA 25 Style */}
                  {insightData.primaryValue && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                      className="text-center mb-6 sm:mb-8"
                    >
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-2xl sm:rounded-3xl blur-lg" />
                        <div className="relative bg-gradient-to-br from-yellow-400/10 to-green-400/10 rounded-2xl sm:rounded-3xl border-2 border-yellow-400/40 p-4 sm:p-6 lg:p-8">
                          <motion.div
                            animate={{
                              textShadow: [
                                "0 0 20px rgba(255,255,0,0.5)",
                                "0 0 40px rgba(255,255,0,0.8)",
                                "0 0 20px rgba(255,255,0,0.5)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text mb-2 sm:mb-4 break-words"
                          >
                            {insightData.primaryValue}
                          </motion.div>
                          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-yellow-200 font-bold uppercase tracking-wider break-words">
                            {insightData.primaryLabel}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-purple-400/20"
                  >
                    <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed text-center font-medium">
                      {insightData.description}
                    </p>

                    {insightData.funFact && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg sm:rounded-xl border border-green-400/20"
                      >
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                          <p className="text-green-200 text-xs sm:text-sm font-medium text-center">
                            {insightData.funFact}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Secondary Stats - FIFA 25 Grid */}
                  {insightData.secondaryStats && insightData.secondaryStats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                    >
                      {insightData.secondaryStats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.0 + index * 0.1, duration: 0.5, type: "spring" }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="relative group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl blur group-hover:blur-md transition-all duration-300" />
                          <div className="relative bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 flex items-center justify-center gap-2 break-words">
                              {stat.value}
                            </div>
                            <p className="text-xs text-blue-200 uppercase tracking-wider font-medium break-words">
                              {stat.label}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fixed Navigation at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex justify-between items-center max-w-4xl mx-auto"
          >
            <Button
              onClick={onPrev}
              disabled={currentIndex <= 1 || isTransitioning}
              className="h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-500/80 hover:to-red-600/80 text-white border-2 border-red-400/30 rounded-xl sm:rounded-2xl backdrop-blur-xl disabled:opacity-30 transition-all duration-300 font-bold uppercase tracking-wider text-xs sm:text-sm lg:text-base"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Previous
            </Button>

            <Button
              onClick={onNext}
              disabled={currentIndex >= totalSections - 1 || isTransitioning}
              className="h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600/80 to-blue-600/80 hover:from-green-500/80 hover:to-blue-500/80 text-white border-2 border-green-400/30 rounded-xl sm:rounded-2xl backdrop-blur-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs sm:text-sm lg:text-base"
            >
              Next
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FIFA25InsightCard
