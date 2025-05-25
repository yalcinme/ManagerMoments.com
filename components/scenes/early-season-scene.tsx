"use client"

import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import MarioCharacter from "../mario-character"
import { Button } from "@/components/ui/button"

interface EarlySeasonSceneProps {
  data: FPLData
  onNext: () => void
}

export default function EarlySeasonScene({ data, onNext }: EarlySeasonSceneProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 pixel-text">EARLY SEASON</h2>
        <p className="text-lg text-white pixel-text opacity-80">How did you start your FPL journey?</p>
      </motion.div>

      {/* Mario running across screen */}
      <div className="relative w-full h-32 mb-8 overflow-hidden">
        <motion.div
          animate={{ x: [-100, window.innerWidth] }}
          transition={{ duration: 3, ease: "linear" }}
          className="absolute top-1/2 transform -translate-y-1/2"
        >
          <MarioCharacter isRunning={true} />
        </motion.div>

        {/* Question blocks */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [-5, 0] }}
            transition={{ delay: i * 0.6 + 1, duration: 0.2 }}
            className="absolute top-4 w-12 h-12 bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center"
            style={{ left: `${20 + i * 15}%` }}
          >
            <span className="text-yellow-800 font-bold pixel-text">?</span>
          </motion.div>
        ))}

        {/* Coins appearing */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: -20, opacity: [0, 1, 0] }}
            transition={{ delay: i * 0.6 + 1.2, duration: 1 }}
            className="absolute top-4 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600"
            style={{ left: `${23 + i * 15}%` }}
          />
        ))}
      </div>

      {/* Stats display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl w-full"
      >
        <div className="bg-white bg-opacity-90 rounded-lg p-6 border-4 border-gray-800 text-center">
          <h3 className="text-xl font-bold pixel-text text-gray-800 mb-2">BEST EARLY GW</h3>
          <div className="text-3xl font-bold text-green-600 pixel-text">GW{data.bestEarlyGw?.gameweek}</div>
          <div className="text-lg pixel-text text-gray-600">{data.bestEarlyGw?.points} points</div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-lg p-6 border-4 border-gray-800 text-center">
          <h3 className="text-xl font-bold pixel-text text-gray-800 mb-2">EARLY TRANSFERS</h3>
          <div className="text-3xl font-bold text-blue-600 pixel-text">{data.earlyTransfers}</div>
          <div className="text-lg pixel-text text-gray-600">First 10 GWs</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
        <Button
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 border-4 border-blue-700 pixel-text text-white px-8 py-4 text-lg"
        >
          CONTINUE
        </Button>
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-green-600 to-green-500 border-t-4 border-green-700"></div>
    </div>
  )
}
