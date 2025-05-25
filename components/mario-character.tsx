"use client"

import { motion } from "framer-motion"

interface MarioCharacterProps {
  isRunning: boolean
  size?: "small" | "medium" | "large"
}

export default function MarioCharacter({ isRunning, size = "medium" }: MarioCharacterProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  }

  return (
    <motion.div
      animate={isRunning ? { x: [0, 20, 0] } : {}}
      transition={isRunning ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Mario body */}
      <div className="w-full h-full relative">
        {/* Hat */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/4 bg-red-600 rounded-t-full"></div>
        {/* Face */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 bg-yellow-200 rounded"></div>
        {/* Mustache */}
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/12 bg-gray-800 rounded"></div>
        {/* Body */}
        <div className="absolute top-1/2 left-1/4 w-1/2 h-1/3 bg-blue-600 rounded"></div>
        {/* Overalls */}
        <div className="absolute top-1/2 left-1/3 w-1/3 h-1/4 bg-red-600 rounded"></div>
        {/* Legs */}
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/4 bg-blue-800 rounded"></div>
        <div className="absolute bottom-0 right-1/4 w-1/4 h-1/4 bg-blue-800 rounded"></div>
      </div>

      {/* Running animation effect */}
      {isRunning && (
        <motion.div
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
          className="absolute -bottom-2 left-0 w-full h-1 bg-white rounded-full blur-sm"
        />
      )}
    </motion.div>
  )
}
