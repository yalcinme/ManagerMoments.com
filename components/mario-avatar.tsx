"use client"

import { motion } from "framer-motion"

interface MarioAvatarProps {
  isRunning: boolean
  size?: "small" | "medium" | "large"
}

export default function MarioAvatar({ isRunning, size = "medium" }: MarioAvatarProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  }

  return (
    <motion.div
      animate={isRunning ? { y: [0, -2, 0] } : {}}
      transition={isRunning ? { duration: 0.3, repeat: Number.POSITIVE_INFINITY } : {}}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Mario character in business suit style */}
      <div className="w-full h-full relative">
        {/* Hat */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/4 bg-gray-800 rounded-t-lg"></div>
        {/* Face */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 bg-yellow-200 rounded"></div>
        {/* Tie */}
        <div className="absolute top-1/2 left-5/12 w-1/6 h-1/3 bg-red-600"></div>
        {/* Suit body */}
        <div className="absolute top-1/2 left-1/4 w-1/2 h-1/3 bg-gray-700 rounded"></div>
        {/* Arms */}
        <div className="absolute top-1/2 left-1/6 w-1/6 h-1/4 bg-gray-700 rounded"></div>
        <div className="absolute top-1/2 right-1/6 w-1/6 h-1/4 bg-gray-700 rounded"></div>
        {/* Legs */}
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/4 bg-gray-800 rounded"></div>
        <div className="absolute bottom-0 right-1/4 w-1/4 h-1/4 bg-gray-800 rounded"></div>
      </div>

      {/* Running dust effect */}
      {isRunning && (
        <motion.div
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
          className="absolute -bottom-1 left-0 w-full h-1 bg-white rounded-full blur-sm opacity-50"
        />
      )}
    </motion.div>
  )
}
