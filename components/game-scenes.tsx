"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FPLData } from "@/types/fpl"
import IntroScene from "./scenes/intro-scene"
import EarlySeasonScene from "./scenes/early-season-scene"
import MidSeasonScene from "./scenes/mid-season-scene"
import LateSeasonScene from "./scenes/late-season-scene"
import FinalScene from "./scenes/final-scene"
import { Button } from "@/components/ui/button"

interface GameScenesProps {
  data: FPLData
  onRestart: () => void
}

const scenes = ["intro", "early-season", "mid-season", "late-season", "final"] as const

type Scene = (typeof scenes)[number]

export default function GameScenes({ data, onRestart }: GameScenesProps) {
  const [currentScene, setCurrentScene] = useState<Scene>("intro")
  const [sceneIndex, setSceneIndex] = useState(0)

  const nextScene = () => {
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex(sceneIndex + 1)
      setCurrentScene(scenes[sceneIndex + 1])
    }
  }

  const renderScene = () => {
    switch (currentScene) {
      case "intro":
        return <IntroScene data={data} onNext={nextScene} />
      case "early-season":
        return <EarlySeasonScene data={data} onNext={nextScene} />
      case "mid-season":
        return <MidSeasonScene data={data} onNext={nextScene} />
      case "late-season":
        return <LateSeasonScene data={data} onNext={nextScene} />
      case "final":
        return <FinalScene data={data} onRestart={onRestart} />
      default:
        return <IntroScene data={data} onNext={nextScene} />
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex space-x-2">
          {scenes.map((scene, index) => (
            <div
              key={scene}
              className={`flex-1 h-2 rounded-full border-2 border-white ${
                index <= sceneIndex ? "bg-yellow-400" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scene content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen"
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>

      {/* Restart button */}
      <Button
        onClick={onRestart}
        className="absolute top-4 right-4 z-20 bg-red-500 hover:bg-red-600 border-2 border-red-700 pixel-text text-white px-4 py-2"
      >
        RESTART
      </Button>
    </div>
  )
}
