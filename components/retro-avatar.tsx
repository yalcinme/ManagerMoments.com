"use client"

import { motion } from "framer-motion"

interface RetroAvatarProps {
  isMoving: boolean
  kitColor?: string
  size?: "small" | "medium" | "large"
  role?: "manager" | "player"
}

export default function RetroAvatar({
  isMoving,
  kitColor = "#ef4444",
  size = "medium",
  role = "manager",
}: RetroAvatarProps) {
  const sizeClasses = {
    small: "w-12 h-16",
    medium: "w-16 h-20",
    large: "w-24 h-32",
  }

  const animationClass = isMoving ? "bounce-pixel" : ""

  return (
    <motion.div
      className={`${sizeClasses[size]} ${animationClass} pixel-perfect relative`}
      animate={isMoving ? { x: [0, 2, 0, -2, 0] } : {}}
      transition={isMoving ? { duration: 0.8, repeat: Number.POSITIVE_INFINITY } : {}}
    >
      <svg viewBox="0 0 32 40" className="w-full h-full">
        {/* Head */}
        <rect x="12" y="2" width="8" height="8" fill="#fbbf24" stroke="#000" strokeWidth="1" />

        {/* Hair */}
        <rect x="10" y="0" width="12" height="4" fill="#92400e" stroke="#000" strokeWidth="1" />

        {/* Eyes */}
        <rect x="13" y="4" width="2" height="2" fill="#000" />
        <rect x="17" y="4" width="2" height="2" fill="#000" />

        {role === "manager" ? (
          <>
            {/* Suit */}
            <rect x="10" y="10" width="12" height="16" fill="#374151" stroke="#000" strokeWidth="1" />
            {/* Shirt */}
            <rect x="12" y="12" width="8" height="8" fill="white" stroke="#000" strokeWidth="1" />
            {/* Tie */}
            <rect x="14" y="12" width="4" height="12" fill={kitColor} stroke="#000" strokeWidth="1" />
            {/* Clipboard */}
            <rect x="24" y="14" width="6" height="8" fill="#d1d5db" stroke="#000" strokeWidth="1" />
            <rect x="25" y="15" width="4" height="6" fill="white" />
          </>
        ) : (
          <>
            {/* Kit */}
            <rect x="10" y="10" width="12" height="12" fill={kitColor} stroke="#000" strokeWidth="1" />
            {/* Shorts */}
            <rect x="11" y="22" width="10" height="6" fill="white" stroke="#000" strokeWidth="1" />
            {/* Number */}
            <rect x="14" y="14" width="4" height="4" fill="white" stroke="#000" strokeWidth="1" />
            <rect x="15" y="15" width="2" height="2" fill="#000" />
          </>
        )}

        {/* Arms */}
        <rect
          x="6"
          y="12"
          width="4"
          height="8"
          fill={role === "manager" ? "#374151" : kitColor}
          stroke="#000"
          strokeWidth="1"
        />
        <rect
          x="22"
          y="12"
          width="4"
          height="8"
          fill={role === "manager" ? "#374151" : kitColor}
          stroke="#000"
          strokeWidth="1"
        />

        {/* Legs */}
        <rect
          x="11"
          y="28"
          width="4"
          height="8"
          fill={role === "manager" ? "#1f2937" : "#000"}
          stroke="#000"
          strokeWidth="1"
        />
        <rect
          x="17"
          y="28"
          width="4"
          height="8"
          fill={role === "manager" ? "#1f2937" : "#000"}
          stroke="#000"
          strokeWidth="1"
        />

        {/* Feet */}
        <rect x="10" y="36" width="6" height="4" fill="#000" />
        <rect x="16" y="36" width="6" height="4" fill="#000" />

        {/* Movement dust */}
        {isMoving && (
          <>
            <rect x="8" y="38" width="2" height="2" fill="#d1d5db" opacity="0.6" />
            <rect x="22" y="38" width="2" height="2" fill="#d1d5db" opacity="0.6" />
          </>
        )}
      </svg>
    </motion.div>
  )
}
