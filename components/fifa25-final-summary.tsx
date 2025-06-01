"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Share2, RotateCcw, Download, X, Award, Star, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BadgeDisplay } from "@/components/badge-display"
import type { FPLData } from "@/types/fpl"
import html2canvas from "html2canvas"

interface FIFA25FinalSummaryProps {
  data: FPLData
  onRestart: () => void
}

const BADGE_DETAILS: Record<
  string,
  {
    description: string
    significance: string
    rarity: string
    icon: string
    color: string
  }
> = {
  "POINTS MACHINE": {
    description: "You scored an incredible 2,500+ points this season!",
    significance:
      "Only the top 0.1% of managers achieve this elite milestone. You demonstrated exceptional consistency and strategic thinking throughout the entire season.",
    rarity: "Legendary",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
  },
  "CENTURY CLUB": {
    description: "You scored an excellent 2,200+ points this season!",
    significance:
      "This puts you in the top 1% of all FPL managers. Your strategic decisions and player selections were consistently above average.",
    rarity: "Epic",
    icon: "💯",
    color: "from-purple-500 to-purple-700",
  },
  "TOP 100K": {
    description: "You finished in the top 100,000 managers worldwide!",
    significance:
      "Out of over 11 million players, you're in the top 1%. This demonstrates exceptional FPL knowledge and decision-making skills.",
    rarity: "Epic",
    icon: "⭐",
    color: "from-indigo-500 to-indigo-700",
  },
  "GREEN MACHINE": {
    description: "You achieved 20+ green arrows this season!",
    significance:
      "Consistent rank improvements show your ability to adapt and make smart decisions week after week. True mark of a skilled manager.",
    rarity: "Epic",
    icon: "🟢",
    color: "from-green-500 to-green-700",
  },
  "CAPTAIN MARVEL": {
    description: "You achieved 75%+ captain success rate!",
    significance:
      "Your captaincy choices were exceptional. Picking the right captain is one of the hardest skills in FPL, and you mastered it.",
    rarity: "Rare",
    icon: "👑",
    color: "from-yellow-500 to-yellow-700",
  },
  "TRIPLE DIGITS": {
    description: "You scored 100+ points in a single gameweek!",
    significance:
      "A rare achievement requiring perfect team selection, captaincy choice, and a bit of luck. Shows your ability to maximize big gameweeks.",
    rarity: "Rare",
    icon: "🔥",
    color: "from-orange-500 to-red-600",
  },
  "CHIP MASTER": {
    description: "You used all 4 chips effectively this season!",
    significance:
      "Strategic chip usage is crucial for success. You timed your chips perfectly to maximize their impact on your overall rank.",
    rarity: "Rare",
    icon: "🎯",
    color: "from-pink-500 to-pink-700",
  },
  "ABOVE AVERAGE": {
    description: "You averaged 55+ points per gameweek!",
    significance:
      "Consistency is key in FPL. Maintaining above-average scores week after week shows solid fundamental understanding of the game.",
    rarity: "Common",
    icon: "📈",
    color: "from-teal-500 to-teal-700",
  },
}

export function FIFA25FinalSummary({ data, onRestart }: FIFA25FinalSummaryProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const getManagerTitle = () => {
    if (data.overallRank && data.overallRank <= 1000) return "FPL Legend"
    if (data.overallRank && data.overallRank <= 10000) return "Elite Manager"
    if (data.overallRank && data.overallRank <= 100000) return "Expert Manager"
    if (data.overallRank && data.overallRank <= 1000000) return "Skilled Manager"
    return "FPL Manager"
  }

  const handleShare = async () => {
    const shareText = `🏆 My FPL 2024/25 Season Wrapped!\n\n📊 ${data.totalPoints.toLocaleString()} total points\n🎯 Rank: ${data.overallRank?.toLocaleString()}\n🏅 ${data.badges.length} badges earned\n\nCheck out your season at Manager Moments!`

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

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const element = document.getElementById("final-scorecard")
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: "#000000",
          scale: 2,
          useCORS: true,
        })

        const link = document.createElement("a")
        link.download = `fpl-season-${data.managerName}-2024-25.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    } catch (error) {
      console.error("Error downloading image:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/season-recap.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-slate-900/85 to-black/90" />

      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
          <div className="w-full max-w-5xl mx-auto">
            {/* Main Scorecard */}
            <motion.div
              id="final-scorecard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-black/80 backdrop-blur-xl rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl"
            >
              {/* Header - Reduced Size */}
              <div className="relative p-4 sm:p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-green-600/20 to-blue-600/20" />
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-3 text-center"
                  >
                    <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-400 mx-auto" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-2"
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
                    className="text-base sm:text-lg text-gray-300 text-center mb-1"
                  >
                    {data.managerName}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-sm sm:text-base text-yellow-400 font-bold text-center"
                  >
                    {getManagerTitle()}
                  </motion.p>
                </div>
              </div>

              {/* Stats Grid - Better Spacing */}
              <div className="px-4 sm:px-6 pb-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-xl p-3 sm:p-4 text-center"
                  >
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                      {data.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">Total Points</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-3 sm:p-4 text-center"
                  >
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                      {data.overallRank?.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">Final Rank</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-3 sm:p-4 text-center"
                  >
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                      {Math.round((1 - data.overallRank! / 11000000) * 100)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">Top Percentile</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-3 sm:p-4 text-center"
                  >
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                      {data.badges.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300">Badges Earned</div>
                  </motion.div>
                </div>

                {/* Achievements Section - Better Spacing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="mb-6"
                >
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">🏆 Your Achievements</h2>
                    <p className="text-gray-300 text-sm">Click any badge to learn about your accomplishment</p>
                  </div>

                  <BadgeDisplay badges={data.badges} showExplanations={false} onBadgeClick={setSelectedBadge} />
                </motion.div>

                {/* Season Highlights - Better Spacing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.0 }}
                  className="bg-gray-800/50 rounded-xl p-4 sm:p-5 mb-6 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold text-white">Season Highlights</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="text-center">
                      <div className="text-white font-bold">Best Gameweek</div>
                      <div className="text-gray-300">
                        {data.bestGw?.points} pts (GW{data.bestGw?.gameweek})
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">Captain Success</div>
                      <div className="text-gray-300">{data.captainAccuracy}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">Green Arrows</div>
                      <div className="text-gray-300">{data.greenArrows}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">Average Points</div>
                      <div className="text-gray-300">{Math.round(data.totalPoints / 38)}/GW</div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons - Better Spacing */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={handleShare}
                      className="h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-bold text-sm sm:text-base"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Your Season
                    </Button>

                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-sm sm:text-base"
                    >
                      {isDownloading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <Download className="w-4 h-4" />
                          </motion.div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Card
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={onRestart}
                    variant="outline"
                    className="w-full h-12 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl font-bold text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Another Manager
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Badge Explanation Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/90 backdrop-blur-xl rounded-2xl border-2 border-white/20 max-w-md w-full overflow-hidden"
            >
              {selectedBadge && BADGE_DETAILS[selectedBadge] && (
                <>
                  {/* Header */}
                  <div className={`relative p-6 bg-gradient-to-r ${BADGE_DETAILS[selectedBadge].color} bg-opacity-20`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{BADGE_DETAILS[selectedBadge].icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white text-center">{selectedBadge}</h3>
                          <span
                            className={`text-sm uppercase px-2 py-1 rounded-full bg-gradient-to-r ${BADGE_DETAILS[selectedBadge].color} text-white font-medium`}
                          >
                            {BADGE_DETAILS[selectedBadge].rarity}
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
                  <div className="p-6 space-y-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Achievement</h4>
                      </div>
                      <p className="text-white leading-relaxed text-center">
                        {BADGE_DETAILS[selectedBadge].description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-purple-400" />
                        <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Significance</h4>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed text-center">
                        {BADGE_DETAILS[selectedBadge].significance}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                    <Button
                      onClick={() => setSelectedBadge(null)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                    >
                      Awesome!
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
