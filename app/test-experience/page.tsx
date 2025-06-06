"use client"

import { useState } from "react"
import { FIFA25InsightCard } from "@/components/fifa25-insight-card"
import { FIFA25FinalSummary } from "@/components/fifa25-final-summary"
import { insights } from "@/lib/insights"

// Demo data for testing
const demoData = {
  managerName: "Test Manager",
  teamName: "Test FC",
  totalPoints: 2156,
  overallRank: 125000,
  gameweeks: [],
  captainStats: {
    totalPoints: 592,
    averagePoints: 15.6,
    bestChoice: { name: "Erling Haaland", points: 24, gameweek: 12 },
    worstChoice: { name: "Mohamed Salah", points: 2, gameweek: 8 },
    comparisonToTop10k: 0.2,
  },
  transferStats: {
    totalTransfers: 47,
    freeTransfers: 38,
    pointsDeducted: 36,
    bestTransferIn: { name: "Cole Palmer", points: 89 },
    worstTransferOut: { name: "Bukayo Saka", pointsMissed: 67 },
  },
  benchStats: {
    totalPointsOnBench: 234,
    averagePerGameweek: 6.2,
    biggestMiss: { name: "Joao Pedro", points: 15, gameweek: 15 },
  },
  bestGameweek: {
    gameweek: 12,
    points: 89,
    rank: 45000,
  },
  mvpPlayer: {
    name: "Erling Haaland",
    totalPoints: 234,
    appearances: 32,
    captainedTimes: 15,
  },
  comparisonToAverage: {
    totalPoints: 2156,
    averagePoints: 1987,
    difference: 169,
    percentile: 78,
  },
}

export default function TestExperience() {
  const [currentInsight, setCurrentInsight] = useState(0)
  const [showFinal, setShowFinal] = useState(false)

  if (showFinal) {
    return (
      <FIFA25FinalSummary
        data={demoData}
        onRestart={() => {
          setShowFinal(false)
          setCurrentInsight(0)
        }}
      />
    )
  }

  const insight = insights[currentInsight]

  return (
    <div className="min-h-screen bg-black">
      <FIFA25InsightCard
        insight={insight}
        data={demoData}
        onNext={() => {
          if (currentInsight < insights.length - 1) {
            setCurrentInsight(currentInsight + 1)
          } else {
            setShowFinal(true)
          }
        }}
        onPrev={() => {
          if (currentInsight > 0) {
            setCurrentInsight(currentInsight - 1)
          }
        }}
        currentIndex={currentInsight + 1}
        totalSections={insights.length + 1}
      />
    </div>
  )
}
