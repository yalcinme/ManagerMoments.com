"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Home, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"

interface Insight {
  id: string
  title: string
  subtitle: string
  iconType: string
  getData: (data: FPLData) => any
}

interface FIFA25InsightCardProps {
  insight: Insight
  data: FPLData
  onNext: () => void
  onPrev: () => void
  onHome: () => void
  currentIndex: number
  totalSections: number
}

// Background image mapping for each insight
const getBackgroundImage = (insightId: string): string => {
  const backgroundMap: Record<string, string> = {
    "season-summary": "/images/fifa-season-kickoff.png",
    "captain-performance": "/images/fifa-captain.png",
    "transfer-activity": "/images/fifa-transfers.png",
    "bench-analysis": "/images/fifa-bench.png",
    "biggest-gameweek": "/images/fifa-best-gameweek.png",
    "one-got-away": "/images/fifa-consistency-check.png",
    "you-vs-game": "/images/fifa-you-vs-game.png",
  }
  return backgroundMap[insightId] || "/images/fifa-season-kickoff.png"
}

export function FIFA25InsightCard({
  insight,
  data,
  onNext,
  onPrev,
  onHome,
  currentIndex,
  totalSections,
}: FIFA25InsightCardProps) {
  const [mounted, setMounted] = useState(false)
  const [insightData, setInsightData] = useState<any>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    setMounted(true)
    try {
      const data_result = insight.getData(data)
      setInsightData(data_result)
    } catch (error) {
      console.error("Error getting insight data:", error)
      setInsightData(null)
    }
  }, [insight, data])

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < totalSections - 1) {
      onNext()
    } else if (isRightSwipe && currentIndex > 1) {
      onPrev()
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const backgroundImage = getBackgroundImage(insight.id)

  const renderInsightContent = () => {
    switch (insight.id) {
      case "season-summary":
        return (
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">SEASON KICKOFF</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">Your 2024/25 FPL Journey</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                <div className="text-4xl md:text-5xl font-black text-yellow-400 mb-2 drop-shadow-lg">
                  {data.totalPoints.toLocaleString()}
                </div>
                <div className="text-white/90 font-semibold text-lg">Total Points</div>
              </div>
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                <div className="text-4xl md:text-5xl font-black text-green-400 mb-2 drop-shadow-lg">
                  #{data.overallRank?.toLocaleString()}
                </div>
                <div className="text-white/90 font-semibold text-lg">Final Rank</div>
              </div>
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2 drop-shadow-lg">
                  {Math.round(data.averagePointsPerGW)}
                </div>
                <div className="text-white/90 font-semibold text-lg">Avg Points/GW</div>
              </div>
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2 drop-shadow-lg">
                  {data.greenArrows}
                </div>
                <div className="text-white/90 font-semibold text-lg">Green Arrows</div>
              </div>
            </motion.div>
          </div>
        )

      case "captain-performance":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">CAPTAIN MASTERCLASS</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">Your Armband Decisions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="text-6xl md:text-7xl font-black text-yellow-400 mb-4 drop-shadow-lg">
                  {data.captainPerformance?.totalPoints || 0}
                </div>
                <div className="text-2xl text-white/90 font-semibold mb-4">Total Captain Points</div>
                <div className="text-lg text-white/70 font-medium">
                  Average: {data.captainPerformance?.averagePoints || 0} points per gameweek
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-600/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-400/50 shadow-2xl">
                  <div className="text-2xl md:text-3xl font-black text-green-300 mb-2 drop-shadow-lg">
                    {data.captainPerformance?.bestCaptain?.name || "Unknown"}
                  </div>
                  <div className="text-white/90 font-semibold mb-2">Best Captain</div>
                  <div className="text-green-300 font-bold text-xl">
                    {data.captainPerformance?.bestCaptain?.points || 0} pts
                  </div>
                </div>
                <div className="bg-red-600/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-red-400/50 shadow-2xl">
                  <div className="text-2xl md:text-3xl font-black text-red-300 mb-2 drop-shadow-lg">
                    {100 - (data.captainPerformance?.failRate || 0)}%
                  </div>
                  <div className="text-white/90 font-semibold">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        )

      case "transfer-activity":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">TRANSFER MARKET</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">Your Squad Tinkering</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                  <div className="text-5xl md:text-6xl font-black text-blue-400 mb-2 drop-shadow-lg">
                    {data.transferActivity?.totalTransfers || 0}
                  </div>
                  <div className="text-white/90 font-semibold text-lg">Total Transfers</div>
                </div>
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                  <div className="text-5xl md:text-6xl font-black text-red-400 mb-2 drop-shadow-lg">
                    {data.transferActivity?.totalHits || 0}
                  </div>
                  <div className="text-white/90 font-semibold text-lg">Hits Taken</div>
                </div>
              </div>

              <div className="bg-green-600/30 backdrop-blur-xl rounded-2xl p-8 border-2 border-green-400/50 shadow-2xl">
                <div className="text-2xl font-black text-green-300 mb-4 drop-shadow-lg">Best Transfer In</div>
                <div className="text-3xl font-black text-white mb-2">
                  {data.transferActivity?.bestTransferIn?.name || "Unknown"}
                </div>
                <div className="text-green-300 font-bold text-xl">
                  +{data.transferActivity?.bestTransferIn?.pointsGained || 0} points after transfer
                </div>
              </div>
            </motion.div>
          </div>
        )

      case "bench-analysis":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">BENCH MANAGEMENT</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">Points Left Behind</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="text-6xl md:text-7xl font-black text-orange-400 mb-4 drop-shadow-lg">
                  {data.benchAnalysis?.totalBenchPoints || 0}
                </div>
                <div className="text-2xl text-white/90 font-semibold mb-4">Total Bench Points</div>
                <div className="text-lg text-white/70 font-medium">
                  Average: {data.benchAnalysis?.averagePerGW || 0} points per gameweek
                </div>
              </div>

              <div className="bg-red-600/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-red-400/50 shadow-2xl">
                <div className="text-xl font-black text-red-300 mb-4 drop-shadow-lg">Worst Bench Call</div>
                <div className="text-2xl font-black text-white mb-2">
                  {data.benchAnalysis?.worstBenchCall?.playerName || "Unknown"}
                </div>
                <div className="text-red-300 font-bold text-lg">
                  {data.benchAnalysis?.worstBenchCall?.points || 0} points on bench (GW
                  {data.benchAnalysis?.worstBenchCall?.gameweek || 0})
                </div>
              </div>
            </motion.div>
          </div>
        )

      case "biggest-gameweek":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">PEAK PERFORMANCE</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">Your Best Gameweek</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="text-7xl md:text-8xl font-black text-yellow-400 mb-4 drop-shadow-lg">
                  {data.bestGw?.points || 0}
                </div>
                <div className="text-3xl text-white/90 font-semibold mb-4">Best Gameweek Score</div>
                <div className="text-xl text-white/70 font-medium">Gameweek {data.bestGw?.gameweek || 0}</div>
              </div>

              <div className="space-y-4">
                <div className="text-xl text-white/90 font-semibold mb-4">Top Contributors:</div>
                {data.bestGw?.topContributors?.slice(0, 3).map((contributor: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-gradient-to-r from-yellow-600/40 to-orange-600/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-400/50 shadow-2xl"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-black text-white drop-shadow-lg">
                        {contributor.name} {contributor.isCaptain && "👑"}
                      </div>
                      <div className="text-2xl font-black text-yellow-400 drop-shadow-lg">{contributor.points} pts</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )

      case "one-got-away":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">THE ONE THAT GOT AWAY</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">Missed Opportunities</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="text-4xl font-black text-red-400 mb-6 drop-shadow-lg">
                  {data.oneGotAway?.playerName || "Unknown Player"}
                </div>
                <div className="text-xl text-white/90 font-semibold mb-4">Top scorer you never owned</div>
                <div className="text-5xl font-black text-white mb-4 drop-shadow-lg">
                  {data.oneGotAway?.seasonTotal || 0} points
                </div>
                <div className="text-lg text-red-300 font-bold">
                  Best gameweek: {data.oneGotAway?.pointsMissed || 0} points (GW{data.oneGotAway?.gameweek || 0})
                </div>
              </div>

              <div className="bg-red-600/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-red-400/50 shadow-2xl">
                <div className="text-lg text-white/90 font-semibold">
                  This player could have been the difference maker in your season!
                </div>
              </div>
            </motion.div>
          </div>
        )

      case "you-vs-game":
        return (
          <div className="text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">YOU VS THE GAME</h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold drop-shadow-lg">How You Compare</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                  <div className="text-2xl font-black text-blue-400 mb-4 drop-shadow-lg">Captain Average</div>
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                    {data.comparisons?.captainAvgVsTop10k?.user || 0}
                  </div>
                  <div className="text-sm text-white/70 font-medium">
                    vs {data.comparisons?.captainAvgVsTop10k?.top10k || 0} (Top 10k)
                  </div>
                </div>
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
                  <div className="text-2xl font-black text-green-400 mb-4 drop-shadow-lg">Bench Points</div>
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                    {data.comparisons?.benchPointsVsAverage?.user || 0}
                  </div>
                  <div className="text-sm text-white/70 font-medium">
                    vs {data.comparisons?.benchPointsVsAverage?.gameAverage || 0} (Average)
                  </div>
                </div>
              </div>

              <div className="bg-purple-600/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-400/50 shadow-2xl">
                <div className="text-xl font-black text-purple-300 mb-4 drop-shadow-lg">Most Trusted Player</div>
                <div className="text-3xl font-black text-white mb-2">
                  {data.comparisons?.mostTrustedVsGlobal?.user || "Unknown"}
                </div>
                <div className="text-purple-300 font-bold text-lg">
                  Global favorite: {data.comparisons?.mostTrustedVsGlobal?.global || "Unknown"}
                </div>
              </div>
            </motion.div>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl">{insight.title}</h2>
            <p className="text-xl text-white/90 font-semibold drop-shadow-lg">{insight.subtitle}</p>
          </div>
        )
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />

      {/* Navigation */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-30 flex justify-between items-center">
        <Button
          onClick={onHome}
          className="h-10 w-10 sm:h-12 sm:w-12 p-0 bg-black/80 hover:bg-black/90 text-white border-2 border-white/30 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        <div className="bg-black/80 backdrop-blur-xl px-3 py-1 sm:px-4 sm:py-2 rounded-full border-2 border-white/30 shadow-2xl">
          <span className="text-white/90 text-xs sm:text-sm font-semibold">
            {currentIndex} / {totalSections - 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mx-auto"
        >
          {renderInsightContent()}
        </motion.div>
      </div>

      {/* Navigation arrows - visible but with mobile-friendly hint */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4 sm:gap-6">
        <Button
          onClick={onPrev}
          disabled={currentIndex <= 1}
          className="h-10 w-10 sm:h-14 sm:w-14 p-0 bg-black/80 hover:bg-black/90 text-white border-2 border-white/30 rounded-full backdrop-blur-xl disabled:opacity-50 shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <ArrowLeft className="w-5 h-5 sm:w-7 sm:h-7" />
        </Button>

        <div className="px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border-2 border-white/30 shadow-2xl hidden sm:block">
          <span className="text-white text-sm font-semibold">Swipe to navigate</span>
        </div>

        <Button
          onClick={onNext}
          disabled={currentIndex >= totalSections - 1}
          className="h-10 w-10 sm:h-14 sm:w-14 p-0 bg-black/80 hover:bg-black/90 text-white border-2 border-white/30 rounded-full backdrop-blur-xl disabled:opacity-50 shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7" />
        </Button>
      </div>
    </div>
  )
}

export default FIFA25InsightCard
