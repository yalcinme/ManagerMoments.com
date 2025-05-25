"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import MarioAvatar from "../mario-avatar"
import InsightCard from "../insight-card"

interface Level1KickoffProps {
  data: FPLData
  onNext: () => void
  isPaused: boolean
}

const insights = ["context", "best-gw", "worst-gw", "rank-jump", "rank-drop"] as const

type Insight = (typeof insights)[number]

export default function Level1Kickoff({ data, onNext, isPaused }: Level1KickoffProps) {
  const [currentInsight, setCurrentInsight] = useState<Insight>("context")
  const [marioPosition, setMarioPosition] = useState(0)
  const [showInsight, setShowInsight] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = setTimeout(() => {
      setShowInsight(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isPaused])

  useEffect(() => {
    if (isPaused) return

    const currentIndex = insights.indexOf(currentInsight)
    if (currentIndex < insights.length - 1) {
      const timer = setTimeout(() => {
        setCurrentInsight(insights[currentIndex + 1])
        setMarioPosition((currentIndex + 1) * 20)
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onNext, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentInsight, onNext, isPaused])

  const getInsightData = (insight: Insight) => {
    switch (insight) {
      case "context":
        return {
          title: "SEASON OVERVIEW",
          content: `11 million players lined up at the start... you finished top ${Math.round((data.overallRank! / 11000000) * 100)}%!`,
          points: data.totalPoints,
          rank: data.overallRank,
        }
      case "best-gw":
        return {
          title: `GW${data.bestGw?.gameweek} HIGH SCORE!`,
          content: `Your best gameweek performance!`,
          points: data.bestGw?.points,
          color: "gold",
        }
      case "worst-gw":
        return {
          title: `GW${data.worstGw?.gameweek} SLIP UP`,
          content: `Even legends have off days...`,
          points: data.worstGw?.points,
          color: "red",
        }
      case "rank-jump":
        return {
          title: "BIGGEST CLIMB",
          content: `Climbed ${data.biggestRankJump?.places.toLocaleString()} places after GW${data.biggestRankJump?.gameweek}!`,
          color: "green",
        }
      case "rank-drop":
        return {
          title: "BIGGEST FALL",
          content: `Lost ${data.biggestRankDrop?.places.toLocaleString()} places after GW${data.biggestRankDrop?.gameweek}`,
          color: "red",
        }
      default:
        return { title: "", content: "" }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-400 to-green-400">
      {/* Stadium background */}
      <div className="absolute inset-0">
        {/* Stadium lights */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
            className="absolute w-6 h-6 bg-yellow-300 rounded-full"
            style={{
              top: "15%",
              left: `${10 + i * 10}%`,
              boxShadow: "0 0 15px rgba(255, 255, 0, 0.8)",
            }}
          />
        ))}

        {/* Pitch markings */}
        <div className="absolute bottom-20 left-0 w-full h-1 bg-white opacity-60"></div>
        <div className="absolute bottom-40 left-1/2 w-1 h-20 bg-white opacity-60"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border-2 border-white rounded-full opacity-60"></div>
      </div>

      {/* Scoreboard */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black rounded-lg p-4 border-4 border-yellow-400"
      >
        <div className="text-center">
          <div className="text-yellow-400 pixel-text text-sm mb-2">FINAL SCORE</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-white pixel-text text-2xl"
          >
            {data.totalPoints}
          </motion.div>
        </div>
      </motion.div>

      {/* Mario running across the pitch */}
      <div className="absolute bottom-32 left-0 w-full h-16">
        <motion.div
          animate={{ x: `${marioPosition}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bottom-0"
        >
          <MarioAvatar isRunning={!isPaused} />
        </motion.div>

        {/* Question blocks */}
        {insights.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={currentInsight === insights[i] ? { y: [-5, 0] } : {}}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 w-12 h-12 bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center"
            style={{ left: `${15 + i * 20}%` }}
          >
            <span className="text-yellow-800 font-bold pixel-text text-lg">?</span>
          </motion.div>
        ))}

        {/* Coins/footballs */}
        {insights.map((insight, i) => (
          <AnimatePresence key={insight}>
            {currentInsight === insight && (
              <motion.div
                initial={{ y: 64, opacity: 0 }}
                animate={{ y: -20, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute bottom-16 w-6 h-6 bg-white rounded-full border-2 border-black"
                style={{ left: `${18 + i * 20}%` }}
              />
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Insight cards */}
      <AnimatePresence>
        {showInsight && (
          <InsightCard key={currentInsight} {...getInsightData(currentInsight)} onClose={() => setShowInsight(false)} />
        )}
      </AnimatePresence>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-green-600 to-green-500 border-t-4 border-green-700"></div>
    </div>
  )
}
