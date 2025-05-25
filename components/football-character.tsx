"use client"

import { motion } from "framer-motion"

interface FootballCharacterProps {
  isMoving: boolean
  variant: "manager" | "player" | "goalkeeper" | "referee"
  size?: "small" | "medium" | "large"
}

export default function FootballCharacter({ isMoving, variant, size = "medium" }: FootballCharacterProps) {
  const sizeClasses = {
    small: "w-8 h-8 md:w-12 md:h-12",
    medium: "w-12 h-12 md:w-16 md:h-16",
    large: "w-16 h-16 md:w-24 md:h-24",
  }

  const getColors = () => {
    switch (variant) {
      case "manager":
        return {
          shirt: "bg-slate-700",
          shorts: "bg-slate-800",
          accent: "bg-emerald-400",
          socks: "bg-slate-900",
        }
      case "player":
        return {
          shirt: "bg-red-600",
          shorts: "bg-white",
          accent: "bg-yellow-400",
          socks: "bg-red-800",
        }
      case "goalkeeper":
        return {
          shirt: "bg-green-500",
          shorts: "bg-black",
          accent: "bg-orange-400",
          socks: "bg-green-700",
        }
      case "referee":
        return {
          shirt: "bg-yellow-400",
          shorts: "bg-black",
          accent: "bg-red-500",
          socks: "bg-yellow-600",
        }
      default:
        return {
          shirt: "bg-blue-600",
          shorts: "bg-white",
          accent: "bg-yellow-400",
          socks: "bg-blue-800",
        }
    }
  }

  const colors = getColors()

  return (
    <motion.div
      animate={isMoving ? { y: [0, -4, 0] } : {}}
      transition={isMoving ? { duration: 0.6, repeat: Number.POSITIVE_INFINITY } : {}}
      className={`${sizeClasses[size]} relative pixel-perfect`}
    >
      {/* Drop shadow */}
      <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black/30 rounded-sm" />

      {/* Main character */}
      <div className="relative w-full h-full bg-slate-900 border-2 border-slate-600 rounded-sm overflow-hidden">
        {/* Head */}
        <div className="absolute top-1 left-1/4 w-1/2 h-1/3 bg-orange-300 border border-slate-700 rounded-sm" />

        {/* Body/Shirt */}
        <div className={`absolute top-1/3 left-1/4 w-1/2 h-1/2 ${colors.shirt} border border-slate-700`} />

        {/* Arms */}
        <div className={`absolute top-1/3 left-1/8 w-1/8 h-1/3 ${colors.shirt} border border-slate-700`} />
        <div className={`absolute top-1/3 right-1/8 w-1/8 h-1/3 ${colors.shirt} border border-slate-700`} />

        {/* Shorts */}
        <div className={`absolute bottom-1/4 left-1/4 w-1/2 h-1/4 ${colors.shorts} border border-slate-700`} />

        {/* Legs/Socks */}
        <div className={`absolute bottom-0 left-1/4 w-1/4 h-1/4 ${colors.socks} border border-slate-700`} />
        <div className={`absolute bottom-0 right-1/4 w-1/4 h-1/4 ${colors.socks} border border-slate-700`} />

        {/* Number/Badge */}
        <div className={`absolute top-1/2 left-1/3 w-1/3 h-1/6 ${colors.accent} border border-slate-700 rounded-sm`} />

        {/* Special accessories */}
        {variant === "manager" && (
          <div className="absolute top-1/8 left-1/4 w-1/2 h-1/8 bg-slate-800 border border-slate-700" />
        )}
        {variant === "goalkeeper" && (
          <div className="absolute top-1/3 left-1/6 w-2/3 h-1/8 bg-black border border-slate-700" />
        )}
        {variant === "referee" && (
          <div className="absolute top-1/2 left-1/2 w-1/8 h-1/8 bg-black border border-slate-700 rounded-full" />
        )}
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
