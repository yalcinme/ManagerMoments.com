"use client"

import { Button } from "@/components/ui/button"
import { Pause, Play, SkipForward, Home, Zap, ZapOff } from "lucide-react"

interface GameControlsProps {
  isPaused: boolean
  autoPlay: boolean
  onPause: () => void
  onAutoPlayToggle: () => void
  onSkip: () => void
  onRestart: () => void
  className?: string
}

export default function GameControls({
  isPaused,
  autoPlay,
  onPause,
  onAutoPlayToggle,
  onSkip,
  onRestart,
  className,
}: GameControlsProps) {
  return (
    <div className={className}>
      <div className="flex flex-col space-y-2">
        <Button onClick={onPause} size="sm" className="modern-button w-10 h-10 p-0 rounded-xl">
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </Button>

        <Button
          onClick={onAutoPlayToggle}
          size="sm"
          className={`modern-button w-10 h-10 p-0 rounded-xl ${autoPlay ? "pulse-glow" : ""}`}
        >
          {autoPlay ? <Zap size={14} /> : <ZapOff size={14} />}
        </Button>

        <Button onClick={onSkip} size="sm" className="modern-button w-10 h-10 p-0 rounded-xl">
          <SkipForward size={14} />
        </Button>

        <Button onClick={onRestart} size="sm" className="modern-button w-10 h-10 p-0 rounded-xl">
          <Home size={14} />
        </Button>
      </div>
    </div>
  )
}
