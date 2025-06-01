"use client"

import { motion } from "framer-motion"

interface RetroProgressProps {
  current: number
  total: number
  className?: string
}

export default function RetroProgress({ current, total, className = "" }: RetroProgressProps) {
  const progress = ((current + 1) / total) * 100
  const dots = Array.from({ length: total }, (_, i) => i)

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 3D Progress Bar */}
      <div className="flex-1 progress-3d rounded-full h-4 overflow-hidden">
        <motion.div
          className="progress-fill-3d h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* 3D Pixel Dots */}
      <div className="flex gap-2">
        {dots.map((dot) => (
          <motion.div
            key={dot}
            className={`w-4 h-4 border-2 rounded-sm transform-gpu ${
              dot <= current
                ? "bg-gradient-to-br from-green-400 to-green-600 border-yellow-400 shadow-lg glow-3d"
                : "bg-gradient-to-br from-gray-600 to-gray-800 border-gray-400"
            }`}
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            whileHover={{
              scale: 1.2,
              rotateY: 15,
              transition: { duration: 0.2 },
            }}
            transition={{ delay: dot * 0.1, type: "spring", stiffness: 200 }}
            style={{
              imageRendering: "pixelated",
              boxShadow:
                dot <= current
                  ? "2px 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.2)"
                  : "1px 1px 2px rgba(0,0,0,0.2), inset 1px 1px 1px rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      {/* 3D Score Display */}
      <div className="stat-3d px-4 py-2 min-w-[80px] text-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900">
        <span className="retro-body text-3d-light">
          {current + 1}/{total}
        </span>
      </div>
    </div>
  )
}
