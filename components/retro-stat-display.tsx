"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface RetroStatDisplayProps {
  value: string | number
  label: string
  icon?: ReactNode
  color?: "green" | "blue" | "red" | "yellow"
  size?: "small" | "medium" | "large"
  animated?: boolean
}

export default function RetroStatDisplay({
  value,
  label,
  icon,
  color = "green",
  size = "medium",
  animated = true,
}: RetroStatDisplayProps) {
  const colorClasses = {
    green: "bg-gradient-to-br from-green-500 to-green-700 border-green-300",
    blue: "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-300",
    red: "bg-gradient-to-br from-red-500 to-red-700 border-red-300",
    yellow: "bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-300",
  }

  const sizeClasses = {
    small: "px-3 py-2",
    medium: "px-4 py-3",
    large: "px-6 py-4",
  }

  const textSizes = {
    small: { value: "retro-body", label: "retro-caption" },
    medium: { value: "retro-subtitle", label: "retro-body" },
    large: { value: "retro-title", label: "retro-subtitle" },
  }

  return (
    <motion.div
      initial={{ scale: 0, rotateY: -90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        delay: animated ? Math.random() * 0.5 : 0,
      }}
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        rotateX: -2,
        transition: { duration: 0.1 },
      }}
      className={`
        stat-3d ${sizeClasses[size]} ${colorClasses[color]}
        text-center relative overflow-hidden perspective-3d
        rounded-lg transform-gpu
      `}
    >
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-10"
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
          ease: "linear",
        }}
      />

      {/* Icon */}
      {icon && (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-yellow-300 mb-2 flex justify-center glow-3d"
        >
          {icon}
        </motion.div>
      )}

      {/* Value */}
      <motion.div
        animate={
          animated
            ? {
                textShadow: [
                  "1px 1px 2px rgba(0,0,0,0.5)",
                  "2px 2px 4px rgba(0,0,0,0.7), 0 0 10px currentColor",
                  "1px 1px 2px rgba(0,0,0,0.5)",
                ],
              }
            : {}
        }
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        className={`${textSizes[size].value} font-bold text-white mb-1 text-3d-light`}
      >
        {value}
      </motion.div>

      {/* Label */}
      <div className={`${textSizes[size].label} text-gray-200 uppercase tracking-wider text-3d-light`}>{label}</div>
    </motion.div>
  )
}
