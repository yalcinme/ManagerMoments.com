"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  current: number
  total: number
  onJumpTo: (index: number) => void
  className?: string
}

export default function ProgressIndicator({ current, total, onJumpTo, className }: ProgressIndicatorProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className={className}>
      <div className="modern-card rounded-full px-4 py-2 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {/* Progress bar */}
          <div className="flex-1 h-1 modern-progress">
            <motion.div
              className="h-full modern-progress-fill rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Progress text */}
          <div className="text-white font-mono text-xs whitespace-nowrap">
            {current + 1}/{total}
          </div>
        </div>
      </div>
    </div>
  )
}
