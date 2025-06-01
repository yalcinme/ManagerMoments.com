"use client"

import { motion } from "framer-motion"
import PixelAvatar from "./pixel-avatar"
import SceneWrapper from "./scene-wrapper"

export default function LoadingScreen() {
    return (
      <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-[#0E0F1B] via-[#1B1D2B] to-[#0E0F1B]">
      <SceneWrapper scene="stadium">
        <div className="h-full w-full flex items-center justify-center max-w-4xl mx-auto p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h2 className="text-4xl font-display text-gradient mb-8">Loading Your Season...</h2>

            <div className="mb-8 float-animation">
              <PixelAvatar isMoving={true} teamColor="#667eea" size="large" />
            </div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="flex justify-center space-x-2 mb-4"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-3 h-3 bg-gradient-to-r from-[#45A1FF] to-[#00C2A8] rounded-full"
                />
              ))}
            </motion.div>

            <p className="text-white font-body text-base">Fetching your FPL data from the Premier League servers...</p>
          </motion.div>
        </div>
      </SceneWrapper>
    </div>
  )
}
