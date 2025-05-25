"use client"

import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import MarioCharacter from "../mario-character"
import { Button } from "@/components/ui/button"

interface IntroSceneProps {
  data: FPLData
  onNext: () => void
}

export default function IntroScene({ data, onNext }: IntroSceneProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Clouds */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: [-100, window.innerWidth + 100] }}
            transition={{ duration: 20 + i * 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute top-10 w-20 h-12 bg-white rounded-lg opacity-60"
            style={{ top: `${10 + i * 15}%` }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 pixel-text">WELCOME BACK</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 pixel-text">{data.managerName}!</h2>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        <MarioCharacter isRunning={true} size="large" />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="bg-white bg-opacity-90 rounded-lg p-6 border-4 border-gray-800 max-w-md">
          <h3 className="text-xl font-bold pixel-text text-gray-800 mb-4">SEASON STATS</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 pixel-text">{data.totalPoints}</div>
              <div className="text-sm pixel-text text-gray-600">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 pixel-text">{data.overallRank?.toLocaleString()}</div>
              <div className="text-sm pixel-text text-gray-600">Overall Rank</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <Button
          onClick={onNext}
          className="bg-green-500 hover:bg-green-600 border-4 border-green-700 pixel-text text-white px-8 py-4 text-lg"
        >
          START JOURNEY
        </Button>
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-green-600 to-green-500 border-t-4 border-green-700"></div>
    </div>
  )
}
