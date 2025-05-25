"use client"

import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface FinalSceneProps {
  data: FPLData
  onRestart: () => void
}

export default function FinalScene({ data, onRestart }: FinalSceneProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FPL Manager's Moment",
          text: `Check out my FPL 2024/25 season! I scored ${data.totalPoints} points and finished rank ${data.overallRank?.toLocaleString()}!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `Check out my FPL 2024/25 season! I scored ${data.totalPoints} points and finished rank ${data.overallRank?.toLocaleString()}!`
      navigator.clipboard.writeText(text)
      alert("Results copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Confetti animation */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: 360 * 3,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"][i % 5],
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 pixel-text">SEASON COMPLETE!</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 pixel-text">{data.managerTitle}</h2>
      </motion.div>

      {/* Final summary card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bg-white bg-opacity-95 rounded-lg p-8 border-4 border-gray-800 max-w-md w-full mb-8"
        id="final-summary-card"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold pixel-text text-gray-800 mb-2">{data.managerName}</h3>
          <div className="text-4xl font-bold pixel-text text-green-600">{data.totalPoints}</div>
          <div className="text-lg pixel-text text-gray-600">Total Points</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold pixel-text text-blue-600">{data.overallRank?.toLocaleString()}</div>
            <div className="text-sm pixel-text text-gray-600">Final Rank</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold pixel-text text-purple-600">{data.bestGw?.points}</div>
            <div className="text-sm pixel-text text-gray-600">Best GW</div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h4 className="text-lg font-bold pixel-text text-gray-800 mb-3 text-center">ACHIEVEMENTS</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.badges.map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-yellow-400 rounded-lg p-2 border-2 border-yellow-600 text-center"
              >
                <div className="text-xs pixel-text text-yellow-800 font-bold">{badge}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm pixel-text text-gray-600">FPL 2024/25 Season Wrapped</div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          onClick={handleShare}
          className="bg-blue-500 hover:bg-blue-600 border-4 border-blue-700 pixel-text text-white px-6 py-3 flex items-center gap-2"
        >
          <Share2 size={16} />
          SHARE RESULTS
        </Button>

        <Button
          onClick={onRestart}
          className="bg-green-500 hover:bg-green-600 border-4 border-green-700 pixel-text text-white px-6 py-3"
        >
          TRY ANOTHER MANAGER
        </Button>
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-green-600 to-green-500 border-t-4 border-green-700"></div>
    </div>
  )
}
