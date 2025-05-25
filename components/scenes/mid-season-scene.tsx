"use client"

import { motion } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import { Button } from "@/components/ui/button"

interface MidSeasonSceneProps {
  data: FPLData
  onNext: () => void
}

export default function MidSeasonScene({ data, onNext }: MidSeasonSceneProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 pixel-text">MID SEASON MADNESS</h2>
        <p className="text-lg text-white pixel-text opacity-80">The heart of your FPL campaign</p>
      </motion.div>

      {/* Fireworks animation for best gameweek */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-400 rounded-full w-32 h-32 flex items-center justify-center border-4 border-yellow-600 relative"
        >
          <div className="text-center">
            <div className="text-2xl font-bold pixel-text text-yellow-800">GW{data.bestGw?.gameweek}</div>
            <div className="text-lg font-bold pixel-text text-yellow-800">{data.bestGw?.points}pts</div>
          </div>

          {/* Firework particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                y: Math.sin((i * 45 * Math.PI) / 180) * 60,
              }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute w-3 h-3 bg-red-500 rounded-full"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-4"
        >
          <h3 className="text-xl font-bold text-white pixel-text">YOUR BEST GAMEWEEK!</h3>
        </motion.div>
      </div>

      {/* Chips used */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="grid grid-cols-2 gap-4 mb-8 max-w-md w-full"
      >
        {data.chipsUsed.map((chip, index) => (
          <motion.div
            key={chip.name}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 + index * 0.2 }}
            className="bg-purple-500 rounded-lg p-4 border-4 border-purple-700 text-center"
          >
            <div className="text-lg font-bold pixel-text text-white">{chip.name}</div>
            <div className="text-sm pixel-text text-purple-200">GW{chip.gameweek}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
        <Button
          onClick={onNext}
          className="bg-purple-500 hover:bg-purple-600 border-4 border-purple-700 pixel-text text-white px-8 py-4 text-lg"
        >
          CONTINUE
        </Button>
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-green-600 to-green-500 border-t-4 border-green-700"></div>
    </div>
  )
}
