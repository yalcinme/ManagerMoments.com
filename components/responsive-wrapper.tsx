"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveWrapper({ children, className = "" }: ResponsiveWrapperProps) {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth)

    // Update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Determine responsive class based on window width
  const getResponsiveClass = () => {
    if (windowWidth === 0) return "" // Initial state before client-side hydration

    if (windowWidth <= 480) return "fifa-compact-mobile"
    if (windowWidth <= 768) return "fifa-mobile"
    if (windowWidth <= 1024) return "fifa-tablet"
    return "fifa-desktop"
  }

  return <div className={`responsive-container ${getResponsiveClass()} ${className}`}>{children}</div>
}
