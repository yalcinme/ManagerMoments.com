"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface OptimizedLayoutProps {
  children: React.ReactNode
  className?: string
}

export function OptimizedLayout({ children, className = "" }: OptimizedLayoutProps) {
  const [screenSize, setScreenSize] = useState<string>("desktop")
  const [orientation, setOrientation] = useState<string>("landscape")

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Determine screen size category
      if (width < 480) setScreenSize("mobile-xs")
      else if (width < 768) setScreenSize("mobile")
      else if (width < 1024) setScreenSize("tablet")
      else if (width < 1440) setScreenSize("desktop")
      else setScreenSize("desktop-xl")

      // Determine orientation
      setOrientation(width > height ? "landscape" : "portrait")
    }

    updateScreenInfo()
    window.addEventListener("resize", updateScreenInfo)
    window.addEventListener("orientationchange", updateScreenInfo)

    return () => {
      window.removeEventListener("resize", updateScreenInfo)
      window.removeEventListener("orientationchange", updateScreenInfo)
    }
  }, [])

  const getOptimizedClasses = () => {
    const baseClasses = "w-full min-h-screen"
    const sizeClasses = {
      "mobile-xs": "text-sm p-2",
      mobile: "text-base p-3",
      tablet: "text-lg p-4",
      desktop: "text-xl p-6",
      "desktop-xl": "text-2xl p-8",
    }

    return `${baseClasses} ${sizeClasses[screenSize as keyof typeof sizeClasses]} ${className}`
  }

  return (
    <motion.div
      className={getOptimizedClasses()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      data-screen-size={screenSize}
      data-orientation={orientation}
    >
      {children}
    </motion.div>
  )
}
