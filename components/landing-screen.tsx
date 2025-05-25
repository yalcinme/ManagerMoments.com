"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play } from "lucide-react"

interface LandingScreenProps {
  onStart: (managerId: string) => void
  error: string | null
}

export default function LandingScreen({ onStart, error }: LandingScreenProps) {
  const [managerId, setManagerId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (managerId.trim()) {
      onStart(managerId.trim())
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Stadium backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-green-500 to-green-600">
        {/* Stadium lights */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
            className="absolute w-8 h-8 bg-yellow-300 rounded-full"
            style={{
              top: "20%",
              left: `${15 + i * 12}%`,
              boxShadow: "0 0 20px rgba(255, 255, 0, 0.6)",
            }}
          />
        ))}

        {/* Stadium structure */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gray-600 opacity-80"></div>
        <div className="absolute bottom-32 left-0 w-full h-16 bg-gray-700 opacity-60"></div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 pixel-text">YOUR MANAGER</h1>
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 mb-6 pixel-text">MOMENTS</h1>
        <p className="text-lg md:text-xl text-white pixel-text opacity-90">FPL 2024/25 SEASON WRAPPED</p>
      </motion.div>

      {/* Game start interface */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-black bg-opacity-80 rounded-lg p-8 border-4 border-white">
          <h2 className="text-xl pixel-text text-white text-center mb-6">ENTER PLAYER ID</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="FPL MANAGER ID"
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full p-4 text-lg border-4 border-gray-600 rounded-lg bg-gray-800 pixel-text text-center text-white placeholder-gray-400"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-600 text-white p-3 rounded-lg border-2 border-red-400 pixel-text text-center text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={!managerId.trim()}
              className="w-full p-4 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:bg-gray-600 border-4 border-green-400 rounded-lg pixel-text text-white relative group"
            >
              <Play className="w-5 h-5 mr-2" />
              REVEAL MY MOMENTS
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 pixel-text">NEED HELP? TRY ID: 1 FOR DEMO</p>
          </div>
        </div>
      </motion.div>

      {/* Floating footballs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + i,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
          className="absolute w-6 h-6 bg-white rounded-full border-2 border-black"
          style={{
            top: `${60 + i * 5}%`,
            left: `${10 + i * 20}%`,
          }}
        />
      ))}
    </div>
  )
}
