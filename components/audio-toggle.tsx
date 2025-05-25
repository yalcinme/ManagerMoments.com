"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"

interface AudioToggleProps {
  className?: string
}

export default function AudioToggle({ className }: AudioToggleProps) {
  const { isMuted, toggleMute } = useAudio()

  return (
    <div className={className}>
      <Button onClick={toggleMute} size="sm" className="modern-button w-10 h-10 p-0 rounded-xl">
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </Button>
    </div>
  )
}
