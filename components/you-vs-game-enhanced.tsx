"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { FPLData } from "@/types/fpl"

interface YouVsGameEnhancedProps {
  data: FPLData
  onNext?: () => void
  onPrev?: () => void
}

interface MetricProps {
  label: string
  userValue: string | number
  compareValue: string | number
  userLabel?: string
  compareLabel?: string
  isHigherBetter?: boolean
  delay?: number
}

function ComparisonMetric({
  label,
  userValue,
  compareValue,
  userLabel = "You",
  compareLabel = "Average",
  isHigherBetter = true,
  delay = 0,
}: MetricProps) {
  const userNum = typeof userValue === "string" ? 0 : userValue
  const compareNum = typeof compareValue === "string" ? 0 : compareValue

  let trend: "up" | "down" | "neutral" = "neutral"
  if (userNum > compareNum) {
    trend = isHigherBetter ? "up" : "down"
  } else if (userNum < compareNum) {
    trend = isHigherBetter ? "down" : "up"
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">{label}</h4>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{userLabel}</span>
          <span className="text-lg font-bold text-white">{userValue}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{compareLabel}</span>
          <span className="text-sm text-gray-300">{compareValue}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function YouVsGameEnhanced({ data, onNext, onPrev }: YouVsGameEnhancedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-auto bg-black/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20" />
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-bold text-white mb-2"
            >
              You vs The Game
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm text-gray-300"
            >
              How you stack up against other managers
            </motion.p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="px-6 pb-6 space-y-3">
          <ComparisonMetric
            label="Top Scorer You Missed"
            userValue={data.topScorerMissed?.name || "N/A"}
            compareValue={`${data.topScorerMissed?.points || 0} pts`}
            userLabel="Player"
            compareLabel="Points"
            isHigherBetter={false}
            delay={0.1}
          />

          <ComparisonMetric
            label="Bench Points vs Average"
            userValue={data.benchPointsComparison?.user || 0}
            compareValue={data.benchPointsComparison?.average || 215}
            isHigherBetter={false}
            delay={0.2}
          />

          <ComparisonMetric
            label="Points Lost from Transfers"
            userValue={data.transferHitsComparison?.user || 0}
            compareValue={data.transferHitsComparison?.average || 48}
            isHigherBetter={false}
            delay={0.3}
          />

          <ComparisonMetric
            label="Captain Choices vs Top 10k"
            userValue={data.captainAvgComparison?.user || 0}
            compareValue={data.captainAvgComparison?.top10k || 15.4}
            userLabel="Your Avg"
            compareLabel="Top 10k"
            delay={0.4}
          />

          <ComparisonMetric
            label="Your MVP vs Everyone Else's"
            userValue={data.mostTrustedComparison?.user || "N/A"}
            compareValue={data.mostTrustedComparison?.global || "N/A"}
            userLabel="Your Pick"
            compareLabel="Global Pick"
            delay={0.5}
          />
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={onPrev}
              className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition-colors"
              disabled={!onPrev}
            >
              Previous
            </button>
            <div className="text-xs text-gray-400">Tap to continue</div>
            <button
              onClick={onNext}
              className="px-4 py-2 bg-green-600/80 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              disabled={!onNext}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
