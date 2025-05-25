"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Award, Volume2, VolumeX } from "lucide-react"
import type { FPLData } from "@/types/fpl"
import { useAudio } from "./audio-manager-enhanced"

interface RetroFinalCardProps {
  data: FPLData
  onRestart: () => void
  onBack: () => void
}

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
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { playSound, stopMusic, isMuted, toggleMute } = useAudio()

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
    stopMusic()

    const playAudio = async () => {
      if (audioRef.current && !audioMuted) {
        try {
          audioRef.current.volume = 0.8
          audioRef.current.currentTime = 0
          await audioRef.current.play()
          setAudioPlaying(true)
          console.log("Champions League 8-bit audio started playing")
        } catch (error) {
          console.error("Error playing Champions League audio:", error)
          playSound("celebration")
        }
      }
    }

    setShowConfetti(true)
    setTimeout(playAudio, 500)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [stopMusic, playSound, audioMuted])

  const handleAudioEnded = () => {
    setAudioPlaying(false)
    console.log("Champions League audio ended")
  }

  const handleAudioError = (e: any) => {
    console.error("Audio error:", e)
    setAudioPlaying(false)
    playSound("celebration")
  }

  const handleMuteToggle = () => {
    setAudioMuted(!audioMuted)
    if (audioRef.current) {
      if (audioMuted) {
        audioRef.current.volume = 0.8
        audioRef.current.play().catch(console.error)
        setAudioPlaying(true)
      } else {
        audioRef.current.pause()
        setAudioPlaying(false)
      }
    }
  }

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
    const shareUrl = window.location.origin

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
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
        alert("Link copied to clipboard! Share it with your friends so they can create their own FPL Manager Moments!")
      })
    }
    playSound("coin")
  }

  return (
    <div className="safe-screen-height safe-screen-width relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/stadium-background.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onLoadStart={() => console.log("Audio loading started")}
        onCanPlay={() => console.log("Audio can play")}
      >
        <source src="/sounds/champions-league-8-bit.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={handleMuteToggle}
          className="pixel-button p-2 bg-white bg-opacity-90 hover:bg-opacity-100"
          style={{ width: "clamp(28px, 6vw + 0.3rem, 44px)", height: "clamp(28px, 6vw + 0.3rem, 44px)" }}
        >
          {audioMuted ? <VolumeX className="icon-responsive-sm" /> : <Volume2 className="icon-responsive-sm" />}
        </Button>
      </div>

      {audioPlaying && !audioMuted && (
        <div className="absolute top-4 left-4 z-50 bg-green-500 text-white p-responsive-xs rounded text-small">
          🎵 Playing
        </div>
      )}

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -100,
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== "undefined" ? window.innerHeight : 600) + 100,
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
              className="pixel-card p-responsive-lg container-responsive-sm bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-body text-contrast-dark">{selectedAchievement}</h3>
                <Button
                  onClick={closeAchievementModal}
                  className="pixel-button p-1"
                  style={{ width: "clamp(20px, 5vw + 0.2rem, 28px)", height: "clamp(20px, 5vw + 0.2rem, 28px)" }}
                >
                  <X className="icon-responsive-sm" />
                </Button>
              </div>
              <p className="font-body text-small text-contrast-dark leading-relaxed">
                {achievementExplanations[selectedAchievement] || "Achievement unlocked!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="pixel-card p-responsive-lg container-responsive-sm bg-white overflow-y-auto"
              style={{ maxHeight: "clamp(300px, 70vh, 500px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-responsive-xs">
                  <Award className="icon-responsive-sm text-yellow-600" />
                  <h3 className="font-display text-body text-contrast-dark">ALL BADGES EARNED</h3>
                </div>
                <Button
                  onClick={closeAllBadgesModal}
                  className="pixel-button p-1"
                  style={{ width: "clamp(20px, 5vw + 0.2rem, 28px)", height: "clamp(20px, 5vw + 0.2rem, 28px)" }}
                >
                  <X className="icon-responsive-sm" />
                </Button>
              </div>

              <div className="space-responsive-sm">
                {data.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAchievementClick(badge)}
                    className="pixel-card p-responsive-sm bg-orange-100 cursor-pointer hover:bg-orange-200 transition-colors"
                  >
                    <div className="font-display text-body text-contrast-dark mb-1">{badge}</div>
                    <div className="font-body text-small text-contrast-dark leading-relaxed">
                      {achievementExplanations[badge] || "Achievement unlocked!"}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-4">
                <div className="font-body text-small text-contrast-dark opacity-70">
                  You earned {data.badges.length} badge{data.badges.length !== 1 ? "s" : ""} this season!
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Optimized for In-App Browsers */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-start min-h-full p-responsive-sm space-responsive-sm py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full container-responsive-sm"
          >
            <div className="pixel-card p-responsive-lg bg-gradient-to-b from-yellow-200 to-yellow-100 relative overflow-hidden">
              <div className="text-center m-responsive-sm relative z-10">
                <div className="text-2xl sm:text-4xl mb-2">🏆</div>
                <h1 className="font-display text-small text-contrast-dark mb-1">YOUR SEASON TITLE IS</h1>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-red-500 mr-2">🔥</span>
                  <div className="font-display text-small text-contrast-dark text-center">{data.managerTitle}</div>
                </div>
              </div>

              <div className="text-center m-responsive-sm relative z-10 space-responsive-xs">
                <div className="pixel-card p-responsive-sm bg-white">
                  <div className="font-display text-small text-contrast-dark">{data.managerName}</div>
                </div>
                <div className="pixel-card p-responsive-xs bg-white">
                  <div className="font-display text-micro text-contrast-dark">Team: {data.teamName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 space-responsive-sm m-responsive-sm relative z-10">
                <div className="pixel-card p-responsive-sm text-center bg-white">
                  <div className="font-display text-micro text-contrast-dark">{data.totalPoints}</div>
                  <div className="font-body text-nano text-contrast-dark">POINTS</div>
                </div>
                <div className="pixel-card p-responsive-sm text-center bg-white">
                  <div className="font-display text-micro text-contrast-dark">{formatRank(data.overallRank)}</div>
                  <div className="font-body text-nano text-contrast-dark">RANK</div>
                </div>
                <div className="pixel-card p-responsive-sm text-center bg-white">
                  <div className="font-display text-micro text-contrast-dark">{data.bestGw?.points}</div>
                  <div className="font-body text-nano text-contrast-dark">BEST GW</div>
                </div>
                <div
                  className="pixel-card p-responsive-sm text-center bg-white cursor-pointer hover:bg-yellow-50 hover:scale-105 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-yellow-400 relative overflow-hidden"
                  onClick={handleShowAllBadges}
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="font-display text-micro text-contrast-dark relative z-10">{data.badges.length}</div>
                  <div className="font-body text-nano text-contrast-dark relative z-10">BADGES</div>
                  <div className="absolute bottom-1 right-1 text-yellow-500 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs">👆</span>
                  </div>
                </div>
              </div>

              <div className="space-responsive-xs m-responsive-sm relative z-10">
                {data.badges.slice(0, 2).map((badge, index) => (
                  <div
                    key={badge}
                    onClick={() => handleAchievementClick(badge)}
                    className="pixel-card p-responsive-sm text-center bg-white cursor-pointer hover:bg-yellow-50 hover:scale-105 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-yellow-400 relative overflow-hidden"
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="font-display text-nano text-contrast-dark text-ellipsis relative z-10">{badge}</div>
                    <div className="absolute bottom-1 right-1 text-yellow-500 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs">👆</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center relative z-10">
                <div className="font-body text-nano text-contrast-dark">SHARE YOUR MOMENT</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-full container-responsive-sm space-responsive-xs"
          >
            <div className="grid grid-cols-2 space-responsive-xs">
              <Button
                onClick={shareToWhatsApp}
                className="cta-button-secondary text-white bg-green-500 hover:bg-green-600 border-2 border-green-700"
              >
                <span className="text-button font-bold">WHATSAPP</span>
              </Button>
              <Button
                onClick={shareToInstagram}
                className="cta-button-secondary text-white bg-purple-500 hover:bg-purple-600 border-2 border-purple-700"
              >
                <span className="text-button font-bold">INSTAGRAM</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 space-responsive-xs">
              <Button
                onClick={shareToFacebook}
                className="cta-button-secondary text-white bg-blue-500 hover:bg-blue-600 border-2 border-blue-700"
              >
                <span className="text-button font-bold">FACEBOOK</span>
              </Button>
              <Button
                onClick={shareGeneric}
                className="cta-button-secondary text-white bg-gray-500 hover:bg-gray-600 border-2 border-gray-700"
              >
                <span className="text-button font-bold">INVITE FRIENDS</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 space-responsive-xs">
              <Button onClick={onBack} className="cta-button-secondary text-contrast-dark">
                <span className="text-button font-bold">BACK</span>
              </Button>
              <Button onClick={onRestart} className="cta-button-secondary text-contrast-dark">
                <span className="text-button font-bold">🔄 RESTART</span>
              </Button>
            </div>
          </motion.div>

          {/* Extra spacing for mobile scrolling */}
          <div style={{ height: "clamp(12px, 3vw + 0.2rem, 24px)" }}></div>
        </div>
      </div>
    </div>
  )
}
