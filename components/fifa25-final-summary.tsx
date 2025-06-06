"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Share2, RotateCcw, Star, Home, X, Award, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"

interface FIFA25FinalSummaryProps {
  data: FPLData
  onRestart: () => void
  onHome?: () => void
}

// Badge information with descriptions
const BADGE_INFO: Record<
  string,
  { icon: string; description: string; howToEarn: string; rarity: string; color: string }
> = {
  "POINTS MACHINE": {
    icon: "⚡",
    description: "You scored an incredible 2,500+ points this season!",
    howToEarn: "Score 2,500 or more total points in a single season. Only the most elite managers achieve this.",
    rarity: "Legendary",
    color: "from-yellow-400 to-orange-500",
  },
  "CENTURY CLUB": {
    icon: "💯",
    description: "You scored an excellent 2,200+ points this season!",
    howToEarn: "Score 2,200 or more total points in a single season. Shows consistent high performance.",
    rarity: "Epic",
    color: "from-purple-500 to-purple-700",
  },
  "TOP 100K": {
    icon: "⭐",
    description: "You finished in the top 100,000 managers worldwide!",
    howToEarn: "Finish the season ranked in the top 100,000 out of 11+ million players.",
    rarity: "Epic",
    color: "from-indigo-500 to-indigo-700",
  },
  "TRIPLE DIGITS": {
    icon: "🔥",
    description: "You scored 100+ points in a single gameweek!",
    howToEarn: "Score 100 or more points in any single gameweek. Requires perfect team selection and luck.",
    rarity: "Rare",
    color: "from-orange-500 to-red-600",
  },
  "GREEN MACHINE": {
    icon: "🟢",
    description: "You had 20+ green arrows this season!",
    howToEarn: "Achieve 20 or more green arrows (rank improvements) throughout the season.",
    rarity: "Epic",
    color: "from-green-500 to-green-700",
  },
  "CAPTAIN MARVEL": {
    icon: "👑",
    description: "You had a 75%+ captain success rate!",
    howToEarn: "Have your captain score 8+ points in 75% or more of your gameweeks.",
    rarity: "Rare",
    color: "from-yellow-500 to-yellow-700",
  },
  "ABOVE AVERAGE": {
    icon: "📈",
    description: "You averaged 55+ points per gameweek!",
    howToEarn: "Maintain an average of 55 or more points per gameweek throughout the season.",
    rarity: "Common",
    color: "from-teal-500 to-teal-700",
  },
  "CHIP MASTER": {
    icon: "🎯",
    description: "You used all 4 chips effectively!",
    howToEarn: "Use all four chips (Wildcard, Bench Boost, Free Hit, Triple Captain) during the season.",
    rarity: "Rare",
    color: "from-pink-500 to-pink-700",
  },
}

export function FIFA25FinalSummary({ data, onRestart, onHome }: FIFA25FinalSummaryProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)

  const getManagerTitle = () => {
    if (data.overallRank && data.overallRank <= 1000) return "FPL Legend"
    if (data.overallRank && data.overallRank <= 10000) return "Elite Manager"
    if (data.overallRank && data.overallRank <= 100000) return "Expert Manager"
    if (data.overallRank && data.overallRank <= 1000000) return "Skilled Manager"
    return "FPL Manager"
  }

  const handleShare = async () => {
    const shareText = `🏆 My FPL 2024/25 Season Wrapped!

📊 ${data.totalPoints.toLocaleString()} total points
🎯 Rank: ${data.overallRank?.toLocaleString()}
🏅 ${data.badges?.length || 0} badges earned

Check out your season at Manager Moments!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FPL Season Wrapped",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(shareText)
    }
  }

  // Get badge info with fallback
  const getBadgeInfo = (badge: string) => {
    return (
      BADGE_INFO[badge] || {
        icon: "🏅",
        description: "Special achievement unlocked",
        howToEarn: "Keep playing to unlock more achievements!",
        rarity: "Common",
        color: "from-gray-500 to-gray-700",
      }
    )
  }

  // Get color based on badge rarity
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "from-yellow-400 to-orange-500"
      case "Epic":
        return "from-purple-400 to-blue-500"
      case "Rare":
        return "from-blue-400 to-cyan-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/fifa-final-screen.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90" />

      {/* Home button */}
      {onHome && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30">
          <Button
            onClick={onHome}
            className="h-10 w-10 sm:h-12 sm:w-12 p-0 bg-black/80 hover:bg-black/90 text-white border-2 border-white/30 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>
      )}

      {/* Scrollable container */}
      <div className="relative z-10 min-h-screen overflow-y-auto pb-8">
        <div className="flex flex-col items-center justify-start p-4 sm:p-6 min-h-screen">
          <div className="w-full max-w-5xl mx-auto">
            {/* Main Scorecard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-black/90 backdrop-blur-2xl rounded-3xl border-2 border-white/30 overflow-hidden shadow-2xl w-full my-4 sm:my-8"
            >
              {/* Header */}
              <div className="relative p-6 sm:p-8 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-green-600/20 to-blue-600/20" />
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-6 sm:mb-8 text-center"
                  >
                    <Trophy className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-400 mx-auto drop-shadow-2xl" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-4 sm:mb-6 drop-shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24 0%, #ffffff 50%, #60a5fa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    SEASON COMPLETE!
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-xl sm:text-2xl md:text-3xl text-white font-bold text-center mb-3 sm:mb-4 drop-shadow-lg"
                  >
                    {data.managerName}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-lg sm:text-xl md:text-2xl text-yellow-400 font-black text-center drop-shadow-lg"
                  >
                    {getManagerTitle()}
                  </motion.p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="bg-gradient-to-br from-green-600/40 to-blue-600/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
                      {data.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-white/90 font-semibold">Total Points</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
                      {data.overallRank?.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-white/90 font-semibold">Final Rank</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="bg-gradient-to-br from-yellow-600/40 to-orange-600/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
                      {data.overallRank ? Math.round((1 - data.overallRank / 11000000) * 100) : 0}%
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-white/90 font-semibold">Top Percentile</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className="bg-gradient-to-br from-blue-600/40 to-cyan-600/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
                      {data.badges?.length || 0}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-white/90 font-semibold">Badges Earned</div>
                  </motion.div>
                </div>

                {/* Badges */}
                {data.badges && data.badges.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.0 }}
                    className="mb-6 sm:mb-8"
                  >
                    <div className="text-center mb-4 sm:mb-6">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
                        🏆 Your Achievements
                      </h2>
                      <p className="text-sm text-white/70">Tap on a badge to learn more</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {data.badges.map((badge, index) => {
                        const badgeInfo = getBadgeInfo(badge)
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                            className="bg-gradient-to-br from-yellow-600/40 to-orange-600/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border-2 border-yellow-400/50 cursor-pointer hover:scale-105 transition-transform shadow-2xl relative"
                            onClick={() => setSelectedBadge(badge)}
                          >
                            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{badgeInfo.icon}</div>
                            <div className="text-xs sm:text-sm font-black text-yellow-300 drop-shadow-lg">{badge}</div>
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                              <Info className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Season Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.4 }}
                  className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-center border-2 border-white/20 shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 drop-shadow-lg" />
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                      Season Highlights
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm md:text-base">
                    <div className="text-center">
                      <div className="text-white font-black mb-1 sm:mb-2 text-base sm:text-lg drop-shadow-lg">
                        Best Gameweek
                      </div>
                      <div className="text-white/90 font-semibold">
                        {data.bestGw?.points} pts (GW{data.bestGw?.gameweek})
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black mb-1 sm:mb-2 text-base sm:text-lg drop-shadow-lg">
                        Captain Success
                      </div>
                      <div className="text-white/90 font-semibold">
                        {100 - (data.captainPerformance?.failRate || 0)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black mb-1 sm:mb-2 text-base sm:text-lg drop-shadow-lg">
                        Green Arrows
                      </div>
                      <div className="text-white/90 font-semibold">{data.greenArrows}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black mb-1 sm:mb-2 text-base sm:text-lg drop-shadow-lg">
                        Average Points
                      </div>
                      <div className="text-white/90 font-semibold">{Math.round(data.totalPoints / 38)}/GW</div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <Button
                      onClick={handleShare}
                      className="h-12 sm:h-16 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-2xl border-2 border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                    >
                      <Share2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Share Your Season
                    </Button>

                    <Button
                      onClick={onRestart}
                      className="h-12 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-2xl border-2 border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                    >
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Try Another Manager
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Badge Explanation Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(
                    getBadgeInfo(selectedBadge).rarity,
                  )} rounded-2xl blur-xl opacity-60`}
                />

                {/* Modal Content */}
                <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl border-2 border-white/20 overflow-hidden">
                  {/* Header */}
                  <div
                    className={`relative p-5 sm:p-6 bg-gradient-to-r ${getRarityColor(
                      getBadgeInfo(selectedBadge).rarity,
                    )} bg-opacity-20`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl sm:text-3xl">{getBadgeInfo(selectedBadge).icon}</div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white">{selectedBadge}</h3>
                          <span
                            className={`text-xs sm:text-sm uppercase px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(
                              getBadgeInfo(selectedBadge).rarity,
                            )} text-white font-medium`}
                          >
                            {getBadgeInfo(selectedBadge).rarity}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedBadge(null)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <h4 className="text-xs sm:text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                          Achievement
                        </h4>
                      </div>
                      <p className="text-white leading-relaxed text-sm sm:text-base">
                        {getBadgeInfo(selectedBadge).description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400">🎯</span>
                        <h4 className="text-xs sm:text-sm font-semibold text-blue-400 uppercase tracking-wider">
                          How to Earn
                        </h4>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {getBadgeInfo(selectedBadge).howToEarn}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-white/5 border-t border-white/10">
                    <Button
                      onClick={() => setSelectedBadge(null)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                    >
                      Got it!
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FIFA25FinalSummary
