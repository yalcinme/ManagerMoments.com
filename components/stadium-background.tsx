"use client"

import { motion } from "framer-motion"

interface StadiumBackgroundProps {
  scene?: string
}

export default function StadiumBackground({ scene = "default" }: StadiumBackgroundProps) {
  const getSceneConfig = () => {
    switch (scene) {
      case "kickoff":
        return {
          sky: "from-blue-900 via-blue-800 to-green-900",
          lights: true,
          crowd: true,
        }
      case "transfers":
        return {
          sky: "from-purple-900 via-indigo-800 to-slate-900",
          buildings: true,
        }
      case "performance":
        return {
          sky: "from-slate-900 via-emerald-900 to-green-900",
          stars: true,
          lights: true,
        }
      case "finale":
        return {
          sky: "from-orange-900 via-red-800 to-purple-900",
          fireworks: true,
          lights: true,
        }
      default:
        return {
          sky: "from-slate-900 via-blue-900 to-green-900",
          lights: true,
        }
    }
  }

  const config = getSceneConfig()

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${config.sky}`} />

      {/* Stadium structure */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Main stadium */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-slate-800 to-slate-700 border-t-4 border-slate-600" />

        {/* Stadium tiers */}
        <div className="absolute bottom-32 md:bottom-40 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-slate-700 to-slate-600 border-t-2 border-slate-500" />
        <div className="absolute bottom-48 md:bottom-60 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-slate-600 to-slate-500 border-t-2 border-slate-400" />
      </div>

      {/* Stadium lights */}
      {config.lights && (
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
              className="absolute w-4 h-4 md:w-6 md:h-6 bg-yellow-300 rounded-full"
              style={{
                top: "20%",
                left: `${15 + i * 12}%`,
                boxShadow: "0 0 20px rgba(253, 224, 71, 0.8)",
              }}
            />
          ))}
        </div>
      )}

      {/* Crowd */}
      {config.crowd && (
        <div className="absolute bottom-32 md:bottom-40 left-0 right-0 h-16 md:h-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 md:w-2 h-3 md:h-4 bg-slate-400 rounded-t-full"
              style={{
                left: `${10 + i * 5}%`,
                bottom: Math.random() * 10,
              }}
            />
          ))}
        </div>
      )}

      {/* Buildings (for transfer scene) */}
      {config.buildings && (
        <div className="absolute bottom-0 left-0 right-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-slate-700 border-2 border-slate-500"
              style={{
                left: `${15 + i * 15}%`,
                width: "40px",
                height: `${60 + i * 20}px`,
              }}
            >
              {/* Building windows */}
              <div className="absolute top-2 left-1 w-2 h-2 bg-yellow-300/60 rounded-sm" />
              <div className="absolute top-2 right-1 w-2 h-2 bg-yellow-300/60 rounded-sm" />
              <div className="absolute top-6 left-1 w-2 h-2 bg-yellow-300/40 rounded-sm" />
              <div className="absolute top-6 right-1 w-2 h-2 bg-yellow-300/40 rounded-sm" />
            </div>
          ))}
        </div>
      )}

      {/* Stars */}
      {config.stars && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
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
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
              className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full"
              style={{
                top: `${20 + Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"][i % 4],
              }}
            />
          ))}
        </div>
      )}

      {/* Pitch */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-green-800 to-green-700 border-t-4 border-green-600">
        {/* Pitch markings */}
        <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 w-1 h-8 md:h-12 bg-white/60" />
        <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 w-12 md:w-16 h-12 md:h-16 border-2 border-white/60 rounded-full" />
      </div>
    </div>
  )
}
