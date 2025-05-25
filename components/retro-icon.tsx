"use client"

import { motion } from "framer-motion"

interface RetroIconProps {
  type: "ball" | "target" | "gloves" | "up-arrow" | "down-arrow" | "trophy" | "brain" | "league" | "boost" | "bench"
  size?: "small" | "medium" | "large" | "xl"
  animated?: boolean
}

export default function RetroIcon({ type, size = "medium", animated = true }: RetroIconProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const getIcon = () => {
    const baseClasses = `${sizeClasses[size]} pixel-perfect`

    switch (type) {
      case "ball":
        return (
          <motion.div
            animate={animated ? { rotate: 360 } : {}}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className={`${baseClasses} bg-white rounded-full border-4 border-black relative`}
            style={{
              background: "radial-gradient(circle at 30% 30%, #ffffff, #e5e5e5)",
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.5)",
            }}
          >
            <div className="absolute inset-2 border-2 border-black rounded-full opacity-30"></div>
          </motion.div>
        )
      case "target":
        return (
          <motion.div
            animate={animated ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-red-500 rounded-full border-4 border-black relative`}
            style={{
              background: "radial-gradient(circle, #ef4444, #dc2626)",
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.6)",
            }}
          >
            <div className="absolute inset-2 border-2 border-white rounded-full"></div>
            <div className="absolute inset-4 bg-white rounded-full"></div>
          </motion.div>
        )
      case "trophy":
        return (
          <motion.div
            animate={animated ? { y: [-2, 2, -2] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} relative`}
          >
            <div
              className="w-full h-full bg-gradient-to-b from-yellow-300 to-yellow-600 border-4 border-black relative"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 90% 70%, 70% 70%, 70% 100%, 30% 100%, 30% 70%, 10% 70%)",
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
              }}
            >
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-500 rounded"></div>
            </div>
          </motion.div>
        )
      case "up-arrow":
        return (
          <motion.div
            animate={animated ? { y: [-3, 0, -3] } : {}}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} relative`}
          >
            <div
              className="w-full h-full bg-gradient-to-t from-green-400 to-green-600 border-4 border-black"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
              }}
            ></div>
          </motion.div>
        )
      case "down-arrow":
        return (
          <motion.div
            animate={animated ? { y: [3, 0, 3] } : {}}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} relative`}
          >
            <div
              className="w-full h-full bg-gradient-to-b from-red-400 to-red-600 border-4 border-black"
              style={{
                clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.6)",
              }}
            ></div>
          </motion.div>
        )
      case "gloves":
        return (
          <motion.div
            animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-black rounded relative`}
            style={{
              boxShadow: "0 0 15px rgba(251, 146, 60, 0.6)",
            }}
          >
            <div className="absolute inset-2 bg-orange-300 rounded border border-black"></div>
          </motion.div>
        )
      case "brain":
        return (
          <motion.div
            animate={animated ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-black rounded-full relative`}
            style={{
              boxShadow: "0 0 15px rgba(147, 51, 234, 0.6)",
            }}
          >
            <div className="absolute inset-2 border border-white rounded-full opacity-50"></div>
          </motion.div>
        )
      case "league":
        return (
          <motion.div
            animate={animated ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-black rounded relative`}
            style={{
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
            }}
          >
            <div className="absolute inset-2 bg-blue-300 rounded border border-black"></div>
          </motion.div>
        )
      case "boost":
        return (
          <motion.div
            animate={animated ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-gradient-to-br from-pink-400 to-pink-600 border-4 border-black rounded relative`}
            style={{
              boxShadow: "0 0 15px rgba(236, 72, 153, 0.6)",
            }}
          >
            <div className="absolute inset-2 bg-pink-300 rounded border border-black"></div>
          </motion.div>
        )
      case "bench":
        return (
          <motion.div
            animate={animated ? { y: [-1, 1, -1] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600 border-4 border-black rounded relative`}
            style={{
              boxShadow: "0 0 15px rgba(107, 114, 128, 0.6)",
            }}
          >
            <div className="absolute inset-2 bg-gray-300 rounded border border-black"></div>
          </motion.div>
        )
      default:
        return (
          <motion.div
            animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`${baseClasses} bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-black rounded`}
            style={{
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
            }}
          ></motion.div>
        )
    }
  }

  return getIcon()
}
