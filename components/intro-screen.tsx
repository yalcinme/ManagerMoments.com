"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Loader2, Info, AlertCircle } from "lucide-react"

interface IntroScreenProps {
  onStart: (id: string) => void
  error: string | null
  loading: boolean
  managerId: string
  setManagerId: (id: string) => void
}

export function IntroScreen({ onStart, error, loading, managerId, setManagerId }: IntroScreenProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onStart(inputValue.trim())
    }
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-600 via-green-700 to-green-800"
      style={{
        backgroundImage: "url('/images/homepage-podium.png'), url('/images/homepage-podium-fallback.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-4xl mx-auto w-full"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 sm:mb-8 lg:mb-12 text-center"
        >
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
            Your FPL Manager Moments
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl lg:text-3xl xl:text-4xl mb-8 sm:mb-12 lg:mb-16 text-center text-white font-medium drop-shadow-lg"
        >
          Relive FPL 2024/25 Season
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="space-y-6 sm:space-y-8 lg:space-y-12 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your FPL Manager ID"
              className="w-full px-6 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8 text-lg sm:text-xl lg:text-2xl xl:text-3xl rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 text-center font-medium"
              disabled={loading}
            />
          </div>

          <div className="text-center space-y-4 sm:space-y-6">
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="inline-flex items-center gap-3 sm:gap-4 lg:gap-6 px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl rounded-xl sm:rounded-2xl lg:rounded-3xl hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  Start Your Journey
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 sm:mt-8 lg:mt-12 p-4 sm:p-6 lg:p-8 bg-red-500/20 border border-red-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-sm text-center max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" />
              <p className="text-red-200 font-medium text-sm sm:text-base lg:text-lg">Unable to load FPL data</p>
            </div>
            <p className="text-red-200/80 text-xs sm:text-sm lg:text-base">{error}</p>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 sm:mt-12 lg:mt-16 text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-300" />
            <p className="text-white/80 text-sm sm:text-base lg:text-lg xl:text-xl font-medium drop-shadow-lg">
              How to find your Manager ID
            </p>
          </div>
          <p className="text-white/60 text-xs sm:text-sm lg:text-base xl:text-lg drop-shadow-lg leading-relaxed">
            Visit the FPL website → Points → Gameweek History. Your ID is in the URL after "/entry/"
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
