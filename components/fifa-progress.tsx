"use client"

import { motion } from "framer-motion"

interface FifaProgressProps {
  current: number
  total: number
  className?: string
}

export default function FifaProgress({ current, total, className = "" }: FifaProgressProps) {
  const progress = ((current + 1) / total) * 100
  const dots = Array.from({ length: total }, (_, i) => i)

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* FIFA 98 Style Progress Bar */}
      <div className="flex-1 fifa-progress-container">
        <motion.div
          className="fifa-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Pixel Dots like FIFA 98 */}
      <div className="flex gap-2">
        {dots.map((dot) => (
          <motion.div
            key={dot}
            className={`fifa-pixel-dot ${dot <= current ? "active" : "inactive"}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: dot * 0.1,
              type: "spring",
              stiffness: 200,
            }}
          />
        ))}
      </div>

      {/* FIFA Style Score Display */}
      <div className="fifa-stat-panel yellow px-4 py-2 min-w-[100px] text-center">
        <span className="fifa-text-medium">
          {current + 1}/{total}
        </span>
      </div>
    </div>
  )
}
