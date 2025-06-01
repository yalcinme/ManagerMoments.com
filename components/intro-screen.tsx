"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Play, AlertCircle, Loader2, Info } from "lucide-react"

interface IntroScreenProps {
  onStart: (id: string) => void
  error: string | null
  loading: boolean
  managerId: string
  setManagerId: (id: string) => void
}

export function IntroScreen({ onStart, error, loading, managerId, setManagerId }: IntroScreenProps) {
  const [inputValue, setInputValue] = useState(managerId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onStart(inputValue.trim())
    }
  }

  const handleDemoClick = () => {
    setInputValue("1991174")
    onStart("1991174")
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/homepage-podium.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-slate-900/75 to-black/85" />

      {/* Responsive content container with proper scrolling */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="mb-6 sm:mb-8 text-center"
              >
                <Trophy className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-yellow-400 mx-auto" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-center mb-4 sm:mb-6"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #ffffff 50%, #60a5fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
                }}
              >
                MANAGER MOMENTS
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2 sm:mb-4"
                style={{
                  color: "#e2e8f0",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                Your FPL Season Wrapped
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-sm sm:text-base lg:text-lg text-center max-w-md mx-auto leading-relaxed px-4"
                style={{
                  color: "#cbd5e1",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                }}
              >
                Discover your Fantasy Premier League journey with detailed insights, achievements, and shareable moments
                from the 2024/25 season.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="space-y-4 sm:space-y-6 text-center"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your FPL Manager ID"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-12 sm:h-14 lg:h-16 text-base sm:text-lg bg-white/95 backdrop-blur-sm border-2 border-blue-300/50 rounded-2xl px-4 sm:px-6 text-gray-800 placeholder:text-gray-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 text-center font-medium"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="w-full h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-2xl font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Start Your Journey
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p
                  className="text-sm mb-3"
                  style={{
                    color: "#94a3b8",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  Don't know your ID?
                </p>
                <Button
                  onClick={handleDemoClick}
                  disabled={loading}
                  variant="outline"
                  className="h-10 sm:h-12 px-4 sm:px-6 bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 rounded-xl transition-all duration-300 font-medium"
                >
                  Try Demo (ID: 1991174)
                </Button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/25 backdrop-blur-sm border border-red-400/40 rounded-2xl p-4 sm:p-6 max-h-32 overflow-y-auto text-center"
                >
                  <div className="flex items-start gap-3 justify-center">
                    <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                    <div className="text-center">
                      <p
                        className="font-medium mb-2"
                        style={{
                          color: "#fecaca",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        Unable to load your FPL data
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "#fed7d7",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                        }}
                      >
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-center pt-4 sm:pt-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-300" />
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{
                      color: "#93c5fd",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    How to find your Manager ID
                  </p>
                </div>
                <p
                  className="text-xs sm:text-sm leading-relaxed px-4"
                  style={{
                    color: "#94a3b8",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  Visit the FPL website → Points → Gameweek History. Your ID is in the URL after "/entry/"
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
