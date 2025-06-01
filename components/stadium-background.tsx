"use client"

interface StadiumBackgroundProps {
  scene?: string
}

export default function StadiumBackground({ scene = "default" }: StadiumBackgroundProps) {
  const getSceneConfig = () => {
    // All scenes now use green backgrounds with different shades
    switch (scene) {
      case "kickoff":
        return {
          bgColor: "bg-green-600",
        }
      case "transfers":
        return {
          bgColor: "bg-green-700",
        }
      case "performance":
        return {
          bgColor: "bg-green-800",
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

  const config = getSceneConfig()

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Green background */}
      <div className={`absolute inset-0 ${config.bgColor}`} />
    </div>
  )
}
