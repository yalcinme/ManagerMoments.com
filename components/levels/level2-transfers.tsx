"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import MarioAvatar from "../mario-avatar"
import InsightCard from "../insight-card"

interface Level2TransfersProps {
  data: FPLData
  onNext: () => void
  isPaused: boolean
}

const insights = ["transfers-made", "hits-taken", "most-transferred", "chips-used", "best-chip"] as const

type Insight = (typeof insights)[number]

export default function Level2Transfers({ data, onNext, isPaused }: Level2TransfersProps) {
  const [currentInsight, setCurrentInsight] = useState<Insight>("transfers-made")
  const [marioPosition, setMarioPosition] = useState(0)

  useEffect(() => {
    if (isPaused) return

    const currentIndex = insights.indexOf(currentInsight)
    if (currentIndex < insights.length - 1) {
      const timer = setTimeout(() => {
        setCurrentInsight(insights[currentIndex + 1])
        setMarioPosition((currentIndex + 1) * 18)
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onNext, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentInsight, onNext, isPaused])

  const getInsightData = (insight: Insight) => {
    switch (insight) {
      case "transfers-made":
        return {
          title: "TRANSFER ACTIVITY",
          content: `You made ${data.totalTransfers} transfers this season`,
          subtitle: `Cost: ${data.totalHits * 4} points in hits`,
        }
      case "hits-taken":
        return {
          title: "POINT HITS",
          content: `${data.totalHits} hits taken`,
          subtitle: data.totalHits > 10 ? "The tinkerer's way!" : "Disciplined approach!",
          color: data.totalHits > 10 ? "red" : "green",
        }
      case "most-transferred":
        return {
          title: "MOST SIGNED PLAYER",
          content: `${data.mostTransferredIn?.name}`,
          subtitle: `Brought in ${data.mostTransferredIn?.count} times`,
        }
      case "chips-used":
        return {
          title: "CHIPS ACTIVATED",
          content: `${data.chipsUsed.length} chips used`,
          subtitle: data.chipsUsed.map((chip) => `${chip.name} (GW${chip.gameweek})`).join(", "),
        }
      case "best-chip":
        return {
          title: "BEST CHIP PLAY",
          content: `${data.bestChip?.name}`,
          subtitle: `${data.bestChip?.points} points in GW${data.bestChip?.gameweek}`,
          color: "gold",
        }
      default:
        return { title: "", content: "" }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-purple-600 to-blue-600">
      {/* Transfer town background */}
      <div className="absolute inset-0">
        {/* Buildings/shops */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-20 bg-gray-700 border-2 border-gray-500"
            style={{
              left: `${10 + i * 18}%`,
              width: "60px",
              height: `${80 + i * 20}px`,
            }}
          >
            {/* Shop signs */}
            <div className="absolute top-2 left-1 right-1 bg-yellow-400 text-black pixel-text text-xs text-center py-1">
              {i === 0 ? "TRANSFERS" : i === 1 ? "CHIPS" : i === 2 ? "HITS" : i === 3 ? "PLAYERS" : "STATS"}
            </div>

            {/* Windows */}
            <div className="absolute top-8 left-2 w-3 h-3 bg-yellow-300"></div>
            <div className="absolute top-8 right-2 w-3 h-3 bg-yellow-300"></div>
          </div>
        ))}
      </div>

      {/* Mario in transfer town */}
      <div className="absolute bottom-32 left-0 w-full h-16">
        <motion.div
          animate={{ x: `${marioPosition}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bottom-0"
        >
          <MarioAvatar isRunning={!isPaused} />
        </motion.div>

        {/* Transfer merchant */}
        <motion.div
          animate={currentInsight === "transfers-made" ? { y: [-5, 0] } : {}}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-0 left-1/4 w-12 h-12 bg-red-500 rounded-full border-2 border-red-700 flex items-center justify-center"
        >
          <span className="text-white pixel-text text-xs">NPC</span>
        </motion.div>

        {/* Chip blocks */}
        {data.chipsUsed.map((chip, i) => (
          <motion.div
            key={chip.name}
            initial={{ scale: 0 }}
            animate={currentInsight === "chips-used" ? { scale: 1, y: [-10, 0] } : { scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className="absolute bottom-16 w-10 h-10 bg-purple-500 border-2 border-purple-700 flex items-center justify-center"
            style={{ left: `${50 + i * 12}%` }}
          >
            <span className="text-white pixel-text text-xs">{chip.name.charAt(0)}</span>
          </motion.div>
        ))}
      </div>

      {/* Insight display */}
      <InsightCard key={currentInsight} {...getInsightData(currentInsight)} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-gray-600 to-gray-500 border-t-4 border-gray-700"></div>
    </div>
  )
}
