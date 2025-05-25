"use client"

import { motion } from "framer-motion"

interface RetroIconProps {
  type: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

export default function RetroIcon({ type, size = "md", animated = true }: RetroIconProps) {
  const sizeClasses = {
    sm: "icon-responsive-sm",
    md: "icon-responsive-md",
    lg: "icon-responsive-lg",
    xl: "icon-responsive-xl",
  }

  const iconSize = sizeClasses[size]

  const renderIcon = () => {
    switch (type) {
      case "ball":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full bg-white rounded-full border-4 border-black relative overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-black rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-black transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-1/2"></div>
            </div>
          </div>
        )

      case "trophy":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full relative">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/6 bg-yellow-600"></div>
              <div className="absolute bottom-1/6 left-1/2 transform -translate-x-1/2 w-1/3 h-1/3 bg-yellow-500"></div>
              <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 w-3/4 h-2/5 bg-yellow-400"></div>
              <div className="absolute bottom-4/5 left-1/8 w-1/4 h-1/4 bg-yellow-500"></div>
              <div className="absolute bottom-4/5 right-1/8 w-1/4 h-1/4 bg-yellow-500"></div>
              <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 w-1/2 h-1/4 bg-yellow-300"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1/6 bg-yellow-200"></div>
            </div>
          </div>
        )

      case "target":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full bg-red-500 rounded-full border-4 border-black relative">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-full border-2 border-black"></div>
              <div className="absolute top-3/8 left-3/8 w-1/4 h-1/4 bg-red-500 rounded-full border border-black"></div>
              <div className="absolute top-7/16 left-7/16 w-1/8 h-1/8 bg-white rounded-full"></div>
            </div>
          </div>
        )

      case "gloves":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full relative">
              <div className="absolute bottom-0 left-1/4 w-1/2 h-3/4 bg-orange-500 border-2 border-black"></div>
              <div className="absolute bottom-1/2 left-1/8 w-1/4 h-1/3 bg-orange-400 border-2 border-black"></div>
              <div className="absolute bottom-1/2 right-1/8 w-1/4 h-1/3 bg-orange-400 border-2 border-black"></div>
              <div className="absolute bottom-2/3 left-0 w-1/6 h-1/4 bg-orange-300 border border-black"></div>
              <div className="absolute bottom-2/3 right-0 w-1/6 h-1/4 bg-orange-300 border border-black"></div>
            </div>
          </div>
        )

      case "brain":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full relative">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500 border-2 border-black rounded-lg"></div>
              <div className="absolute top-1/6 left-1/3 w-1/3 h-1/6 bg-purple-400 border border-black rounded"></div>
              <div className="absolute top-1/2 left-1/6 w-1/6 h-1/4 bg-purple-400 border border-black rounded"></div>
              <div className="absolute top-1/2 right-1/6 w-1/6 h-1/4 bg-purple-400 border border-black rounded"></div>
              <div className="absolute bottom-1/6 left-1/3 w-1/3 h-1/6 bg-purple-400 border border-black rounded"></div>
            </div>
          </div>
        )

      case "league":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full relative">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500 border-2 border-black"></div>
              <div className="absolute top-1/6 left-1/3 w-1/3 h-1/6 bg-blue-400 border border-black"></div>
              <div className="absolute bottom-1/6 left-1/3 w-1/3 h-1/6 bg-blue-400 border border-black"></div>
              <div className="absolute top-1/3 left-1/8 w-1/8 h-1/3 bg-blue-400 border border-black"></div>
              <div className="absolute top-1/3 right-1/8 w-1/8 h-1/3 bg-blue-400 border border-black"></div>
            </div>
          </div>
        )

      case "boost":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full relative">
              <div className="absolute bottom-1/4 left-1/3 w-1/3 h-1/2 bg-pink-500 border-2 border-black"></div>
              <div className="absolute bottom-1/2 left-1/4 w-1/2 h-1/4 bg-pink-400 border border-black"></div>
              <div className="absolute bottom-3/4 left-1/6 w-2/3 h-1/4 bg-pink-300 border border-black"></div>
              <div className="absolute top-0 left-1/8 w-3/4 h-1/6 bg-pink-200 border border-black"></div>
            </div>
          </div>
        )

      case "bench":
        return (
          <div className={`${iconSize} relative pixel-perfect`}>
            <div className="w-full h-full relative">
              <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gray-600 border-2 border-black"></div>
              <div className="absolute bottom-1/4 left-1/8 w-1/8 h-1/2 bg-gray-500 border border-black"></div>
              <div className="absolute bottom-1/4 right-1/8 w-1/8 h-1/2 bg-gray-500 border border-black"></div>
              <div className="absolute bottom-1/2 left-1/4 w-1/2 h-1/6 bg-gray-400 border border-black"></div>
            </div>
          </div>
        )

      default:
        return (
          <div className={`${iconSize} bg-gray-400 border-2 border-black pixel-perfect`}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-gray-600"></div>
            </div>
          </div>
        )
    }
  }

  return (
    <motion.div
      animate={
        animated
          ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: animated ? Number.POSITIVE_INFINITY : 0,
        ease: "easeInOut",
      }}
      className="flex items-center justify-center"
    >
      {renderIcon()}
    </motion.div>
  )
}
