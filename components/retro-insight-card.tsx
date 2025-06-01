"use client"

import { motion } from "framer-motion"
import { Trophy, Target, TrendingUp, Users, Star, Award, Zap, Shield, Clock, BarChart3, Crown } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import type { Insight } from "@/lib/insights"
import RetroCard from "./retro-card"
import RetroStatDisplay from "./retro-stat-display"

interface RetroInsightCardProps {
  insight: Insight
  data: FPLData
  isPaused: boolean
}

const iconMap = {
  trophy: Trophy,
  target: Target,
  trending: TrendingUp,
  users: Users,
  star: Star,
  award: Award,
  zap: Zap,
  shield: Shield,
  clock: Clock,
  chart: BarChart3,
  crown: Crown,
}

export function RetroInsightCard({ insight, data, isPaused }: RetroInsightCardProps) {
  const insightData = insight.getData(data)
  const IconComponent = iconMap[insight.iconType as keyof typeof iconMap] || Trophy

  return (
    <div className="w-full max-w-4xl mx-auto">
      <RetroCard title={insight.title} headerIcon={<IconComponent size={20} />} className="w-full">
        {/* Main Stat Display */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <div className="retro-stat-box bg-gradient-to-br from-yellow-400 to-orange-500 border-white px-8 py-6 inline-block">
              <motion.div
                animate={
                  !isPaused
                    ? {
                        scale: [1, 1.1, 1],
                        textShadow: [
                          "2px 2px 0 #000000",
                          "3px 3px 0 #000000, 0 0 20px currentColor",
                          "2px 2px 0 #000000",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl md:text-8xl font-bold text-black retro-glow"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {insightData.primaryValue}
              </motion.div>
              <div className="retro-subtitle text-black mt-2 uppercase tracking-wider">{insightData.primaryLabel}</div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="retro-stat-box bg-gradient-to-br from-blue-600 to-purple-700 border-cyan-300 px-6 py-4 mb-6"
          >
            <p className="retro-body text-white leading-relaxed">{insightData.description}</p>
            {insightData.funFact && (
              <motion.p
                animate={!isPaused ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="retro-caption text-yellow-300 mt-3 flex items-center justify-center gap-2"
              >
                <span className="text-yellow-400">💡</span>
                {insightData.funFact}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Secondary Stats Grid */}
        {insightData.secondaryStats && insightData.secondaryStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {insightData.secondaryStats.slice(0, 4).map((stat, index) => {
              const colors = ["green", "blue", "red", "yellow"] as const
              const sizes = ["medium", "medium", "small", "small"] as const

              return (
                <RetroStatDisplay
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  color={colors[index % colors.length]}
                  size={sizes[index] || "medium"}
                  animated={!isPaused}
                />
              )
            })}
          </motion.div>
        )}

        {/* Animated Elements */}
        {!isPaused && (
          <motion.div
            className="absolute top-4 right-4"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            }}
          >
            <IconComponent size={24} className="text-yellow-400 retro-glow" />
          </motion.div>
        )}
      </RetroCard>
    </div>
  )
}

export default RetroInsightCard
