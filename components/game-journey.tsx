"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import LevelTransition from "./level-transition"
import Level1Kickoff from "./levels/level1-kickoff"
import Level2Transfers from "./levels/level2-transfers"
import Level3Performance from "./levels/level3-performance"
import Level4Finale from "./levels/level4-finale"
import TrophyCeremony from "./levels/trophy-ceremony"
import { Button } from "@/components/ui/button"
import { Home, Pause, Play } from "lucide-react"

interface GameJourneyProps {
  data: FPLData
  onRestart: () => void
}

const levels = [
  { id: "transition-1", name: "WORLD 1-1", subtitle: "GAMEWEEK 1 KICKOFF" },
  { id: "level-1", name: "KICKOFF PLAINS", subtitle: "EARLY SEASON" },
  { id: "transition-2", name: "WORLD 1-2", subtitle: "TRANSFER TOWN" },
  { id: "level-2", name: "TRANSFER TOWN", subtitle: "MID-SEASON STRATEGY" },
  { id: "transition-3", name: "WORLD 1-3", subtitle: "STAR ROAD" },
  { id: "level-3", name: "STAR ROAD", subtitle: "PERFORMANCE PEAK" },
  { id: "transition-4", name: "WORLD 1-4", subtitle: "TROPHY CASTLE" },
  { id: "level-4", name: "TROPHY CASTLE", subtitle: "FINAL STRETCH" },
  { id: "ceremony", name: "SEASON COMPLETE", subtitle: "TROPHY CEREMONY" },
]

export default function GameJourney({ data, onRestart }: GameJourneyProps) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const currentLevel = levels[currentLevelIndex]

  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1)
    }
  }

  const prevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1)
    }
  }

  // Touch/click handlers for Instagram-story-style navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Ignore if vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX)) return

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevLevel()
      } else {
        nextLevel()
      }
    }

    setTouchStart(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      prevLevel()
    } else if (x > (2 * width) / 3) {
      nextLevel()
    } else {
      setIsPaused(!isPaused)
    }
  }

  const renderCurrentLevel = () => {
    switch (currentLevel.id) {
      case "transition-1":
      case "transition-2":
      case "transition-3":
      case "transition-4":
        return <LevelTransition level={currentLevel} onComplete={nextLevel} />
      case "level-1":
        return <Level1Kickoff data={data} onNext={nextLevel} isPaused={isPaused} />
      case "level-2":
        return <Level2Transfers data={data} onNext={nextLevel} isPaused={isPaused} />
      case "level-3":
        return <Level3Performance data={data} onNext={nextLevel} isPaused={isPaused} />
      case "level-4":
        return <Level4Finale data={data} onNext={nextLevel} isPaused={isPaused} />
      case "ceremony":
        return <TrophyCeremony data={data} onRestart={onRestart} />
      default:
        return <Level1Kickoff data={data} onNext={nextLevel} isPaused={isPaused} />
    }
  }

  return (
    <div
      className="min-h-screen relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Progress bar */}
      <div className="absolute top-2 left-4 right-4 z-50">
        <div className="flex space-x-1">
          {levels.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                index < currentLevelIndex
                  ? "bg-green-400"
                  : index === currentLevelIndex
                    ? "bg-yellow-400"
                    : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setIsPaused(!isPaused)
          }}
          size="sm"
          className="bg-black bg-opacity-50 hover:bg-opacity-70 border-2 border-white text-white"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onRestart()
          }}
          size="sm"
          className="bg-black bg-opacity-50 hover:bg-opacity-70 border-2 border-white text-white"
        >
          <Home size={16} />
        </Button>
      </div>

      {/* Level indicator */}
      <div className="absolute top-12 left-4 z-40">
        <div className="bg-black bg-opacity-70 rounded-lg px-3 py-1 border-2 border-white">
          <div className="text-white pixel-text text-xs">{currentLevel.name}</div>
        </div>
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black bg-opacity-50 rounded-lg px-4 py-2 border border-white">
          <div className="text-white pixel-text text-xs text-center">
            TAP LEFT/RIGHT TO NAVIGATE • TAP CENTER TO PAUSE
          </div>
        </div>
      </div>

      {/* Current level content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          {renderCurrentLevel()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
