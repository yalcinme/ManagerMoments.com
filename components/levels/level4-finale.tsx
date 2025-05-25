"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import MarioAvatar from "../mario-avatar"
import InsightCard from "../insight-card"

interface Level4FinaleProps {
  data: FPLData
  onNext: () => void
  isPaused: boolean
}

const insights = ["league-performance", "final-rank", "season-summary"] as const

type Insight = (typeof insights)[number]

export default function Level4Finale({ data, onNext, isPaused }: Level4FinaleProps) {
  const [currentInsight, setCurrentInsight] = useState<Insight>("league-performance")
  const [marioPosition, setMarioPosition] = useState(0)

  useEffect(() => {
    if (isPaused) return

    const currentIndex = insights.indexOf(currentInsight)
    if (currentIndex < insights.length - 1) {
      const timer = setTimeout(() => {
        setCurrentInsight(insights[currentIndex + 1])
        setMarioPosition((currentIndex + 1) * 30)
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onNext, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentInsight, onNext, isPaused])

  const getInsightData = (insight: Insight) => {
    switch (insight) {
      case "league-performance":
        return {
          title: "LEAGUE BATTLES",
          content: data.leagueWins > 0 ? `Won ${data.leagueWins} mini-leagues!` : "Fought hard in your leagues",
          subtitle: data.h2hRecord ? `H2H: ${data.h2hRecord}` : "Classic leagues only",
          color: data.leagueWins > 0 ? "gold" : "blue",
        }
      case "final-rank":
        return {
          title: "FINAL POSITION",
          content: `Rank ${data.overallRank?.toLocaleString()}`,
          subtitle: `Top ${Math.round((data.overallRank! / 11000000) * 100)}% worldwide`,
          color: data.overallRank! < 100000 ? "gold" : data.overallRank! < 1000000 ? "green" : "blue",
        }
      case "season-summary":
        return {
          title: "SEASON COMPLETE",
          content: `${data.totalPoints} points earned`,
          subtitle: `${data.greenArrows} green arrows, ${data.redArrows} red arrows`,
        }
      default:
        return { title: "", content: "" }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-yellow-400 to-orange-500">
      {/* Castle background */}
      <div className="absolute inset-0">
        {/* Castle structure */}
        <div className="absolute bottom-20 right-1/4 w-32 h-40 bg-gray-600 border-4 border-gray-800">
          {/* Castle towers */}
          <div className="absolute -top-8 left-2 w-8 h-12 bg-gray-600 border-2 border-gray-800"></div>
          <div className="absolute -top-8 right-2 w-8 h-12 bg-gray-600 border-2 border-gray-800"></div>

          {/* Trophy on top */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 border-2 border-yellow-600"
          >
            <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
          </motion.div>

          {/* Castle door */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-gray-800 rounded-t-full"></div>
        </div>

        {/* Fireworks */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
            className="absolute w-4 h-4 rounded-full"
            style={{
              top: `${20 + Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"][i % 5],
            }}
          />
        ))}
      </div>

      {/* Mario approaching castle */}
      <div className="absolute bottom-32 left-0 w-full h-16">
        <motion.div
          animate={{ x: `${marioPosition}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bottom-0"
        >
          <MarioAvatar isRunning={!isPaused} />
        </motion.div>

        {/* League trophies */}
        {data.leagueWins > 0 &&
          Array.from({ length: Math.min(data.leagueWins, 3) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.5 }}
              className="absolute bottom-8 w-6 h-6 bg-yellow-400 border-2 border-yellow-600"
              style={{ left: `${30 + i * 10}%` }}
            >
              <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
            </motion.div>
          ))}
      </div>

      {/* Insight display */}
      <InsightCard key={currentInsight} {...getInsightData(currentInsight)} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-orange-600 to-red-500 border-t-4 border-orange-700"></div>
    </div>
  )
}
