"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import MarioAvatar from "../mario-avatar"
import InsightCard from "../insight-card"

interface Level3PerformanceProps {
  data: FPLData
  onNext: () => void
  isPaused: boolean
}

const insights = ["consistency", "captain-points", "captain-accuracy", "top-player", "team-stats", "formation"] as const

type Insight = (typeof insights)[number]

export default function Level3Performance({ data, onNext, isPaused }: Level3PerformanceProps) {
  const [currentInsight, setCurrentInsight] = useState<Insight>("consistency")
  const [marioPosition, setMarioPosition] = useState(0)

  useEffect(() => {
    if (isPaused) return

    const currentIndex = insights.indexOf(currentInsight)
    if (currentIndex < insights.length - 1) {
      const timer = setTimeout(() => {
        setCurrentInsight(insights[currentIndex + 1])
        setMarioPosition((currentIndex + 1) * 15)
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onNext, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentInsight, onNext, isPaused])

  const getInsightData = (insight: Insight) => {
    switch (insight) {
      case "consistency":
        return {
          title: "CONSISTENCY CHECK",
          content: `Above average in ${data.aboveAverageWeeks}/38 gameweeks`,
          subtitle: `${Math.round((data.aboveAverageWeeks / 38) * 100)}% success rate`,
          color: data.aboveAverageWeeks > 19 ? "green" : "orange",
        }
      case "captain-points":
        return {
          title: "CAPTAIN CONTRIBUTION",
          content: `${data.captainPoints} points from captains`,
          subtitle: `${Math.round((data.captainPoints / data.totalPoints) * 100)}% of total points`,
        }
      case "captain-accuracy":
        return {
          title: "CAPTAIN ACCURACY",
          content: `${data.captainAccuracy}% hit rate`,
          subtitle: `${Math.round((data.captainAccuracy / 100) * 38)} successful picks`,
          color: data.captainAccuracy > 60 ? "green" : "orange",
        }
      case "top-player":
        return {
          title: "SEASON MVP",
          content: `${data.topPlayer?.name}`,
          subtitle: `${data.topPlayer?.points} points`,
          color: "gold",
        }
      case "team-stats":
        return {
          title: "TEAM PERFORMANCE",
          content: `${data.teamStats?.goals} goals, ${data.teamStats?.assists} assists`,
          subtitle: `${data.teamStats?.cleanSheets} clean sheets`,
        }
      case "formation":
        return {
          title: "FAVORITE FORMATION",
          content: `${data.favoriteFormation}`,
          subtitle: `Used most frequently`,
        }
      default:
        return { title: "", content: "" }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-600 to-purple-600">
      {/* Star road background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Performance pillars */}
        {Array.from({ length: 38 }).map((_, i) => (
          <div
            key={i}
            className={`absolute bottom-20 w-2 border-l-2 ${
              i < data.aboveAverageWeeks ? "border-green-400" : "border-gray-600"
            }`}
            style={{
              left: `${5 + (i * 90) / 38}%`,
              height: `${20 + Math.random() * 40}px`,
            }}
          />
        ))}
      </div>

      {/* Mario on star road */}
      <div className="absolute bottom-32 left-0 w-full h-16">
        <motion.div
          animate={{ x: `${marioPosition}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bottom-0"
        >
          <MarioAvatar isRunning={!isPaused} />
        </motion.div>

        {/* Captain badge */}
        {currentInsight === "captain-points" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            className="absolute bottom-8 left-1/3 w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600 flex items-center justify-center"
          >
            <span className="text-yellow-800 pixel-text text-xs font-bold">C</span>
          </motion.div>
        )}

        {/* MVP podium */}
        {currentInsight === "top-player" && (
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="absolute bottom-16 right-1/4 w-16 h-12 bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center"
          >
            <span className="text-yellow-800 pixel-text text-xs">MVP</span>
          </motion.div>
        )}
      </div>

      {/* Insight display */}
      <InsightCard key={currentInsight} {...getInsightData(currentInsight)} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-purple-800 to-indigo-800 border-t-4 border-purple-600"></div>
    </div>
  )
}
