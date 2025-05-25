"use client"

export default function CRTEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-10" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20" />

      {/* Subtle glow */}
      <div className="absolute inset-0 bg-retro-green/5 mix-blend-screen" />
    </div>
  )
}
