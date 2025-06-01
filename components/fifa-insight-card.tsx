"use client"

import { motion } from "framer-motion"
import {
  Trophy,
  Target,
  TrendingUp,
  Users,
  Star,
  Award,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Crown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { FPLData } from "@/types/fpl"
import type { Insight } from "@/lib/insights-retro"

interface FifaInsightCardProps {
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

export default function FifaInsightCard({ insight, data, isPaused }: FifaInsightCardProps) {
  const insightData = insight.getData(data)
  const IconComponent = iconMap[insight.iconType as keyof typeof iconMap] || Trophy

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          <div className="relative flex items-center gap-4">
            <motion.div
              animate={!isPaused ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="p-3 bg-white/10 rounded-2xl"
            >
              <IconComponent className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{insight.title}</h2>
              <p className="text-gray-300 text-sm">Your season insight</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-8 pb-8">
          {/* Primary stat */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
              <motion.div
                animate={!isPaused ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-4xl font-bold text-white"
              >
                {insightData.primaryValue}
              </motion.div>
              {insightData.trend === "up" && <ArrowUp className="w-6 h-6 text-green-400" />}
              {insightData.trend === "down" && <ArrowDown className="w-6 h-6 text-red-400" />}
            </div>
            <p className="text-lg text-gray-200 mt-3">{insightData.primaryLabel}</p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/5 rounded-2xl p-6 mb-8"
          >
            <p className="text-gray-200 leading-relaxed text-center">{insightData.description}</p>
            {insightData.funFact && (
              <motion.div
                animate={!isPaused ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
              >
                <p className="text-blue-200 text-sm text-center flex items-center justify-center gap-2">
                  <span className="text-lg">💡</span>
                  {insightData.funFact}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Secondary stats */}
          {insightData.secondaryStats && insightData.secondaryStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {insightData.secondaryStats.slice(0, 4).map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                    {stat.value}
                    {stat.trend === "up" && <ArrowUp className="w-4 h-4 text-green-400" />}
                    {stat.trend === "down" && <ArrowDown className="w-4 h-4 text-red-400" />}
                  </div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
