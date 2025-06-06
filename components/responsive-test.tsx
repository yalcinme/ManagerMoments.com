"use client"

import { useState, useEffect } from "react"

export function ResponsiveTest() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  const getDeviceType = () => {
    if (screenSize.width < 640) return "Mobile"
    if (screenSize.width < 1024) return "Tablet"
    return "Desktop"
  }

  const getBreakpoint = () => {
    if (screenSize.width < 640) return "sm"
    if (screenSize.width < 768) return "md"
    if (screenSize.width < 1024) return "lg"
    if (screenSize.width < 1280) return "xl"
    return "2xl"
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs z-50 border border-white/20">
      <div className="space-y-1">
        <div>Device: {getDeviceType()}</div>
        <div>
          Size: {screenSize.width} × {screenSize.height}
        </div>
        <div>Breakpoint: {getBreakpoint()}</div>
        <div className="text-green-400">✓ Responsive</div>
      </div>
    </div>
  )
}
