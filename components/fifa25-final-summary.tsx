"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Share2, RotateCcw, Star, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"

interface FIFA25FinalSummaryProps {
  data: FPLData
  onRestart: () => void
  onHome?: () => void
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
        <div className="absolute top-6 right-6 z-30">
          <Button
            onClick={onHome}
            className="h-12 w-12 p-0 bg-black/80 hover:bg-black/90 text-white border-2 border-white/30 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <Home className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Scrollable container */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="flex items-start justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="w-full max-w-5xl mx-auto">
            {/* Main Scorecard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-black/90 backdrop-blur-2xl rounded-3xl border-2 border-white/30 overflow-hidden shadow-2xl w-full my-8"
            >
              {/* Header */}
              <div className="relative p-8 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-green-600/20 to-blue-600/20" />
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8 text-center"
                  >
                    <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-2xl" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-5xl md:text-6xl font-black text-center mb-6 drop-shadow-2xl"
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
                    className="text-2xl md:text-3xl text-white font-bold text-center mb-4 drop-shadow-lg"
                  >
                    {data.managerName}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-xl md:text-2xl text-yellow-400 font-black text-center drop-shadow-lg"
                  >
                    {getManagerTitle()}
                  </motion.p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="bg-gradient-to-br from-green-600/40 to-blue-600/40 backdrop-blur-xl rounded-2xl p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                      {data.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm md:text-base text-white/90 font-semibold">Total Points</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-xl rounded-2xl p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                      {data.overallRank?.toLocaleString()}
                    </div>
                    <div className="text-sm md:text-base text-white/90 font-semibold">Final Rank</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="bg-gradient-to-br from-yellow-600/40 to-orange-600/40 backdrop-blur-xl rounded-2xl p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                      {data.overallRank ? Math.round((1 - data.overallRank / 11000000) * 100) : 0}%
                    </div>
                    <div className="text-sm md:text-base text-white/90 font-semibold">Top Percentile</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className="bg-gradient-to-br from-blue-600/40 to-cyan-600/40 backdrop-blur-xl rounded-2xl p-6 text-center border-2 border-white/20 shadow-2xl"
                  >
                    <div className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                      {data.badges?.length || 0}
                    </div>
                    <div className="text-sm md:text-base text-white/90 font-semibold">Badges Earned</div>
                  </motion.div>
                </div>

                {/* Badges */}
                {data.badges && data.badges.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.0 }}
                    className="mb-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">
                        🏆 Your Achievements
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {data.badges.map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                          className="bg-gradient-to-br from-yellow-600/40 to-orange-600/40 backdrop-blur-xl rounded-2xl p-4 text-center border-2 border-yellow-400/50 cursor-pointer hover:scale-105 transition-transform shadow-2xl"
                          onClick={() => setSelectedBadge(badge)}
                        >
                          <div className="text-3xl mb-2">🏅</div>
                          <div className="text-xs md:text-sm font-black text-yellow-300 drop-shadow-lg">{badge}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Season Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.4 }}
                  className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 mb-8 text-center border-2 border-white/20 shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Star className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                    <span className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">Season Highlights</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm md:text-base">
                    <div className="text-center">
                      <div className="text-white font-black mb-2 text-lg drop-shadow-lg">Best Gameweek</div>
                      <div className="text-white/90 font-semibold">
                        {data.bestGw?.points} pts (GW{data.bestGw?.gameweek})
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black mb-2 text-lg drop-shadow-lg">Captain Success</div>
                      <div className="text-white/90 font-semibold">
                        {100 - (data.captainPerformance?.failRate || 0)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black mb-2 text-lg drop-shadow-lg">Green Arrows</div>
                      <div className="text-white/90 font-semibold">{data.greenArrows}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black mb-2 text-lg drop-shadow-lg">Average Points</div>
                      <div className="text-white/90 font-semibold">{Math.round(data.totalPoints / 38)}/GW</div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Button
                      onClick={handleShare}
                      className="h-16 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-2xl font-black text-lg shadow-2xl border-2 border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                    >
                      <Share2 className="w-6 h-6 mr-3" />
                      Share Your Season
                    </Button>

                    <Button
                      onClick={onRestart}
                      className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-black text-lg shadow-2xl border-2 border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                    >
                      <RotateCcw className="w-6 h-6 mr-3" />
                      Try Another Manager
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FIFA25FinalSummary
