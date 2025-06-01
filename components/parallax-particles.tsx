"use client"

import { motion } from "framer-motion"
import { useParallax } from "@/hooks/use-parallax"

interface ParallaxParticlesProps {
  count?: number
  intensity?: number
  className?: string
}

export default function ParallaxParticles({ count = 12, intensity = 0.8, className = "" }: ParallaxParticlesProps) {
  const { parallaxX, parallaxY, isClient } = useParallax({
    intensity,
    enableMouse: true,
    enableScroll: true,
  })

  if (!isClient) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 3 + 1
        const opacity = Math.random() * 0.4 + 0.1
        const speed = Math.random() * 0.5 + 0.5

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity,
              x: parallaxX,
              y: parallaxY,
            }}
            animate={{
              opacity: [opacity * 0.5, opacity, opacity * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}
