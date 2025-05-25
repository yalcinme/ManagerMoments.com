"use client"

import { motion } from "framer-motion"

interface PixelAvatarProps {
  isMoving: boolean
  teamColor?: string
  size?: "small" | "medium" | "large"
}

export default function PixelAvatar({ isMoving, teamColor = "#667eea", size = "medium" }: PixelAvatarProps) {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  }

  return (
    <motion.div
      animate={isMoving ? { y: [0, -4, 0] } : {}}
      transition={isMoving ? { duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : {}}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Manager figure */}
      <div className="relative w-full h-full">
        {/* Head */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-orange-200 border-2 border-slate-800 rounded-lg" />

        {/* Hair */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/6 bg-amber-800 border-2 border-slate-800 rounded-t-lg" />

        {/* Eyes */}
        <div className="absolute top-1/6 left-1/3 w-1/12 h-1/12 bg-slate-800 rounded-full" />
        <div className="absolute top-1/6 right-1/3 w-1/12 h-1/12 bg-slate-800 rounded-full" />

        {/* Suit jacket */}
        <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-slate-700 border-2 border-slate-800 rounded-sm" />

        {/* Shirt */}
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-white border border-slate-600" />

        {/* Tie */}
        <div
          className="absolute top-1/3 left-5/12 w-1/6 h-1/3 border-2 border-slate-800"
          style={{ backgroundColor: teamColor }}
        />

        {/* Arms */}
        <div className="absolute top-1/3 left-1/8 w-1/8 h-1/3 bg-slate-700 border border-slate-800 rounded-sm" />
        <div className="absolute top-1/3 right-1/8 w-1/8 h-1/3 bg-slate-700 border border-slate-800 rounded-sm" />

        {/* Hands */}
        <div className="absolute top-1/2 left-1/8 w-1/8 h-1/8 bg-orange-200 border border-slate-800 rounded-full" />
        <div className="absolute top-1/2 right-1/8 w-1/8 h-1/8 bg-orange-200 border border-slate-800 rounded-full" />

        {/* Clipboard in hand */}
        <div className="absolute top-1/2 right-0 w-1/6 h-1/4 bg-amber-100 border border-slate-600 rounded-sm" />
        <div className="absolute top-1/2 right-1/24 w-1/8 h-1/6 bg-white border border-slate-400" />

        {/* Trousers */}
        <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/4 bg-slate-800 border border-slate-900" />

        {/* Legs */}
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/4 bg-slate-800 border border-slate-900" />
        <div className="absolute bottom-0 right-1/4 w-1/4 h-1/4 bg-slate-800 border border-slate-900" />

        {/* Shoes */}
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/8 bg-black border border-slate-700 rounded-b-sm" />
        <div className="absolute bottom-0 right-1/4 w-1/4 h-1/8 bg-black border border-slate-700 rounded-b-sm" />

        {/* Whistle around neck */}
        <div className="absolute top-1/4 left-1/3 w-1/3 h-px bg-slate-400" />
        <div className="absolute top-1/4 right-1/3 w-1/12 h-1/12 bg-silver border border-slate-600 rounded-full" />
      </div>

      {/* Movement effect */}
      {isMoving && (
        <motion.div
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 0.4, repeat: Number.POSITIVE_INFINITY }}
          className="absolute -bottom-1 left-0 w-full h-1 bg-slate-400/50 rounded-full blur-sm"
        />
      )}
    </motion.div>
  )
}
