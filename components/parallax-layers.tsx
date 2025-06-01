"use client"

import type React from "react"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"

interface ParallaxLayersProps {
  backgroundColor?: string
  children: React.ReactNode
  className?: string
}

export default function ParallaxLayers({
  backgroundColor = "bg-green-600",
  children,
  className = "",
}: ParallaxLayersProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Different parallax speeds for layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const midgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"])

  // Smooth spring animations
  const backgroundYSpring = useSpring(backgroundY, { stiffness: 100, damping: 30 })
  const midgroundYSpring = useSpring(midgroundY, { stiffness: 150, damping: 30 })
  const foregroundYSpring = useSpring(foregroundY, { stiffness: 200, damping: 30 })

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background layer - slowest movement */}
      <motion.div
        className={`absolute inset-0 ${backgroundColor}`}
        style={{
          y: backgroundYSpring,
          scale: 1.2, // Prevent gaps during movement
        }}
      />

      {/* Midground atmospheric layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: midgroundYSpring,
          background: `radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)`,
        }}
      />

      {/* Foreground subtle overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: foregroundYSpring,
          background: `linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)`,
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
