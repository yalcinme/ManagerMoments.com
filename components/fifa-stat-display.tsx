"use client"

import { motion } from "framer-motion"
import { ArrowUp, ArrowDown } from "lucide-react"
import type { ReactNode } from "react"

interface FifaStatDisplayProps {
  value: string
  label: string
  color?: "blue" | "green" | "red" | "yellow"
  size?: "small" | "medium" | "large"
  icon?: ReactNode
  animated?: boolean
  trend?: "up" | "down" | "neutral"
}

export default function FifaStatDisplay({
  value,
  label,
  color = "blue",
  size = "medium",
  icon,
  animated = false,
  trend,
}: FifaStatDisplayProps) {
  // Color classes based on the color prop
  const colorClasses = {
    blue: "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] border-[#93c5fd]",
    green: "bg-gradient-to-br from-[#10b981] to-[#059669] border-[#6ee7b7]",
    red: "bg-gradient-to-br from-[#ef4444] to-[#dc2626] border-[#fca5a5]",
    yellow: "bg-gradient-to-br from-[#f59e0b] to-[#d97706] border-[#fcd34d]",
  }

  // Size classes based on the size prop
  const sizeClasses = {
    small: "p-3",
    medium: "p-4",
    large: "p-6",
  }

  // Font size classes based on the size prop
  const fontSizeClasses = {
    small: "text-lg md:text-xl",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl",
  }

  return (
    <motion.div
      className={`fifa-stat-panel ${colorClasses[color]} ${sizeClasses[size]} text-center rounded-lg border relative overflow-hidden`}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

      {/* Value with optional animation */}
      <motion.div
        className={`${fontSizeClasses[size]} font-bold text-white mb-1 flex items-center justify-center`}
        animate={
          animated
            ? {
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0 rgba(255,255,255,0)",
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 0 rgba(255,255,255,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: animated ? Number.POSITIVE_INFINITY : 0 }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span className="fifa-text-truncate">{value}</span>

        {trend === "up" && (
          <span className="ml-2" title="Positive trend from previous period">
            <ArrowUp size={16} className="text-[var(--green-positive)]" />
            <span className="sr-only">Positive trend</span>
          </span>
        )}

        {trend === "down" && (
          <span className="ml-2" title="Negative trend from previous period">
            <ArrowDown size={16} className="text-[var(--red-negative)]" />
            <span className="sr-only">Negative trend</span>
          </span>
        )}
      </motion.div>

      {/* Label */}
      <div className="text-xs md:text-sm text-white opacity-90 uppercase tracking-wider fifa-text-truncate">
        {label}
      </div>
    </motion.div>
  )
}
