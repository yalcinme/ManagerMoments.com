"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import { Button } from "@/components/ui/button"
import { Share2, RotateCcw } from "lucide-react"

interface TrophyCeremonyProps {
  data: FPLData
  onRestart: () => void
}

export default function TrophyCeremony({ data, onRestart }: TrophyCeremonyProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FPL Manager's Moment",
          text: `Check out my FPL 2024/25 season! I'm "${data.managerTitle}" with ${data.totalPoints} points!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      setShowShareOptions(true)
    }
  }

  const handleCopyText = () => {
    const text = `🏆 My FPL Manager's Moment 🏆\n\nTitle: ${data.managerTitle}\nPoints: ${data.totalPoints}\nRank: ${data.overallRank?.toLocaleString()}\nBadges: ${data.badges.length}\n\n#FPL #ManagersMoment`
    navigator.clipboard.writeText(text)
    alert("Results copied to clipboard!")
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      {/* Confetti */}
      {Array.from({ length: 50 }).map((_, i) => (
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
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"][i % 6],
          }}
        />
      ))}

      {/* Trophy ceremony hall */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="bg-white bg-opacity-95 rounded-lg p-8 border-4 border-yellow-400 max-w-md w-full mx-4"
          id="trophy-card"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h1 className="text-2xl font-bold pixel-text text-gray-800 mb-2">SEASON COMPLETE!</h1>
            <h2 className="text-xl font-bold pixel-text text-purple-600">{data.managerName}</h2>
          </div>

          {/* Manager title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-400"
          >
            <div className="text-lg pixel-text text-yellow-800 mb-1">YOU ARE</div>
            <div className="text-2xl font-bold pixel-text text-yellow-900">{data.managerTitle}</div>
          </motion.div>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold pixel-text text-green-600">{data.totalPoints}</div>
              <div className="text-xs pixel-text text-gray-600">POINTS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold pixel-text text-blue-600">{data.overallRank?.toLocaleString()}</div>
              <div className="text-xs pixel-text text-gray-600">RANK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold pixel-text text-purple-600">{data.badges.length}</div>
              <div className="text-xs pixel-text text-gray-600">BADGES</div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-6">
            <h3 className="text-lg font-bold pixel-text text-gray-800 mb-3 text-center">ACHIEVEMENTS</h3>
            <div className="grid grid-cols-2 gap-2">
              {data.badges.slice(0, 6).map((badge, index) => (
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

          {/* Footer */}
          <div className="text-center text-xs pixel-text text-gray-500 mb-4">FPL 2024/25 • MANAGER'S MOMENT</div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleShare}
              className="w-full bg-blue-500 hover:bg-blue-600 border-2 border-blue-700 pixel-text text-white flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              SHARE YOUR MOMENT
            </Button>

            {showShareOptions && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                <Button
                  onClick={handleCopyText}
                  size="sm"
                  className="flex-1 bg-gray-500 hover:bg-gray-600 pixel-text text-white"
                >
                  COPY TEXT
                </Button>
              </motion.div>
            )}

            <Button
              onClick={onRestart}
              className="w-full bg-green-500 hover:bg-green-600 border-2 border-green-700 pixel-text text-white flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              TRY ANOTHER MANAGER
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
