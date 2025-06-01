"use client"

import type React from "react"

import { useState } from "react"
import { BadgeDisplay } from "./badge-display"
import { motion } from "framer-motion"

interface InsightCardProps {
  id: string
  title: string
  description: string
  image: string
  stats: {
    label: string
    value: string
  }[]
  badges?: {
    name: string
    description: string
    icon: string
  }[]
  onNext?: () => void
  onPrev?: () => void
  isActive?: boolean
}

export function InsightCard({
  id,
  title,
  description,
  image,
  stats,
  badges,
  onNext,
  onPrev,
  isActive = true,
}: InsightCardProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && onNext) {
      onNext()
    }

    if (isRightSwipe && onPrev) {
      onPrev()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <motion.div
      className={`w-full max-w-md mx-auto bg-black bg-opacity-80 rounded-xl overflow-hidden shadow-lg border border-gray-700 ${
        isActive ? "block" : "hidden"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <h2 className="absolute bottom-2 left-4 text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="p-4">
        <p className="text-gray-300 mb-4">{description}</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded text-center">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <BadgeDisplay badges={badges} />

        <div className="flex justify-between mt-4 text-sm text-gray-400">
          <button onClick={onPrev} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700" disabled={!onPrev}>
            Previous
          </button>
          <span>{id}</span>
          <button onClick={onNext} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700" disabled={!onNext}>
            Next
          </button>
        </div>
      </div>
    </motion.div>
  )
}
