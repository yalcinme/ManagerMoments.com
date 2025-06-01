"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface RetroCardProps {
  children: ReactNode
  title: string
  className?: string
  headerIcon?: ReactNode
}

export default function RetroCard({ children, title, className = "", headerIcon }: RetroCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className={`retro-card-3d crt-effect perspective-3d tilt-3d ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Header Bar */}
      <div className="retro-header px-4 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-800 shadow-inner">
        {headerIcon && (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-yellow-300 glow-3d"
          >
            {headerIcon}
          </motion.div>
        )}
        <h2 className="retro-title text-center text-3d-light">{title}</h2>
        {headerIcon && (
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            className="text-yellow-300 glow-3d"
          >
            {headerIcon}
          </motion.div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 relative bg-gradient-to-br from-slate-800 to-slate-900">{children}</div>

      {/* Footer Decoration */}
      <div className="h-3 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 shadow-inner"></div>
    </motion.div>
  )
}
