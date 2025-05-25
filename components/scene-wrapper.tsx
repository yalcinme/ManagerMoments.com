"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SceneWrapperProps {
  children: ReactNode
  scene: "stadium" | "training" | "trophy" | "transfer"
  className?: string
}

export default function SceneWrapper({ children, scene, className = "" }: SceneWrapperProps) {
  const getSceneBackground = () => {
    switch (scene) {
      case "stadium":
        return (
          <div className="absolute inset-0">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-green-200" />

            {/* Stadium tiers */}
            <div className="absolute bottom-1/3 left-0 right-0 h-32 bg-gradient-to-b from-gray-600 to-gray-700 opacity-80" />
            <div className="absolute bottom-1/4 left-0 right-0 h-24 bg-gradient-to-b from-gray-500 to-gray-600 opacity-60" />

            {/* Crowd silhouettes */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2 + Math.random(), repeat: Number.POSITIVE_INFINITY, delay: Math.random() * 2 }}
                className="absolute w-1 h-3 bg-gray-800 rounded-t-full"
                style={{
                  bottom: "33%",
                  left: `${5 + i * 4.5}%`,
                }}
              />
            ))}

            {/* Stadium lights */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }}
                className="absolute w-4 h-4 bg-yellow-300 rounded-full"
                style={{
                  top: "20%",
                  left: `${15 + i * 12}%`,
                  boxShadow: "0 0 15px rgba(255, 255, 0, 0.8)",
                }}
              />
            ))}

            {/* Turf */}
            <div className="absolute bottom-0 left-0 right-0 h-24 stadium-turf border-t-2 border-white/30">
              {/* Pitch markings */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-px h-16 bg-white/60" />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-white/60 rounded-full" />
            </div>
          </div>
        )

      case "training":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-orange-300 to-green-300" />
            <div className="absolute bottom-0 left-0 right-0 h-20 stadium-turf" />
            {/* Training cones */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-20 w-3 h-6 bg-orange-500 border border-orange-700"
                style={{ left: `${20 + i * 15}%` }}
              />
            ))}
          </div>
        )

      case "trophy":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-orange-400 to-red-400" />
            {/* Fireworks */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  top: `${20 + Math.random() * 40}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"][i % 4],
                }}
              />
            ))}
          </div>
        )

      case "transfer":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600 via-blue-600 to-indigo-700" />
            {/* Transfer market buildings */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-gray-700 border-2 border-gray-500"
                style={{
                  left: `${20 + i * 20}%`,
                  width: "40px",
                  height: `${60 + i * 15}px`,
                }}
              >
                <div className="absolute top-2 left-1 w-2 h-2 bg-yellow-300 rounded-sm" />
                <div className="absolute top-2 right-1 w-2 h-2 bg-yellow-300 rounded-sm" />
              </div>
            ))}
          </div>
        )

      default:
        return <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-green-400" />
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {getSceneBackground()}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
