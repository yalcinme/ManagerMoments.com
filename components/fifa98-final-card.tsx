"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, RotateCcw } from "lucide-react"
import type { FPLData } from "@/types/fpl"

interface FIFA98FinalCardProps {
  fplData: FPLData
  isVisible: boolean
  onComplete?: () => void
}

export function FIFA98FinalCard({ fplData, isVisible, onComplete }: FIFA98FinalCardProps) {
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
        <h1 className="fifa98-title text-white">SEASON COMPLETE</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Manager Info */}
        <div className="fifa98-stat-box gold p-6 text-center">
          <div className="fifa98-title text-black mb-2">{fplData.managerName}</div>
          <div className="fifa98-body text-gray-800">{fplData.teamName}</div>
        </div>

        {/* Final Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="fifa98-stat-box blue p-4 text-center">
            <div className="fifa98-subtitle text-white mb-1">{fplData.totalPoints}</div>
            <div className="fifa98-small text-gray-200">TOTAL POINTS</div>
          </div>
          <div className="fifa98-stat-box green p-4 text-center">
            <div className="fifa98-subtitle text-white mb-1">#{fplData.overallRank?.toLocaleString()}</div>
            <div className="fifa98-small text-gray-200">FINAL RANK</div>
          </div>
          <div className="fifa98-stat-box red p-4 text-center">
            <div className="fifa98-subtitle text-white mb-1">{fplData.bestGw?.points || "N/A"}</div>
            <div className="fifa98-small text-gray-200">BEST GAMEWEEK</div>
          </div>
          <div className="fifa98-stat-box gold p-4 text-center">
            <div className="fifa98-subtitle text-black mb-1">{fplData.badges?.length || 0}</div>
            <div className="fifa98-small text-gray-800">BADGES EARNED</div>
          </div>
        </div>

        {/* Manager Title */}
        {fplData.managerTitle && (
          <div className="fifa98-stat-box p-4 text-center">
            <div className="fifa98-body text-white">🏆 {fplData.managerTitle}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onComplete}
            className="w-full fifa98-stat-box gold p-4 border-0 hover:scale-105 transition-transform"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="fifa98-body text-black">RETURN TO MENU</span>
          </Button>

          <Button
            onClick={() => window.location.reload()}
            className="w-full fifa98-stat-box blue p-4 border-0 hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            <span className="fifa98-body text-white">PLAY AGAIN</span>
          </Button>
        </div>
      </div>

      {/* Footer Stripe */}
      <div className="h-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
    </motion.div>
  )
}
