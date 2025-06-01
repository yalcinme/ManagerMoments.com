"use client"

interface ParallaxBackgroundProps {
  scene: string
}

export default function ParallaxBackground({ scene }: ParallaxBackgroundProps) {
  const getSceneConfig = (sceneName: string) => {
    // All scenes now use green backgrounds with different shades
    switch (sceneName) {
      case "intro":
        return {
          bgColor: "bg-green-600",
        }
      case "kickoff":
        return {
          bgColor: "bg-green-700",
        }
      case "transfers":
        return {
          bgColor: "bg-green-800",
        }
      case "performance":
        return {
          bgColor: "bg-green-900",
        }
      case "finale":
        return {
          bgColor: "bg-green-500",
        }
      default:
        return {
          bgColor: "bg-green-600",
        }
    }
  }

  const config = getSceneConfig(scene)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background color layer */}
      <div className={`absolute inset-0 ${config.bgColor}`} />
    </div>
  )
}
