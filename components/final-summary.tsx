"use client"

import { motion } from "framer-motion"
import { Trophy, Share2, RotateCcw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FPLData } from "@/types/fpl"

interface FinalSummaryProps {
  data: FPLData
  onRestart: () => void
}

export function FinalSummary({ data, onRestart }: FinalSummaryProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FPL Season Wrapped",
          text: `I finished with ${data.totalPoints} points and ranked ${data.overallRank?.toLocaleString()}!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I finished my FPL season with ${data.totalPoints} points and ranked ${data.overallRank?.toLocaleString()}! Check out your season wrapped at ${window.location.href}`,
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-auto bg-black/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-green-600/20" />
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Season Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-gray-300"
            >
              Your 2024/25 FPL journey wrapped
            </motion.p>
          </div>
        </div>

        {/* Final Stats */}
        <div className="px-6 pb-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold text-white mb-1">{data.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Total Points</div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gray-800/50 rounded-xl p-3 text-center"
            >
              <div className="text-lg font-bold text-white">{data.overallRank?.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Final Rank</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gray-800/50 rounded-xl p-3 text-center"
            >
              <div className="text-lg font-bold text-white">{Math.round((data.overallRank! / 11000000) * 100)}%</div>
              <div className="text-xs text-gray-400">Top Percentile</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="bg-gray-800/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Season Highlights</span>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <div>
                • Best Gameweek: {data.bestGw?.points} points (GW{data.bestGw?.gameweek})
              </div>
              <div>• Captain Success: {data.captainAccuracy}%</div>
              <div>• Green Arrows: {data.greenArrows}</div>
              <div>• Badges Earned: {data.badges.length}</div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <Button onClick={handleShare} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share Your Season
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another Manager
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default FinalSummary
