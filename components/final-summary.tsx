"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Share2, ArrowLeft, RotateCcw, Trophy, Instagram, Twitter, Facebook } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import SceneWrapper from "./scene-wrapper"
import { useAudio } from "@/components/audio-manager"

interface FinalSummaryProps {
  data: FPLData
  onRestart: () => void
  onBack: () => void
}

export default function FinalSummary({ data, onRestart, onBack }: FinalSummaryProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { playSound } = useAudio()

  const generateShareImage = async (platform: "instagram" | "twitter" | "facebook" | "story") => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    playSound("click")

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions based on platform
    const dimensions = {
      instagram: { width: 1080, height: 1080 },
      twitter: { width: 1200, height: 675 },
      facebook: { width: 1200, height: 630 },
      story: { width: 1080, height: 1920 },
    }

    const { width, height } = dimensions[platform]
    canvas.width = width
    canvas.height = height

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#1e1b4b")
    gradient.addColorStop(0.5, "#7c3aed")
    gradient.addColorStop(1, "#1e1b4b")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add decorative elements
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Set text properties
    ctx.textAlign = "center"
    ctx.fillStyle = "white"

    if (platform === "story") {
      // Story format (vertical)
      ctx.font = "bold 72px Inter, sans-serif"
      ctx.fillText("FPL WRAPPED", width / 2, 200)

      ctx.font = "48px Inter, sans-serif"
      ctx.fillStyle = "#4facfe"
      ctx.fillText("2024/25", width / 2, 280)

      // Manager name
      ctx.font = "bold 56px Inter, sans-serif"
      ctx.fillStyle = "white"
      const nameText = data.managerName.length > 20 ? data.managerName.substring(0, 20) + "..." : data.managerName
      ctx.fillText(nameText, width / 2, 400)

      // Title
      ctx.font = "bold 48px Inter, sans-serif"
      ctx.fillStyle = "#fbbf24"
      const titleText = data.managerTitle.length > 25 ? data.managerTitle.substring(0, 25) + "..." : data.managerTitle
      ctx.fillText(titleText, width / 2, 500)

      // Stats
      ctx.font = "bold 96px Inter, sans-serif"
      ctx.fillStyle = "#10b981"
      ctx.fillText(data.totalPoints.toString(), width / 2, 700)

      ctx.font = "36px Inter, sans-serif"
      ctx.fillStyle = "white"
      ctx.fillText("TOTAL POINTS", width / 2, 750)

      ctx.font = "bold 64px Inter, sans-serif"
      ctx.fillStyle = "#3b82f6"
      ctx.fillText(data.overallRank?.toLocaleString() || "N/A", width / 2, 900)

      ctx.font = "36px Inter, sans-serif"
      ctx.fillStyle = "white"
      ctx.fillText("FINAL RANK", width / 2, 950)

      // Badges
      ctx.font = "bold 48px Inter, sans-serif"
      ctx.fillStyle = "#8b5cf6"
      ctx.fillText(data.badges.length.toString(), width / 2, 1100)

      ctx.font = "36px Inter, sans-serif"
      ctx.fillStyle = "white"
      ctx.fillText("BADGES EARNED", width / 2, 1150)
    } else {
      // Horizontal formats
      ctx.font = "bold 64px Inter, sans-serif"
      ctx.fillText("FPL WRAPPED 2024/25", width / 2, 100)

      // Manager info
      ctx.font = "bold 48px Inter, sans-serif"
      ctx.fillStyle = "white"
      const nameText = data.managerName.length > 30 ? data.managerName.substring(0, 30) + "..." : data.managerName
      ctx.fillText(nameText, width / 2, 180)

      ctx.font = "bold 36px Inter, sans-serif"
      ctx.fillStyle = "#fbbf24"
      const titleText = data.managerTitle.length > 35 ? data.managerTitle.substring(0, 35) + "..." : data.managerTitle
      ctx.fillText(titleText, width / 2, 230)

      // Stats in a row
      const statsY = height - 200
      const statSpacing = width / 4

      // Points
      ctx.font = "bold 72px Inter, sans-serif"
      ctx.fillStyle = "#10b981"
      ctx.fillText(data.totalPoints.toString(), statSpacing, statsY)
      ctx.font = "24px Inter, sans-serif"
      ctx.fillStyle = "white"
      ctx.fillText("POINTS", statSpacing, statsY + 40)

      // Rank
      ctx.font = "bold 72px Inter, sans-serif"
      ctx.fillStyle = "#3b82f6"
      ctx.fillText(data.overallRank?.toLocaleString() || "N/A", statSpacing * 2, statsY)
      ctx.font = "24px Inter, sans-serif"
      ctx.fillStyle = "white"
      ctx.fillText("RANK", statSpacing * 2, statsY + 40)

      // Badges
      ctx.font = "bold 72px Inter, sans-serif"
      ctx.fillStyle = "#8b5cf6"
      ctx.fillText(data.badges.length.toString(), statSpacing * 3, statsY)
      ctx.font = "24px Inter, sans-serif"
      ctx.fillStyle = "white"
      ctx.fillText("BADGES", statSpacing * 3, statsY + 40)
    }

    // Add footer
    ctx.font = "24px Inter, sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.fillText("#FPLWrapped #FantasyPremierLeague", width / 2, height - 50)

    // Convert to blob and download
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `fpl-wrapped-${platform}-${data.managerName.replace(/\s+/g, "-").toLowerCase()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
        setIsGenerating(false)
      },
      "image/png",
      0.9,
    )
  }

  const handleNativeShare = async () => {
    playSound("click")
    setShowShareOptions(true)
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SceneWrapper scene="trophy">
        <div className="h-full w-full flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full max-w-lg h-full flex flex-col max-w-4xl"
          >
            <div className="modern-card rounded-2xl p-6 h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex-none text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="text-4xl mb-3"
                >
                  🏆
                </motion.div>
                <h1 className="text-2xl font-display text-gradient mb-2">Season Complete!</h1>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                  <span className="text-lg text-white font-body text-ellipsis max-w-xs">{data.managerName}</span>
                  <Trophy className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              {/* Manager Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-none text-center mb-6 p-4 modern-card rounded-xl gradient-warning"
              >
                <div className="text-white mb-1 font-body text-xs">YOUR MANAGER TITLE</div>
                <div className="text-lg font-display text-white text-clamp-2">{data.managerTitle}</div>
              </motion.div>

              {/* Stats Grid */}
              <div className="flex-none mb-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center modern-card rounded-xl p-4 gradient-success">
                    <div className="text-2xl font-display text-white mb-1">{data.totalPoints}</div>
                    <div className="text-xs text-white font-body">POINTS</div>
                  </div>
                  <div className="text-center modern-card rounded-xl p-4 gradient-primary">
                    <div className="text-2xl font-display text-white mb-1">{data.badges.length}</div>
                    <div className="text-xs text-white font-body">BADGES</div>
                  </div>
                </div>

                <div className="text-center modern-card rounded-xl p-4 gradient-accent">
                  <div className="text-2xl font-display text-white mb-1 text-ellipsis">
                    {data.overallRank?.toLocaleString()}
                  </div>
                  <div className="text-xs text-white font-body">FINAL RANK</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="flex-1 min-h-0">
                <h3 className="text-lg font-display text-white mb-3 text-center">Achievements</h3>
                <div className="grid grid-cols-2 gap-2 h-full overflow-y-auto">
                  {data.badges.map((badge, index) => (
                    <motion.div
                      key={badge}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="modern-card rounded-lg p-3 text-center h-fit gradient-secondary"
                    >
                      <div className="text-xs font-body text-white text-clamp-2">{badge}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="flex-none mt-6 space-y-4">
                <div className="text-center">
                  <div className="text-white font-display text-sm mb-3">Share Your Season</div>
                  <Button
                    onClick={handleNativeShare}
                    disabled={isGenerating}
                    className="modern-button w-full py-3 text-white rounded-xl"
                  >
                    <Share2 size={18} className="mr-2" />
                    <span className="font-display">{isGenerating ? "Generating..." : "Create Share Image"}</span>
                  </Button>
                </div>

                {/* Share Options */}
                {showShareOptions && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="text-center text-sm text-white font-body">Choose format:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => generateShareImage("instagram")}
                        disabled={isGenerating}
                        className="modern-button text-white text-xs rounded-lg"
                      >
                        <Instagram size={14} className="mr-1" />
                        <span className="font-body">Instagram Post</span>
                      </Button>
                      <Button
                        onClick={() => generateShareImage("story")}
                        disabled={isGenerating}
                        className="modern-button text-white text-xs rounded-lg"
                      >
                        <Instagram size={14} className="mr-1" />
                        <span className="font-body">Story</span>
                      </Button>
                      <Button
                        onClick={() => generateShareImage("twitter")}
                        disabled={isGenerating}
                        className="modern-button text-white text-xs rounded-lg"
                      >
                        <Twitter size={14} className="mr-1" />
                        <span className="font-body">Twitter</span>
                      </Button>
                      <Button
                        onClick={() => generateShareImage("facebook")}
                        disabled={isGenerating}
                        className="modern-button text-white text-xs rounded-lg"
                      >
                        <Facebook size={14} className="mr-1" />
                        <span className="font-body">Facebook</span>
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      playSound("click")
                      onBack()
                    }}
                    className="modern-button text-white py-2 rounded-xl"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    <span className="font-display">Back</span>
                  </Button>
                  <Button
                    onClick={() => {
                      playSound("click")
                      onRestart()
                    }}
                    className="modern-button text-white py-2 rounded-xl"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    <span className="font-display">New Manager</span>
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-none text-center mt-4 text-xs text-slate-200 font-body">FPL Wrapped 2024/25</div>
            </div>
          </motion.div>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </SceneWrapper>
    </div>
  )
}
