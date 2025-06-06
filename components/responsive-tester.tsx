"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Monitor, Smartphone, Tablet, Tv, Check, X, AlertTriangle } from "lucide-react"

interface ScreenSize {
  name: string
  width: number
  height: number
  icon: React.ReactNode
  breakpoint: string
}

const SCREEN_SIZES: ScreenSize[] = [
  { name: "Mobile S", width: 320, height: 568, icon: <Smartphone />, breakpoint: "xs" },
  { name: "Mobile M", width: 375, height: 667, icon: <Smartphone />, breakpoint: "sm" },
  { name: "Mobile L", width: 414, height: 896, icon: <Smartphone />, breakpoint: "sm" },
  { name: "Tablet", width: 768, height: 1024, icon: <Tablet />, breakpoint: "md" },
  { name: "Laptop", width: 1024, height: 768, icon: <Monitor />, breakpoint: "lg" },
  { name: "Desktop", width: 1440, height: 900, icon: <Monitor />, breakpoint: "xl" },
  { name: "4K", width: 2560, height: 1440, icon: <Tv />, breakpoint: "2xl" },
]

interface ResponsiveTesterProps {
  children: React.ReactNode
}

export function ResponsiveTester({ children }: ResponsiveTesterProps) {
  const [currentSize, setCurrentSize] = useState<ScreenSize>(SCREEN_SIZES[5]) // Default to Desktop
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isTestMode, setIsTestMode] = useState(false)

  const runResponsiveTests = () => {
    setIsTestMode(true)
    const results: Record<string, boolean> = {}

    SCREEN_SIZES.forEach((size, index) => {
      setTimeout(() => {
        setCurrentSize(size)

        // Simulate testing
        setTimeout(() => {
          // Check if content fits and is readable
          const isResponsive = testScreenSize(size)
          results[size.name] = isResponsive
          setTestResults({ ...results })

          if (index === SCREEN_SIZES.length - 1) {
            setTimeout(() => setIsTestMode(false), 1000)
          }
        }, 500)
      }, index * 1000)
    })
  }

  const testScreenSize = (size: ScreenSize): boolean => {
    // Simulate responsive testing logic
    const element = document.querySelector(".responsive-test-target")
    if (!element) return true

    const rect = element.getBoundingClientRect()

    // Check if content fits within viewport
    const fitsHorizontally = rect.width <= size.width
    const hasProperSpacing = rect.width > size.width * 0.8 // Not too cramped
    const textIsReadable = size.width >= 320 // Minimum readable width

    return fitsHorizontally && hasProperSpacing && textIsReadable
  }

  return (
    <div className="relative">
      {/* Testing Controls */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5" />
          <span className="font-semibold">Responsive Tester</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm">
            Current: {currentSize.name} ({currentSize.width}×{currentSize.height})
          </div>
          <div className="text-xs text-gray-300">Breakpoint: {currentSize.breakpoint}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {SCREEN_SIZES.map((size) => (
            <button
              key={size.name}
              onClick={() => setCurrentSize(size)}
              className={`flex items-center gap-2 p-2 rounded text-xs transition-colors ${
                currentSize.name === size.name ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <span className="w-4 h-4">{size.icon}</span>
              {size.name}
              {testResults[size.name] !== undefined && (
                <span className="ml-auto">
                  {testResults[size.name] ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-red-400" />
                  )}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={runResponsiveTests}
          disabled={isTestMode}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
        >
          {isTestMode ? "Testing..." : "Run Tests"}
        </button>

        {Object.keys(testResults).length > 0 && (
          <div className="mt-4 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>Test Results</span>
            </div>
            <div className="space-y-1">
              {Object.entries(testResults).map(([size, passed]) => (
                <div key={size} className="flex justify-between">
                  <span>{size}</span>
                  <span className={passed ? "text-green-400" : "text-red-400"}>{passed ? "PASS" : "FAIL"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Responsive Container */}
      <div
        className="responsive-test-target transition-all duration-500 mx-auto border-2 border-gray-400 bg-white overflow-hidden"
        style={{
          width: `${currentSize.width}px`,
          height: `${currentSize.height}px`,
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      >
        <div className="w-full h-full overflow-auto">{children}</div>
      </div>

      {/* Size Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm"
      >
        <div className="flex items-center gap-2">
          {currentSize.icon}
          <span>{currentSize.name}</span>
          <span className="text-gray-300">
            {currentSize.width}×{currentSize.height}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
