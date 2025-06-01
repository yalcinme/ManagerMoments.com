"use client"

import { motion } from "framer-motion"

interface MonzoProgressProps {
  current: number
  total: number
  isPaused?: boolean
}

export default function MonzoProgress({ current, total, isPaused = false }: MonzoProgressProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="absolute top-0 left-0 right-0 z-40 panel-3d backdrop-blur-sm">
      <div className="h-1.5 sm:h-2 progress-3d rounded-full mx-2 my-2">
        <motion.div
          className={`h-full progress-fill-3d rounded-full transition-all duration-300 ${
            isPaused ? "opacity-50" : "opacity-100"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="px-2 sm:px-4 py-1 sm:py-2 flex justify-between items-center">
        <div className="text-xs font-medium text-gray-800 text-3d">
          {current + 1} of {total}
        </div>
        <div className="text-xs text-gray-600 text-3d hidden sm:block">{isPaused ? "Paused" : "Tap to continue →"}</div>
        <div className="text-xs text-gray-600 text-3d sm:hidden">{isPaused ? "⏸️" : "→"}</div>
      </div>
    </div>
  )
}
