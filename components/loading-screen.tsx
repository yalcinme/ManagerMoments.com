"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Sparkles } from "lucide-react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading...")

  useEffect(() => {
    const messages = ["Loading...", "Fetching data...", "Analyzing performance...", "Ready!"]
    let messageIndex = 0
    let currentProgress = 0

    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 8
      if (currentProgress > 100) currentProgress = 100

      setProgress(currentProgress)

      if (messageIndex < messages.length - 1 && currentProgress > (messageIndex + 1) * 25) {
        messageIndex++
        setLoadingText(messages[messageIndex])
      }

      if (currentProgress >= 100) {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm px-8 py-6 rounded-3xl text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white text-center">FPL Manager Moments</h1>
              <p className="text-lg text-white/80 text-center">Your 2024/25 season wrapped</p>
            </div>
            <Sparkles className="w-12 h-12 text-blue-400" />
          </div>
        </motion.div>

        <div className="w-full max-w-sm mx-auto space-y-4 text-center">
          <div className="bg-white/20 h-3 rounded-full overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.div
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-lg font-medium text-center"
          >
            {loadingText}
          </motion.div>
          <div className="text-white/70 text-sm text-center">{Math.round(progress)}% Complete</div>
        </div>
      </div>
    </div>
  )
}
