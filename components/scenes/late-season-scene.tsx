"use client"

import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import { Button } from "@/components/ui/button"

interface LateSeasonSceneProps {
  data: FPLData
  onNext: () => void
}

export default function LateSeasonScene({ data, onNext }: LateSeasonSceneProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 pixel-text">THE FINAL STRETCH</h2>
        <p className="text-lg text-white pixel-text opacity-80">How did you finish the season?</p>
      </motion.div>

      {/* Rank progression visualization */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2 }}
        className="w-full max-w-md mb-8"
      >
        <div className="bg-white bg-opacity-90 rounded-lg p-6 border-4 border-gray-800">
          <h3 className="text-lg font-bold pixel-text text-gray-800 mb-4 text-center">RANK JOURNEY</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="pixel-text text-gray-600">Highest:</span>
              <span className="pixel-text font-bold text-green-600">{data.bestRank?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="pixel-text text-gray-600">Final:</span>
              <span className="pixel-text font-bold text-blue-600">{data.overallRank?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="pixel-text text-gray-600">Total Points:</span>
              <span className="pixel-text font-bold text-purple-600">{data.totalPoints}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Season highlights */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl w-full"
      >
        <div className="bg-green-500 rounded-lg p-4 border-4 border-green-700 text-center">
          <div className="text-2xl font-bold pixel-text text-white">{data.greenArrows}</div>
          <div className="text-sm pixel-text text-green-200">Green Arrows</div>
        </div>

        <div className="bg-red-500 rounded-lg p-4 border-4 border-red-700 text-center">
          <div className="text-2xl font-bold pixel-text text-white">{data.redArrows}</div>
          <div className="text-sm pixel-text text-red-200">Red Arrows</div>
        </div>

        <div className="bg-yellow-500 rounded-lg p-4 border-4 border-yellow-700 text-center">
          <div className="text-2xl font-bold pixel-text text-yellow-800">{data.totalTransfers}</div>
          <div className="text-sm pixel-text text-yellow-800">Total Transfers</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <Button
          onClick={onNext}
          className="bg-yellow-500 hover:bg-yellow-600 border-4 border-yellow-700 pixel-text text-yellow-800 px-8 py-4 text-lg font-bold"
        >
          SEE FINAL RESULTS
        </Button>
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-green-600 to-green-500 border-t-4 border-green-700"></div>
    </div>
  )
}
