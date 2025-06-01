"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Share2, Trophy, Target, TrendingUp, Users, Star, Award } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import RetroCard from "./retro-card"
import RetroStatDisplay from "./retro-stat-display"
import { useAudio } from "@/hooks/use-audio"

interface RetroFinalCardProps {
  data: FPLData
  onRestart: () => void
  onBack: () => void
}

export default function RetroFinalCard({ data, onRestart, onBack }: RetroFinalCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState("")
  const { playSound } = useAudio()

  // Generate manager title based on performance
  const generateTitle = useCallback(() => {
    const rank = data.overallRank || 0
    const points = data.totalPoints || 0

    if (rank <= 10000) return "🏆 ELITE MANAGER"
    if (rank <= 50000) return "⭐ TOP MANAGER"
    if (rank <= 100000) return "🎯 SKILLED MANAGER"
    if (rank <= 500000) return "📈 RISING MANAGER"
    if (points > 2000) return "💪 STRONG MANAGER"
    if (points > 1500) return "🎮 SOLID MANAGER"
    return "⚽ FPL MANAGER"
  }, [data])

  useEffect(() => {
    setSelectedTitle(generateTitle())
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [generateTitle])

  // Calculate season stats
  const seasonStats = [
    { icon: Trophy, label: "TOTAL POINTS", value: data.totalPoints?.toLocaleString() || "0", color: "yellow" as const },
    { icon: Target, label: "OVERALL RANK", value: data.overallRank?.toLocaleString() || "N/A", color: "blue" as const },
    { icon: TrendingUp, label: "BEST GW", value: data.bestGw?.points?.toString() || "0", color: "green" as const },
    { icon: Users, label: "TRANSFERS", value: data.totalTransfers?.toString() || "0", color: "red" as const },
    {
      icon: Star,
      label: "TEAM VALUE",
      value: `£${((data.maxTeamValue || 1000) / 10).toFixed(1)}m`,
      color: "green" as const,
    },
    { icon: Award, label: "CAPTAIN PTS", value: data.captainPoints?.toString() || "0", color: "blue" as const },
  ]

  return (
    <div
      className="h-screen w-screen retro-background crt-effect overflow-hidden"
      style={{
        backgroundImage: "url('/images/final-share-card.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
              y: (typeof window !== "undefined" ? window.innerHeight : 600) + 20,
              opacity: 0.8,
            }}
            animate={{
              y: -20,
              opacity: [0.8, 1, 0.8],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 8,
              ease: "linear",
            }}
            className="absolute w-3 h-3 bg-yellow-400 border border-yellow-300"
            style={{
              boxShadow: "0 0 10px rgba(255,212,0,0.8)",
              imageRendering: "pixelated",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Title Section */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-6"
          >
            <RetroCard title="FULL TIME WHISTLE!" headerIcon={<Trophy size={24} />} className="mb-4">
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="text-8xl mb-4"
                >
                  🏆
                </motion.div>

                <div className="retro-stat-box bg-gradient-to-r from-yellow-400 to-orange-500 border-white px-6 py-3 inline-block mb-4">
                  <div className="retro-subtitle text-black font-bold">{selectedTitle}</div>
                </div>

                <div className="retro-stat-box bg-gradient-to-br from-blue-600 to-purple-700 border-cyan-300 px-6 py-4">
                  <h2 className="retro-body text-white font-bold mb-2">{data.managerName || "FPL MANAGER"}</h2>
                  <p className="retro-caption text-cyan-200">TEAM: {data.teamName || "UNKNOWN TEAM"}</p>
                </div>
              </div>
            </RetroCard>
          </motion.div>

          {/* Season Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            {seasonStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotateY: -90 }}
                animate={{ scale: isVisible ? 1 : 0, rotateY: isVisible ? 0 : -90 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
              >
                <RetroStatDisplay
                  value={stat.value}
                  label={stat.label}
                  icon={<stat.icon size={20} />}
                  color={stat.color}
                  size="medium"
                  animated={true}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="space-y-4"
          >
            <Button
              onClick={() => {
                playSound("click")
                onBack()
              }}
              className="retro-button w-full py-4"
            >
              <span className="retro-body">VIEW INSIGHTS AGAIN</span>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  playSound("click")
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: "My FPL Season Summary",
                      text: `I just completed my FPL season review! ${selectedTitle} with ${data.totalPoints} points!`,
                      url: window.location.href,
                    })
                  }
                }}
                className="retro-button py-3"
              >
                <Share2 size={16} className="mr-2" />
                <span className="retro-body">SHARE</span>
              </Button>

              <Button
                onClick={() => {
                  playSound("celebration")
                  onRestart()
                }}
                className="retro-button py-3"
              >
                <Home size={16} className="mr-2" />
                <span className="retro-body">NEW SEASON</span>
              </Button>
            </div>
          </motion.div>

          {/* Season Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
            transition={{ delay: 1.8, type: "spring", stiffness: 150 }}
            className="text-center mt-6"
          >
            <div className="retro-stat-box bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 border-white px-4 py-2 inline-block">
              <div className="retro-caption text-black font-bold">🏆 FPL SEASON 2024/25 COMPLETE 🏆</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
