"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Share2, Trophy, Target, TrendingUp, Users, Star, Award, Sparkles } from "lucide-react"
import type { FPLData } from "@/types/fpl"

interface FifaFinalCardProps {
  data: FPLData
  onRestart: () => void
  onBack: () => void
}

export default function FifaFinalCard({ data, onRestart, onBack }: FifaFinalCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState("")

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
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [generateTitle])

  const seasonStats = [
    { icon: Trophy, label: "TOTAL POINTS", value: data.totalPoints?.toLocaleString() || "0", color: "blue" },
    { icon: Target, label: "OVERALL RANK", value: data.overallRank?.toLocaleString() || "N/A", color: "purple" },
    { icon: TrendingUp, label: "BEST GW", value: data.bestGw?.points?.toString() || "0", color: "green" },
    { icon: Users, label: "TRANSFERS", value: data.totalTransfers?.toString() || "0", color: "orange" },
    { icon: Star, label: "TEAM VALUE", value: `£${((data.maxTeamValue || 1000) / 10).toFixed(1)}M`, color: "yellow" },
    { icon: Award, label: "CAPTAIN PTS", value: data.captainPoints?.toString() || "0", color: "red" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
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
            className="absolute w-3 h-3 bg-yellow-400 rounded-full"
            style={{
              boxShadow: "0 0 10px rgba(255,212,0,0.8)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="text-center mb-12"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                className="text-8xl mb-6"
              >
                🏆
              </motion.div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                Season Complete!
              </h1>

              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-semibold text-white">{selectedTitle}</span>
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{data.managerName || "FPL MANAGER"}</h2>
                <p className="text-gray-300">{data.teamName || "UNKNOWN TEAM"}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {seasonStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: isVisible ? 1 : 0, rotateY: isVisible ? 0 : -180 }}
                transition={{ delay: 1.0 + index * 0.15, type: "spring", stiffness: 150 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all"
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="space-y-4"
          >
            <Button
              onClick={onBack}
              className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-xl"
            >
              <span className="text-lg font-medium">View Insights Again</span>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "My FPL Season Summary",
                      text: `I just completed my FPL season review! ${selectedTitle} with ${data.totalPoints} points!`,
                      url: window.location.href,
                    })
                  }
                }}
                className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>

              <Button
                onClick={onRestart}
                className="h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                New Season
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
