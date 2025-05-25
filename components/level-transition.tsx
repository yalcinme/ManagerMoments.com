"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

interface LevelTransitionProps {
  level: {
    name: string
    subtitle: string
  }
  onComplete: () => void
}

export default function LevelTransition({ level, onComplete }: LevelTransitionProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900"
      />

      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Level text */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center z-10"
      >
        <motion.h1
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          className="text-6xl md:text-8xl font-bold text-white pixel-text mb-4"
        >
          {level.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-yellow-300 pixel-text"
        >
          {level.subtitle}
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "linear" }}
        className="absolute bottom-8 left-8 right-8 h-2 bg-yellow-400 rounded-full"
      />
    </div>
  )
}
