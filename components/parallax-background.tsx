"use client"

import { motion } from "framer-motion"

interface ParallaxBackgroundProps {
  scene: string
}

export default function ParallaxBackground({ scene }: ParallaxBackgroundProps) {
  const getSceneConfig = (sceneName: string) => {
    switch (sceneName) {
      case "intro":
        return {
          sky: "bg-gradient-to-b from-retro-blue to-retro-purple",
          clouds: true,
          stadium: true,
        }
      case "kickoff":
        return {
          sky: "bg-gradient-to-b from-retro-blue to-retro-green/20",
          clouds: true,
          stadium: true,
        }
      case "transfers":
        return {
          sky: "bg-gradient-to-b from-retro-purple to-retro-dark",
          buildings: true,
        }
      case "performance":
        return {
          sky: "bg-gradient-to-b from-retro-dark to-retro-purple",
          stars: true,
        }
      case "finale":
        return {
          sky: "bg-gradient-to-b from-retro-orange to-retro-red",
          fireworks: true,
        }
      default:
        return {
          sky: "bg-gradient-to-b from-retro-blue to-retro-green/20",
          clouds: true,
        }
    }
  }

  const config = getSceneConfig(scene)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky layer */}
      <div className={`absolute inset-0 ${config.sky}`} />

      {/* Clouds */}
      {config.clouds && (
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ x: [-100, window.innerWidth + 100] }}
              transition={{
                duration: 20 + i * 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute bg-retro-light/20 rounded-full"
              style={{
                top: `${10 + i * 8}%`,
                width: `${60 + i * 20}px`,
                height: `${30 + i * 10}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Stadium */}
      {config.stadium && (
        <div className="absolute bottom-0 left-0 right-0">
          {/* Stadium structure */}
          <div className="absolute bottom-20 left-0 right-0 h-32 bg-retro-light/10 border-t-2 border-retro-light/20" />

          {/* Stadium lights */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
              className="absolute w-4 h-4 bg-retro-orange rounded-full retro-glow"
              style={{
                top: "25%",
                left: `${10 + i * 10}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Buildings */}
      {config.buildings && (
        <div className="absolute bottom-0 left-0 right-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-20 bg-retro-dark-secondary border-2 border-retro-light/30"
              style={{
                left: `${10 + i * 18}%`,
                width: "60px",
                height: `${80 + i * 20}px`,
              }}
            >
              {/* Building windows */}
              <div className="absolute top-4 left-2 w-3 h-3 bg-retro-orange/60" />
              <div className="absolute top-4 right-2 w-3 h-3 bg-retro-orange/60" />
            </div>
          ))}
        </div>
      )}

      {/* Stars */}
      {config.stars && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
              className="absolute w-1 h-1 bg-retro-light rounded-full"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Fireworks */}
      {config.fireworks && (
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
              className="absolute w-6 h-6 rounded-full"
              style={{
                top: `${20 + Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#00ff87", "#ff6b6b", "#4ecdc4", "#feca57"][i % 4],
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
