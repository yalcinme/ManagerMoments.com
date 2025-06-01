"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FifaCardProps {
  children: ReactNode
  title: string
  className?: string
  headerIcon?: ReactNode
}

export default function FifaCard({ children, title, className = "", headerIcon }: FifaCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, rotateX: -20 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      exit={{ scale: 0.7, opacity: 0, rotateX: 20 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 150,
        damping: 15,
      }}
      className={`fifa-card ${className}`}
    >
      {/* FIFA 98 Style Header */}
      <div className="fifa-header px-6 py-4 flex items-center justify-center gap-3">
        {headerIcon && (
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-yellow-300"
          >
            {headerIcon}
          </motion.div>
        )}
        <h2 className="fifa-text-large text-center">{title}</h2>
        {headerIcon && (
          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.5,
              ease: "easeInOut",
            }}
            className="text-yellow-300"
          >
            {headerIcon}
          </motion.div>
        )}
      </div>

      {/* Content Area with FIFA styling */}
      <div className="p-8 relative bg-gradient-to-b from-blue-900/20 to-navy-900/40">{children}</div>

      {/* FIFA 98 Style Footer Stripe */}
      <div className="h-4 bg-gradient-to-r from-yellow-400 via-red-500 via-green-500 to-yellow-400 border-t-4 border-white"></div>
    </motion.div>
  )
}
