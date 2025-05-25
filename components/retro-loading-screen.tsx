"use client"

import { motion } from "framer-motion"
import RetroAvatar from "./retro-avatar"

export default function RetroLoadingScreen() {
  return (
    <div className="h-screen w-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Stadium Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/stadium-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm aspect-[3/5] flex flex-col justify-center items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          {/* Title */}
          <div className="pixel-card p-4 mb-8 bg-white bg-opacity-95">
            <h2 className="font-display text-sm text-contrast-dark tracking-wide mb-2">LOADING SEASON...</h2>
            <div className="font-body text-xs text-contrast-dark tracking-wide">CONNECTING TO PREMIER LEAGUE</div>
          </div>

          {/* Character */}
          <div className="mb-8">
            <RetroAvatar isMoving={true} kitColor="#ef4444" size="large" role="manager" />
          </div>

          {/* Loading Animation */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="flex justify-center space-x-2 mb-4"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-white border border-black"
              />
            ))}
          </motion.div>

          <div className="pixel-card p-2 bg-white bg-opacity-95">
            <p className="font-body text-xs text-contrast-dark tracking-wide">PLEASE WAIT...</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
