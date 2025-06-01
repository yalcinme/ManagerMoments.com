"use client"

import { motion } from "framer-motion"

interface FIFA98ProgressProps {
  current: number
  total: number
  className?: string
}

export function FIFA98Progress({ current, total, className = "" }: FIFA98ProgressProps) {
  const percentage = (current / total) * 100

  return (
    <div className={`fifa98-progress ${className}`}>
      <motion.div
        className="fifa98-progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="fifa98-progress-shine" />
      </motion.div>

      {/* Progress Dots */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 border-2 ${
              index < current
                ? "bg-green-500 border-green-400"
                : index === current
                  ? "bg-yellow-500 border-yellow-400 fifa98-blink"
                  : "bg-gray-600 border-gray-500"
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
