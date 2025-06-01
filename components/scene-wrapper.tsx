"use client"
import type { ReactNode } from "react"

interface SceneWrapperProps {
  children: ReactNode
  scene: "stadium" | "training" | "trophy" | "transfer"
  className?: string
}

export default function SceneWrapper({ children, scene, className = "" }: SceneWrapperProps) {
  const getSceneBackground = () => {
    switch (scene) {
      case "stadium":
        return (
          <div className="absolute inset-0">
            {/* Simple green background */}
            <div className="absolute inset-0 bg-green-600" />
          </div>
        )

      case "training":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-green-700" />
          </div>
        )

      case "trophy":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-green-500" />
          </div>
        )

      case "transfer":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-green-800" />
          </div>
        )

      default:
        return <div className="absolute inset-0 bg-green-600" />
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {getSceneBackground()}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
