"use client"

import { motion } from "framer-motion"

interface FootballIconProps {
  type: "ball" | "goal" | "trophy" | "card" | "gloves" | "target" | "bench" | "chip"
  animated?: boolean
  size?: "small" | "medium" | "large"
}

export default function FootballIcon({ type, animated = true, size = "medium" }: FootballIconProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  const getIcon = () => {
    switch (type) {
      case "ball":
        return (
          <motion.div
            animate={animated ? { rotate: 360 } : {}}
            transition={animated ? { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" } : {}}
            className="w-full h-full bg-white border-2 border-black rounded-full relative"
          >
            {/* Football pattern */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-black rounded-full" />
            <div className="absolute top-1/3 left-1/2 w-px h-1/3 border-l border-black" />
            <div className="absolute top-1/2 left-1/3 w-1/3 h-px border-t border-black" />
          </motion.div>
        )

      case "goal":
        return (
          <div className="w-full h-full relative bg-green-600 border-2 border-white">
            {/* Goal posts */}
            <div className="absolute bottom-0 left-0 w-1 h-full bg-white" />
            <div className="absolute bottom-0 right-0 w-1 h-full bg-white" />
            <div className="absolute top-0 left-0 w-full h-1 bg-white" />
            {/* Net */}
            <motion.div
              animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={animated ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
              className="absolute inset-1 grid grid-cols-3 grid-rows-3 gap-px"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white/30 border border-white/50" />
              ))}
            </motion.div>
          </div>
        )

      case "trophy":
        return (
          <motion.div
            animate={animated ? { y: [-1, 1, -1] } : {}}
            transition={animated ? { duration: 2, repeat: Number.POSITIVE_INFINITY } : {}}
            className="w-full h-full relative"
          >
            {/* Trophy cup */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-yellow-400 border-2 border-yellow-600" />
            {/* Handles */}
            <div className="absolute top-1/3 left-1/8 w-1/8 h-1/4 border-2 border-yellow-600 rounded-l-full bg-transparent" />
            <div className="absolute top-1/3 right-1/8 w-1/8 h-1/4 border-2 border-yellow-600 rounded-r-full bg-transparent" />
            {/* Base */}
            <div className="absolute bottom-1/4 left-1/3 w-1/3 h-1/4 bg-yellow-600 border border-yellow-800" />
            <div className="absolute bottom-0 left-2/5 w-1/5 h-1/4 bg-yellow-600 border border-yellow-800" />
          </motion.div>
        )

      case "card":
        return (
          <motion.div
            animate={animated ? { rotateY: [0, 180, 0] } : {}}
            transition={animated ? { duration: 2, repeat: Number.POSITIVE_INFINITY } : {}}
            className="w-full h-full bg-red-500 border-2 border-red-700 rounded-sm"
          />
        )

      case "gloves":
        return (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-green-500 border-2 border-green-700 rounded-lg" />
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-400 border border-green-600 rounded" />
          </div>
        )

      case "target":
        return (
          <div className="w-full h-full relative bg-white border-2 border-black rounded-full">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 rounded-full" />
            <div className="absolute top-3/8 left-3/8 w-1/4 h-1/4 bg-red-500 rounded-full" />
          </div>
        )

      case "bench":
        return (
          <div className="w-full h-full relative">
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-amber-600 border-2 border-amber-800" />
            <div className="absolute bottom-1/3 left-1/8 w-1/8 h-2/3 bg-amber-700 border border-amber-900" />
            <div className="absolute bottom-1/3 right-1/8 w-1/8 h-2/3 bg-amber-700 border border-amber-900" />
          </div>
        )

      case "chip":
        return (
          <motion.div
            animate={animated ? { scale: [1, 1.2, 1] } : {}}
            transition={animated ? { duration: 1, repeat: Number.POSITIVE_INFINITY } : {}}
            className="w-full h-full bg-purple-500 border-2 border-purple-700 rounded relative"
          >
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-300 border border-purple-600 rounded" />
          </motion.div>
        )

      default:
        return <div className="w-full h-full bg-gray-400 border-2 border-gray-600 rounded" />
    }
  }

  return <div className={`${sizeClasses[size]} pixel-perfect`}>{getIcon()}</div>
}
