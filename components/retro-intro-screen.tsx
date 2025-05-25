"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, HelpCircle, Trophy, Target, Users, X } from "lucide-react"

interface RetroIntroScreenProps {
  onStart: (managerId: string) => void
  error?: string | null
}

export default function RetroIntroScreen({ onStart, error }: RetroIntroScreenProps) {
  const [managerId, setManagerId] = useState("")
  const [showHelp, setShowHelp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (managerId.trim()) {
      onStart(managerId.trim())
    }
  }

  const handleDemoClick = () => {
    onStart("demo")
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 flex flex-col relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
              opacity: 0.1,
            }}
            animate={{
              y: -20,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Main Content Container - Made Scrollable */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 relative z-10 max-w-md mx-auto w-full">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-8 mt-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="mb-6"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          </motion.div>
          <h1 className="font-display text-title text-white font-bold mb-2 drop-shadow-lg">FPL MANAGER MOMENTS 2024</h1>
          <p className="font-body text-small text-gray-200 leading-relaxed drop-shadow-sm">
            Relive Your Fantasy Premier League season with insights
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-8 w-full"
        >
          <div className="pixel-card p-3 bg-white/10 backdrop-blur-sm text-center">
            <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="font-body text-micro text-black font-semibold">Performance</div>
          </div>
          <div className="pixel-card p-3 bg-white/10 backdrop-blur-sm text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="font-body text-micro text-black font-semibold">Achievements</div>
          </div>
          <div className="pixel-card p-3 bg-white/10 backdrop-blur-sm text-center">
            <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="font-body text-micro text-black font-semibold">Insights</div>
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="w-full mb-6"
        >
          <div className="pixel-card p-6 bg-white/95 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="managerId" className="block font-body text-small text-gray-800 font-semibold mb-2">
                  Enter Your FPL Manager ID
                </label>
                <Input
                  id="managerId"
                  type="text"
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full pixel-input"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pixel-card p-3 bg-red-100 border border-red-300"
                >
                  <p className="font-body text-small text-red-700">{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={!managerId.trim()}
                className="w-full cta-button bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-2" />
                REVEAL MY MOMENTS
              </Button>
            </form>

            <div className="mt-4 text-center">
              <div className="font-body text-micro text-gray-600 mb-2">Don't have your ID?</div>
              <Button
                onClick={handleDemoClick}
                className="w-full cta-button-secondary bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2"
              >
                TRY DEMO MODE
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Help Button - Replace the accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full mb-8"
        >
          <Button
            onClick={() => setShowHelp(true)}
            className="w-full pixel-button bg-white/20 hover:bg-white/30 text-white border border-white/30 p-3 flex items-center justify-center"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="font-body text-small font-semibold">How to find your FPL Manager ID</span>
          </Button>
        </motion.div>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="pixel-card p-6 max-w-md w-full bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-body text-gray-900 font-bold">Find Your FPL Manager ID</h3>
                  <Button
                    onClick={() => setShowHelp(false)}
                    className="pixel-button p-1 w-8 h-8 bg-gray-200 hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3 font-body text-small text-gray-800 leading-relaxed">
                  <div>
                    <strong className="text-gray-900">Step 1:</strong> Go to{" "}
                    <a
                      href="https://fantasy.premierleague.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      fantasy.premierleague.com
                    </a>
                  </div>
                  <div>
                    <strong className="text-gray-900">Step 2:</strong> Log into your FPL account
                  </div>
                  <div>
                    <strong className="text-gray-900">Step 3:</strong> Go to "Points" or "Transfers" page
                  </div>
                  <div>
                    <strong className="text-gray-900">Step 4:</strong> Look at the URL in your browser
                  </div>
                  <div>
                    <strong className="text-gray-900">Step 5:</strong> Your Manager ID is the number after "/entry/"
                  </div>
                  <div className="pixel-card p-3 bg-gray-100 border border-gray-300 mt-3">
                    <div className="font-body text-micro text-gray-700">
                      <strong>Example:</strong>
                      <br />
                      URL: fantasy.premierleague.com/entry/
                      <span className="bg-yellow-200 px-1 rounded">123456</span>
                      /event/38
                      <br />
                      Your ID: <strong>123456</strong>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="font-body text-micro text-gray-600">
                      Still can't find it? Try our demo mode to see how the app works!
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center pb-8"
        >
          <p className="font-body text-micro text-gray-300">
            Made with ⚽ for FPL managers worldwide •{" "}
            <a
              href="https://github.com/yalcinme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
