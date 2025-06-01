"use client"

import { motion } from "framer-motion"
import type { Insight } from "@/lib/insights"

interface FIFA98InsightCardProps {
  insight: Insight
  isVisible: boolean
}

export function FIFA98InsightCard({ insight, isVisible }: FIFA98InsightCardProps) {
  const data = insight.getData()

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: isVisible ? 1 : 0 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fifa98-card h-full flex flex-col"
    >
      {/* Header */}
      <div className="fifa98-header p-4 text-center">
        <h1 className="fifa98-title text-white">{insight.title}</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Primary Stat */}
        <div className="fifa98-stat-box gold p-6 text-center">
          <div className="fifa98-title text-black mb-2">{data.mainStat}</div>
          <div className="fifa98-body text-gray-800">{data.mainLabel}</div>
        </div>

        {/* Secondary Stats Grid */}
        {data.secondaryStats && data.secondaryStats.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {data.secondaryStats.map((stat, index) => (
              <div
                key={index}
                className={`fifa98-stat-box ${
                  index % 4 === 0 ? "blue" : index % 4 === 1 ? "green" : index % 4 === 2 ? "red" : "gold"
                } p-4 text-center`}
              >
                <div className="fifa98-subtitle text-white mb-1">{stat.value}</div>
                <div className="fifa98-small text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="fifa98-stat-box p-4">
          <div className="fifa98-body text-white text-center leading-relaxed">{data.subtitle}</div>
        </div>

        {/* Fun Fact */}
        <div className="fifa98-stat-box green p-4">
          <div className="fifa98-small text-white text-center">💡 {data.funFact}</div>
        </div>
      </div>

      {/* Footer Stripe */}
      <div className="h-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
    </motion.div>
  )
}
