"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import RetroAvatar from "./retro-avatar"
import { useAudio } from "./audio-manager-enhanced"

interface RetroIntroScreenProps {
  onStart: (managerId: string) => void
  error: string | null
}

export default function RetroIntroScreen({ onStart, error }: RetroIntroScreenProps) {
  const [managerId, setManagerId] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const { playSound, playMusic } = useAudio()

  useEffect(() => {
    // Start menu music when component mounts
    playMusic("menu", true)

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (managerId.trim()) {
      playSound("powerup")
      onStart(managerId.trim())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManagerId(e.target.value)
    if (e.target.value) {
      playSound("click")
    }
  }

  const toggleHelp = () => {
    setShowHelp(!showHelp)
    playSound("coin")
  }

  const handleDemoClick = () => {
    setManagerId("demo")
    playSound("powerup")
    onStart("demo")
  }

  return (
    <div className="h-screen w-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Stadium Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/stadium-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm aspect-[3/5] flex flex-col">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-none text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="pixel-card p-4 mb-4 bg-white bg-opacity-95"
          >
            <h1 className="font-display text-lg text-contrast-dark tracking-wide mb-2">YOUR MANAGER</h1>
            <h1 className="font-display text-lg text-contrast-dark tracking-wide mb-2">MOMENTS WRAPPED</h1>
            <p className="font-body text-xs text-contrast-dark tracking-wide">2024/25 SEASON</p>
          </motion.div>
        </motion.div>

        {/* Character */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="flex-none flex justify-center mb-8"
          onAnimationComplete={() => playSound("jump")}
        >
          <RetroAvatar isMoving={false} kitColor="#ef4444" size="large" role="manager" />
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex-1 flex flex-col"
        >
          <div className="pixel-card p-4 mb-4 bg-white bg-opacity-95">
            <div className="text-center mb-4">
              <h2 className="font-display text-xs text-contrast-dark tracking-wide mb-2">ENTER MANAGER ID</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="YOUR FPL ID"
                  value={managerId}
                  onChange={handleInputChange}
                  className="w-full p-3 font-body text-sm text-center border-2 border-black rounded-md bg-white placeholder-gray-500 tracking-wide"
                />
                {showCursor && managerId === "" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-black animate-pulse"></div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pixel-card bg-red-100 border-red-500 text-red-700 p-3 text-center"
                  onAnimationComplete={() => playSound("whistle")}
                >
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="font-display text-xs tracking-wide">ERROR</span>
                  </div>
                  <div className="font-body text-xs tracking-wide leading-relaxed">{error}</div>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={!managerId.trim()}
                onMouseEnter={() => playSound("coin")}
                className="pixel-button w-full p-3 font-display text-xs tracking-wide group flex items-center justify-center"
                style={{ color: "black" }}
              >
                REVEAL MY MANAGER MOMENTS
              </Button>
            </form>

            {/* Demo Button */}
            <div className="mt-4">
              <Button
                onClick={handleDemoClick}
                onMouseEnter={() => playSound("coin")}
                className="pixel-button w-full p-2 font-display text-xs tracking-wide bg-blue-100 hover:bg-blue-200"
                style={{ color: "black" }}
              >
                TRY DEMO MODE
              </Button>
            </div>
          </div>

          {/* Help Accordion */}
          <div className="text-center mb-4">
            <Button
              onClick={toggleHelp}
              className="pixel-button p-2 font-display text-xs tracking-wide flex items-center justify-center w-full bg-white bg-opacity-95"
            >
              HOW TO FIND YOUR FPL ID
              {showHelp ? <ChevronUp className="w-3 h-3 ml-2" /> : <ChevronDown className="w-3 h-3 ml-2" />}
            </Button>

            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pixel-card p-3 mt-2 bg-blue-100 bg-opacity-95">
                    <div className="font-body text-xs text-contrast-dark tracking-wide text-left space-y-2">
                      <p>
                        <strong>Method 1:</strong>
                      </p>
                      <p>1. Go to fantasy.premierleague.com</p>
                      <p>2. Log into your account</p>
                      <p>3. Click "Points" in the menu</p>
                      <p>4. Look at the URL - your ID is the number after "/entry/"</p>
                      <p className="text-blue-700 font-bold">Example: .../entry/123456/event/1 → ID is 123456</p>

                      <p className="pt-2">
                        <strong>Method 2:</strong>
                      </p>
                      <p>1. Go to your team page</p>
                      <p>2. Click "View Gameweek History"</p>
                      <p>3. The ID is in the URL</p>

                      <p className="pt-2 text-green-700 font-bold">Can't find it? Try "demo" or "1" for a sample!</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
