"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Sparkles } from "lucide-react"
import SceneWrapper from "./scene-wrapper"
import PixelAvatar from "./pixel-avatar"
import { useAudio } from "@/components/audio-manager"

interface IntroScreenProps {
  onStart: (managerId: string) => void
  error: string | null
}

export default function IntroScreen({ onStart, error }: IntroScreenProps) {
  const [managerId, setManagerId] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const { playSound } = useAudio()

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (managerId.trim()) {
      playSound("whistle")
      onStart(managerId.trim())
    }
  }

    return (
      <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-[#0E0F1B] via-[#1B1D2B] to-[#0E0F1B]">
      <SceneWrapper scene="stadium">
        <div className="h-full w-full flex flex-col max-w-4xl mx-auto p-4">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-none text-center py-8"
          >
            <div className="modern-card inline-block px-8 py-6 rounded-2xl">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="text-4xl md:text-6xl font-display text-gradient mb-3"
              >
                FPL Wrapped
              </motion.div>
              <div className="flex items-center justify-center gap-3 text-sm md:text-base text-white font-body">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                <span>2024/25 Season Review</span>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-4 min-h-0">
            {/* Character */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              className="float-animation"
            >
              <PixelAvatar isMoving={false} teamColor="#667eea" size="large" />
            </motion.div>

            {/* Input Form */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-full max-w-md"
            >
              <div className="modern-card rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-white text-xl font-display mb-3">Enter Manager ID</div>
                    <div className="w-full h-0.5 bg-gradient-to-r from-[#45A1FF] to-[#00C2A8] rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Your FPL Manager ID"
                      value={managerId}
                      onChange={(e) => setManagerId(e.target.value)}
                      className="w-full p-4 text-lg bg-white/5 border border-white/10 text-white placeholder-slate-300 text-center font-body rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                    {showCursor && managerId === "" && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-cyan-400 animate-pulse rounded-full"></div>
                    )}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="modern-card bg-red-500/10 border border-red-400/20 text-red-200 p-3 text-center text-sm rounded-xl font-body"
                    >
                      <div className="text-ellipsis">{error}</div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={!managerId.trim()}
                    onClick={() => playSound("click")}
                    className="modern-button w-full p-4 text-lg text-white rounded-xl group transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    <span className="font-display">Start Your Journey</span>
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-300 font-body">Need help? Try Manager ID: 1 for demo</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex-none text-center py-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-slate-300 text-sm font-body"
            >
              Powered by Fantasy Premier League API
            </motion.div>
          </div>
        </div>
      </SceneWrapper>
    </div>
  )
}
