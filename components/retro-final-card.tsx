"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, MessageCircle, Instagram, Facebook, X, Award, Share2 } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import RetroAvatar from "./retro-avatar"
import { useAudio } from "./audio-manager-enhanced"

interface RetroFinalCardProps {
  data: FPLData
  onRestart: () => void
  onBack: () => void
}

// Achievement explanations
const achievementExplanations: { [key: string]: string } = {
  "CENTURY CLUB": "Scored 2000+ points this season - you're in the top tier of FPL managers!",
  "TRIPLE DIGITS": "Hit 100+ points in a single gameweek - only elite managers achieve this!",
  "SET & FORGET": "Made 20 or fewer transfers - you trusted your team and it paid off!",
  "TRANSFER KING": "Made 50+ transfers - you love tinkering with your team!",
  "CHIP MASTER": "Used 3+ chips effectively - you know how to maximize your tools!",
  "GREEN MACHINE": "Had 20+ green arrows - your rank kept improving throughout the season!",
  CONSISTENT: "Had 5 or fewer red arrows - you maintained steady performance!",
  "ABOVE AVERAGE": "Beat the gameweek average 25+ times - consistently outperformed other managers!",
  "TOP 100K": "Finished in the top 100,000 managers worldwide - exceptional performance!",
  "ELITE TIER": "Finished in the top 10,000 managers - you're among the very best!",
}

export default function RetroFinalCard({ data, onRestart, onBack }: RetroFinalCardProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)
  const [showAllBadges, setShowAllBadges] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { playSound, playMusic, stopMusic } = useAudio()

  // Format rank properly for millions
  const formatRank = (rank: number | null) => {
    if (!rank) return "N/A"

    if (rank >= 1_000_000) {
      return (rank / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M"
    }
    if (rank >= 10_000) {
      return (rank / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
    }
    return rank.toLocaleString()
  }

  useEffect(() => {
    // Stop background music and play the special final music
    stopMusic()

    // Play the uploaded audio file
    if (audioRef.current) {
      audioRef.current.volume = 0.7
      audioRef.current.play().catch(console.error)
    }

    // Start confetti animation
    setShowConfetti(true)
    playSound("celebration")
  }, [])

  const handleAchievementClick = (badge: string) => {
    setSelectedAchievement(badge)
    playSound("coin")
  }

  const closeAchievementModal = () => {
    setSelectedAchievement(null)
  }

  const handleShowAllBadges = () => {
    setShowAllBadges(true)
    playSound("powerup")
  }

  const closeAllBadgesModal = () => {
    setShowAllBadges(false)
  }

  const shareToWhatsApp = () => {
    const shareText = `🏆 Check out my FPL Manager's Moment! 🏆\n\n${data.managerTitle}\n${data.managerName}\n${data.totalPoints} points | Rank ${formatRank(data.overallRank)}\n\n#ManagerMoments #FPLMoments`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, "_blank")
    playSound("coin")
  }

  const shareToInstagram = () => {
    const shareText = `🏆 My FPL Manager's Moment! 🏆\n\n${data.managerTitle}\n${data.managerName}\n${data.totalPoints} points | Rank ${formatRank(data.overallRank)}\n\n#ManagerMoments #FPLMoments #FantasyPremierLeague`

    // Copy text to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Caption copied to clipboard! Open Instagram to share.")
    })
    playSound("coin")
  }

  const shareToFacebook = () => {
    const shareText = `Check out my FPL Manager's Moment! ${data.managerTitle} - ${data.totalPoints} points, rank ${formatRank(data.overallRank)}! #ManagerMoments #FPLMoments`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
    window.open(facebookUrl, "_blank")
    playSound("coin")
  }

  const shareGeneric = async () => {
    const shareText = `🏆 I just discovered my FPL Manager Moments! 🏆\n\n${data.managerTitle} with ${data.totalPoints} points!\n\nCreate your own FPL wrapped experience and see how your season really went! 📊⚽\n\n#ManagerMoments #FPLMoments`
    const shareUrl = window.location.origin // Homepage URL

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Create Your FPL Manager Moments",
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
        alert("Link copied to clipboard! Share it with your friends so they can create their own FPL Manager Moments!")
      })
    }
    playSound("coin")
  }

  return (
    <div className="h-screen w-screen gradient-gold flex items-start justify-center p-4 relative overflow-hidden">
      {/* Hidden audio element for the final music */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/86-brondesbury-road-5.wav" type="audio/wav" />
      </audio>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -100,
                x: Math.random() * window.innerWidth,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: 360 * 3,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#ef4444", "#22c55e", "#3b82f6", "#facc15", "#a855f7"][i % 5],
              }}
            />
          ))}
        </div>
      )}

      {/* Single Achievement Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeAchievementModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="pixel-card p-6 max-w-sm w-full bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-sm text-contrast-dark tracking-wide">{selectedAchievement}</h3>
                <Button onClick={closeAchievementModal} className="pixel-button p-1 w-8 h-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="font-body text-xs text-contrast-dark leading-relaxed">
                {achievementExplanations[selectedAchievement] || "Achievement unlocked!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Badges Modal */}
      <AnimatePresence>
        {showAllBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeAllBadgesModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="pixel-card p-6 max-w-sm w-full bg-white max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-display text-sm text-contrast-dark tracking-wide">ALL BADGES EARNED</h3>
                </div>
                <Button onClick={closeAllBadgesModal} className="pixel-button p-1 w-8 h-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {data.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAchievementClick(badge)}
                    className="pixel-card p-3 bg-orange-100 cursor-pointer hover:bg-orange-200 transition-colors"
                  >
                    <div className="font-display text-sm text-contrast-dark tracking-wide mb-1">{badge}</div>
                    <div className="font-body text-xs text-contrast-dark leading-relaxed">
                      {achievementExplanations[badge] || "Achievement unlocked!"}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-4">
                <div className="font-body text-xs text-contrast-dark opacity-70">
                  You earned {data.badges.length} badge{data.badges.length !== 1 ? "s" : ""} this season!
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="w-full max-w-sm h-full flex flex-col overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex-1 min-h-0 py-4">
          {/* Optimized Shareable Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-6"
          >
            <div
              className="w-full pixel-card p-6 flex flex-col bg-gradient-to-b from-yellow-200 to-yellow-100 relative overflow-hidden"
              style={{ aspectRatio: "2/3", minHeight: "600px" }}
            >
              {/* Header */}
              <div className="text-center mb-4 relative z-10">
                <div className="text-4xl mb-2">🏆</div>
                <h1 className="font-display text-base text-contrast-dark tracking-wide mb-1">YOUR FPL MANAGER</h1>
                <h1 className="font-display text-base text-contrast-dark tracking-wide mb-2">MOMENTS</h1>
                <div className="font-display text-md text-contrast-dark tracking-wide mb-2">{data.managerTitle}</div>
              </div>

              {/* Avatar */}
              <div className="flex justify-center mb-4 relative z-10">
                <RetroAvatar isMoving={false} kitColor="#ef4444" size="large" role="manager" />
              </div>

              {/* Manager Name & Team */}
              <div className="text-center mb-3 relative z-10 space-y-1">
                <div className="pixel-card p-2 bg-white">
                  <div className="font-display text-sm text-contrast-dark tracking-wide truncate px-1">
                    {data.managerName}
                  </div>
                </div>
                <div className="pixel-card p-1 bg-blue-100">
                  <div className="font-display text-xs text-contrast-dark tracking-wide truncate px-1">
                    Team: {data.teamName}
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3 relative z-10">
                <div className="pixel-card p-2 text-center bg-green-200">
                  <div className="font-display text-xl text-contrast-dark tracking-wide">{data.totalPoints}</div>
                  <div className="font-body text-xs text-contrast-dark">POINTS</div>
                </div>
                <div className="pixel-card p-2 text-center bg-blue-200">
                  <div className="font-display text-xl text-contrast-dark tracking-wide">
                    {formatRank(data.overallRank)}
                  </div>
                  <div className="font-body text-xs text-contrast-dark">RANK</div>
                </div>
              </div>

              {/* Best GW & Badges */}
              <div className="grid grid-cols-2 gap-2 mb-3 relative z-10">
                <div className="pixel-card p-2 text-center bg-red-200">
                  <div className="font-display text-lg text-contrast-dark tracking-wide">{data.bestGw?.points}</div>
                  <div className="font-body text-xs text-contrast-dark">BEST GW</div>
                </div>
                <div
                  className="pixel-card p-2 text-center bg-purple-200 cursor-pointer hover:bg-purple-300 transition-colors"
                  onClick={handleShowAllBadges}
                >
                  <div className="font-display text-lg text-contrast-dark tracking-wide">{data.badges.length}</div>
                  <div className="font-body text-xs text-contrast-dark">BADGES</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="flex-1 relative z-10">
                <div className="grid grid-cols-1 gap-1">
                  {data.badges.slice(0, 3).map((badge, index) => (
                    <div
                      key={badge}
                      onClick={() => handleAchievementClick(badge)}
                      className="pixel-card p-2 text-center bg-orange-200 cursor-pointer hover:bg-orange-300 transition-colors"
                    >
                      <div className="font-body text-xs text-contrast-dark">{badge}</div>
                    </div>
                  ))}
                </div>
                {data.badges.length > 3 && (
                  <div className="text-center mt-2">
                    <div
                      onClick={handleShowAllBadges}
                      className="font-body text-xs text-contrast-dark opacity-70 cursor-pointer hover:opacity-100"
                    >
                      +{data.badges.length - 3} more badges
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center mt-4 relative z-10">
                <div className="font-body text-xs text-contrast-dark tracking-wide">#ManagerMoments #FPLMoments</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Share Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7 }}
            className="space-y-3 pb-4"
          >
            {/* Share Buttons */}
            <div className="space-y-2">
              <div className="text-center">
                <div className="font-display text-xs text-contrast-dark tracking-wide mb-2">SHARE YOUR MOMENT</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Button
                  onClick={shareToWhatsApp}
                  className="pixel-button py-2 font-display text-xs tracking-wide text-white bg-green-500 hover:bg-green-600 border-green-700"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span className="truncate">WHATSAPP</span>
                </Button>
                <Button
                  onClick={shareToInstagram}
                  className="pixel-button py-2 font-display text-xs tracking-wide text-white bg-purple-500 hover:bg-purple-600 border-purple-700"
                >
                  <Instagram className="w-3 h-3 mr-1" />
                  <span className="truncate">INSTAGRAM</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={shareToFacebook}
                  className="pixel-button py-2 font-display text-xs tracking-wide text-white bg-blue-500 hover:bg-blue-600 border-blue-700"
                >
                  <Facebook className="w-3 h-3 mr-1" />
                  <span className="truncate">FACEBOOK</span>
                </Button>
                <Button
                  onClick={shareGeneric}
                  className="pixel-button py-2 font-display text-xs tracking-wide text-white bg-gray-500 hover:bg-gray-600 border-gray-700"
                >
                  <Share2 className="w-3 h-3 mr-1" />
                  <span className="truncate">INVITE FRIENDS</span>
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={onBack} className="pixel-button py-2 font-display text-xs tracking-wide">
                <ArrowLeft className="w-4 h-4 mr-1" />
                BACK
              </Button>
              <Button onClick={onRestart} className="pixel-button py-2 font-display text-xs tracking-wide">
                <RotateCcw className="w-4 h-4 mr-1" />
                RESTART
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
