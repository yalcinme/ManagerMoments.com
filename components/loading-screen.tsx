"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Sparkles, Target, TrendingUp, Users, Zap } from "lucide-react"

interface LoadingScreenProps {
  stage?: "fetching" | "processing" | "analyzing" | "finalizing"
  progress?: number
}

export default function LoadingScreen({ stage = "fetching", progress = 0 }: LoadingScreenProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading...")
  const [currentIcon, setCurrentIcon] = useState(0)
  const [mounted, setMounted] = useState(false)

  const icons = [Trophy, Sparkles, Target, TrendingUp, Users, Zap]
  const IconComponent = icons[currentIcon]

  const stageMessages = {
    fetching: [
      "Connecting to FPL servers...",
      "Fetching your manager data...",
      "Loading season history...",
      "Gathering gameweek data...",
    ],
    processing: [
      "Processing your transfers...",
      "Analyzing captain choices...",
      "Calculating performance metrics...",
      "Evaluating bench decisions...",
    ],
    analyzing: [
      "Finding your MVP player...",
      "Discovering missed opportunities...",
      "Comparing with global averages...",
      "Generating insights...",
    ],
    finalizing: [
      "Creating your FIFA 25 experience...",
      "Preparing final summary...",
      "Almost ready...",
      "Loading complete!",
    ],
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const messages = stageMessages[stage]
    let messageIndex = 0
    const targetProgress = progress

    const interval = setInterval(() => {
      // Smooth progress animation
      setCurrentProgress((prev) => {
        const diff = targetProgress - prev
        return prev + diff * 0.1
      })

      // Cycle through messages
      if (messageIndex < messages.length - 1) {
        messageIndex++
        setLoadingText(messages[messageIndex])
      }

      // Cycle through icons
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 800)

    return () => clearInterval(interval)
  }, [stage, progress])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-green-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center relative overflow-hidden">
      {/* Simplified background particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="text-center space-y-8 z-10 px-4">
        {/* Main logo and title */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-white/10 backdrop-blur-sm px-8 py-6 rounded-3xl text-center border border-white/20"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Trophy className="w-12 h-12 text-yellow-400" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white text-center">FPL Manager Moments</h1>
              <p className="text-lg text-white/80 text-center">Your 2024/25 season wrapped</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Sparkles className="w-12 h-12 text-blue-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Dynamic icon */}
        <motion.div
          key={currentIcon}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Progress section */}
        <div className="w-full max-w-md mx-auto space-y-4 text-center">
          {/* Progress bar */}
          <div className="bg-white/20 h-4 rounded-full overflow-hidden backdrop-blur-sm border border-white/30">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Loading text with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-white text-lg font-medium text-center"
            >
              {loadingText}
            </motion.div>
          </AnimatePresence>

          {/* Progress percentage */}
          <motion.div
            className="text-white/70 text-sm text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {Math.round(currentProgress)}% Complete
          </motion.div>

          {/* Stage indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {Object.keys(stageMessages).map((stageName, index) => (
              <motion.div
                key={stageName}
                className={`w-2 h-2 rounded-full ${stageName === stage ? "bg-yellow-400" : "bg-white/30"}`}
                animate={stageName === stage ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            ))}
          </div>
        </div>

        {/* Fun facts while loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-white/60 text-sm text-center max-w-md mx-auto"
        >
          <p>💡 Did you know? The average FPL manager makes 47 transfers per season!</p>
        </motion.div>
      </div>
    </div>
  )
}
