"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Users, TrendingUp, Target, HelpCircle, X } from "lucide-react"

interface RetroIntroScreenProps {
  onStartGame: (managerId: string) => void
}

export function RetroIntroScreen({ onStartGame }: RetroIntroScreenProps) {
  const [managerId, setManagerId] = useState("")
  const [showHelp, setShowHelp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        if (!managerId || typeof managerId !== "string") {
          alert("Please enter a valid Manager ID")
          return
        }

        const cleanId = managerId.toString().trim()
        if (!cleanId || cleanId.length === 0) {
          alert("Please enter a valid Manager ID")
          return
        }

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay for UX
        onStartGame(cleanId)
      } catch (error) {
        console.error("Error submitting form:", error)
        alert("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [managerId, onStartGame],
  )

  const handleDemoMode = useCallback(async () => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 100))
      onStartGame("demo")
    } catch (error) {
      console.error("Error starting demo:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [onStartGame])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target?.value || ""
      setManagerId(value)
    } catch (error) {
      console.error("Error handling input change:", error)
    }
  }, [])

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = () => {
      try {
        const images = [
          "/images/season-kickoff-new.png",
          "/images/transfer-market-new.png",
          "/images/peak-performance-new.png",
          "/images/captaincy-masterclass-new.png",
          "/images/consistency-check-new.png",
          "/images/bench-management-new.png",
        ]

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          requestIdleCallback(() => {
            images.forEach((src) => {
              const img = new Image()
              img.src = src
            })
          })
        }
      } catch (error) {
        console.error("Error preloading images:", error)
      }
    }

    preloadImages()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-green-600/20 backdrop-blur-sm rounded-full px-6 py-3 border border-green-400/30">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white pixel-font">FPL Manager Moments</h1>
          </div>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Relive your Fantasy Premier League season through an interactive retro gaming experience
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-black/60 backdrop-blur-sm border-green-400/30 shadow-2xl">
          <CardContent className="p-8 space-y-8">
            {/* Manager ID Form */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Enter Your Manager ID</h2>
                <p className="text-green-200">
                  Find your Manager ID in the FPL app under "Points" → "Gameweek history"
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter your FPL Manager ID"
                    value={managerId}
                    onChange={handleInputChange}
                    className="flex-1 bg-black/40 border-green-400/50 text-white placeholder:text-green-300/60 focus:border-green-400 focus:ring-green-400/20 text-lg py-3"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!managerId.trim() || isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? "Starting..." : "Start Journey"}
                  </Button>
                </div>
              </form>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleDemoMode}
                  disabled={isLoading}
                  className="border-green-400/50 text-green-300 hover:bg-green-400/10 hover:text-green-200 transition-all duration-200"
                >
                  {isLoading ? "Loading..." : "Try Demo Mode"}
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Trophy, title: "Season Highlights", desc: "Relive your best moments" },
                { icon: Users, title: "Manager Analysis", desc: "Deep dive into your decisions" },
                { icon: TrendingUp, title: "Performance Insights", desc: "Track your progress" },
                { icon: Target, title: "Strategic Review", desc: "Learn from your choices" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-green-900/30 backdrop-blur-sm rounded-lg p-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 group"
                >
                  <feature.icon className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-green-200/80">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Help Button */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowHelp(true)}
                className="text-green-300 hover:text-green-200 hover:bg-green-400/10"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Need help finding your Manager ID?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-black/90 border-green-400/30 max-w-md w-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Finding Your Manager ID</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(false)}
                    className="text-green-300 hover:text-green-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3 text-green-200">
                  <p>1. Open the official FPL app or website</p>
                  <p>2. Go to "Points" section</p>
                  <p>3. Select "Gameweek history"</p>
                  <p>4. Your Manager ID is displayed at the top</p>
                  <p className="text-sm text-green-300/80 mt-4">It's usually a 6-8 digit number like "1234567"</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
