"use client"

interface RetroIconProps {
  type: "ball" | "target" | "gloves" | "up-arrow" | "down-arrow" | "trophy" | "brain" | "league" | "boost" | "bench"
  size?: "small" | "medium" | "large"
  animated?: boolean
}

export default function RetroIcon({ type, size = "medium", animated = false }: RetroIconProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  const animationClass = animated ? (type === "ball" ? "bounce-pixel" : "shake-pixel") : ""

  const getIcon = () => {
    switch (type) {
      case "ball":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="white" stroke="#000" strokeWidth="2" />
            <rect x="4" y="4" width="24" height="24" fill="white" />
            <rect x="8" y="8" width="16" height="16" fill="none" stroke="#000" strokeWidth="2" />
            <rect x="12" y="12" width="8" height="8" fill="none" stroke="#000" strokeWidth="2" />
            <rect x="14" y="6" width="4" height="20" fill="none" stroke="#000" strokeWidth="1" />
            <rect x="6" y="14" width="20" height="4" fill="none" stroke="#000" strokeWidth="1" />
          </svg>
        )
      case "target":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="white" stroke="#000" strokeWidth="2" />
            <rect x="4" y="4" width="24" height="24" fill="white" />
            <rect x="8" y="8" width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" />
            <rect x="12" y="12" width="8" height="8" fill="#ef4444" />
            <rect x="14" y="14" width="4" height="4" fill="white" />
          </svg>
        )
      case "gloves":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#22c55e" stroke="#000" strokeWidth="2" />
            <rect x="4" y="8" width="8" height="20" fill="#16a34a" stroke="#000" strokeWidth="1" />
            <rect x="20" y="8" width="8" height="20" fill="#16a34a" stroke="#000" strokeWidth="1" />
            <rect x="12" y="12" width="8" height="16" fill="#16a34a" stroke="#000" strokeWidth="1" />
            <rect x="6" y="4" width="4" height="8" fill="#16a34a" stroke="#000" strokeWidth="1" />
            <rect x="22" y="4" width="4" height="8" fill="#16a34a" stroke="#000" strokeWidth="1" />
          </svg>
        )
      case "up-arrow":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#22c55e" stroke="#000" strokeWidth="2" />
            <rect x="14" y="4" width="4" height="24" fill="#16a34a" />
            <rect x="10" y="8" width="12" height="4" fill="#16a34a" />
            <rect x="12" y="6" width="8" height="4" fill="#16a34a" />
          </svg>
        )
      case "down-arrow":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#ef4444" stroke="#000" strokeWidth="2" />
            <rect x="14" y="4" width="4" height="24" fill="#dc2626" />
            <rect x="10" y="20" width="12" height="4" fill="#dc2626" />
            <rect x="12" y="22" width="8" height="4" fill="#dc2626" />
          </svg>
        )
      case "trophy":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#facc15" stroke="#000" strokeWidth="2" />
            <rect x="8" y="6" width="16" height="12" fill="#eab308" stroke="#000" strokeWidth="1" />
            <rect x="4" y="10" width="4" height="4" fill="#eab308" stroke="#000" strokeWidth="1" />
            <rect x="24" y="10" width="4" height="4" fill="#eab308" stroke="#000" strokeWidth="1" />
            <rect x="12" y="18" width="8" height="4" fill="#eab308" stroke="#000" strokeWidth="1" />
            <rect x="10" y="22" width="12" height="4" fill="#eab308" stroke="#000" strokeWidth="1" />
            <rect x="14" y="26" width="4" height="4" fill="#eab308" stroke="#000" strokeWidth="1" />
          </svg>
        )
      case "brain":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#a855f7" stroke="#000" strokeWidth="2" />
            <rect x="6" y="8" width="20" height="16" fill="#9333ea" stroke="#000" strokeWidth="1" />
            <rect x="8" y="6" width="16" height="4" fill="#9333ea" stroke="#000" strokeWidth="1" />
            <rect x="10" y="10" width="4" height="4" fill="#7c3aed" />
            <rect x="18" y="10" width="4" height="4" fill="#7c3aed" />
            <rect x="12" y="16" width="8" height="4" fill="#7c3aed" />
          </svg>
        )
      case "league":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#0ea5e9" stroke="#000" strokeWidth="2" />
            <rect x="4" y="8" width="8" height="8" fill="#0284c7" stroke="#000" strokeWidth="1" />
            <rect x="20" y="8" width="8" height="8" fill="#0284c7" stroke="#000" strokeWidth="1" />
            <rect x="6" y="6" width="4" height="4" fill="#0284c7" />
            <rect x="22" y="6" width="4" height="4" fill="#0284c7" />
            <rect x="8" y="18" width="16" height="8" fill="#0284c7" stroke="#000" strokeWidth="1" />
          </svg>
        )
      case "boost":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#f97316" stroke="#000" strokeWidth="2" />
            <rect x="12" y="4" width="8" height="24" fill="#ea580c" stroke="#000" strokeWidth="1" />
            <rect x="8" y="8" width="16" height="4" fill="#ea580c" />
            <rect x="6" y="12" width="20" height="4" fill="#ea580c" />
            <rect x="4" y="16" width="24" height="4" fill="#ea580c" />
            <rect x="8" y="20" width="16" height="4" fill="#ea580c" />
          </svg>
        )
      case "bench":
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full pixel-perfect">
            <rect x="0" y="0" width="32" height="32" fill="#a3a3a3" stroke="#000" strokeWidth="2" />
            <rect x="4" y="16" width="24" height="8" fill="#737373" stroke="#000" strokeWidth="1" />
            <rect x="6" y="24" width="4" height="6" fill="#737373" stroke="#000" strokeWidth="1" />
            <rect x="22" y="24" width="4" height="6" fill="#737373" stroke="#000" strokeWidth="1" />
            <rect x="8" y="12" width="16" height="4" fill="#737373" stroke="#000" strokeWidth="1" />
          </svg>
        )
      default:
        return <div className="w-full h-full bg-gray-400 border-2 border-black"></div>
    }
  }

  return <div className={`${sizeClasses[size]} ${animationClass}`}>{getIcon()}</div>
}
