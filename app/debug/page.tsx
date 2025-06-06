"use client"

import { useState } from "react"
import { FIFA25InsightCard } from "@/components/fifa25-insight-card"
import { insights } from "@/lib/insights"
import type { FPLData } from "@/types/fpl"

// Simple test data
const testData: FPLData = {
  managerName: "Test Manager",
  teamName: "Test Team",
  totalPoints: 2156,
  overallRank: 234567,
  bestRank: 180000,
  averagePointsPerGW: 56.7,
  personalizedIntro: "Test intro",
  bestGw: {
    gameweek: 15,
    points: 89,
    topContributors: [
      { name: "Haaland", points: 26, isCaptain: true },
      { name: "Salah", points: 18, isCaptain: false },
    ],
  },
  worstGw: { gameweek: 8, points: 31 },
  biggestRankJump: { gameweek: 15, places: 45000 },
  biggestRankDrop: { gameweek: 8, places: 25000 },
  greenArrows: 18,
  redArrows: 12,
  captainPerformance: {
    totalPoints: 592,
    averagePoints: 15.6,
    failRate: 23,
    bestCaptain: { name: "Haaland", points: 26, gameweek: 15 },
    worstCaptain: { name: "Bruno", points: 2, gameweek: 8 },
  },
  transferActivity: {
    totalTransfers: 42,
    totalHits: 4,
    bestTransferIn: { name: "Palmer", pointsGained: 67, gameweek: 12 },
  },
  benchAnalysis: {
    totalBenchPoints: 187,
    averagePerGW: 4.9,
    worstBenchCall: { playerName: "Watkins", gameweek: 22, points: 18 },
    benchBoostImpact: 34,
  },
  mvpPlayer: {
    name: "Salah",
    appearances: 35,
    totalPoints: 324,
    percentageOfTeamScore: 15.0,
    pointsPerGame: 9.3,
  },
  formPlayer: { name: "N/A", last6GWPoints: 0, appearances: 0, pointsPerGame: 0 },
  oneGotAway: {
    playerName: "Isak",
    gameweek: 9,
    pointsMissed: 24,
    seasonTotal: 198,
  },
  comparisons: {
    topScorerNeverOwned: { name: "Isak", points: 198 },
    benchPointsVsAverage: { user: 187, gameAverage: 215 },
    transferHitsVsAverage: { user: 16, gameAverage: 48 },
    captainAvgVsTop10k: { user: 15.6, top10k: 15.4 },
    mostTrustedVsGlobal: { user: "Salah", global: "Haaland" },
  },
  chipsUsed: [{ name: "WILDCARD", gameweek: 9 }],
  bestChip: { name: "BENCH BOOST", gameweek: 26, points: 78 },
  managerTitle: "THE SOLID",
  badges: ["CENTURY CLUB"],
  // Legacy fields
  bestEarlyGw: null,
  earlyTransfers: 8,
  totalTransfers: 42,
  totalHits: 4,
  mostTransferredIn: { name: "Haaland", count: 2 },
  aboveAverageWeeks: 22,
  captainPoints: 592,
  captainAccuracy: 77,
  topPlayer: { name: "Salah", points: 324 },
  teamStats: { goals: 144, assists: 108, cleanSheets: 86 },
  favoriteFormation: "3-4-3",
  leagueWins: 2,
  benchPoints: 187,
  autoSubPoints: 34,
  maxTeamValue: 103.2,
  topScorerMissed: { name: "Isak", points: 198 },
  benchPointsComparison: { user: 187, average: 215 },
  transferHitsComparison: { user: 16, gameAverage: 48 },
  captainAvgComparison: { user: 15.6, top10k: 15.4 },
  mostTrustedComparison: { user: "Salah", global: "Haaland" },
}

export default function DebugPage() {
  const [currentInsight, setCurrentInsight] = useState(0)

  const insight = insights[currentInsight]

  return (
    <div className="min-h-screen bg-black">
      <div className="p-4">
        <h1 className="text-white text-2xl mb-4">Debug FIFA25 Cards</h1>
        <div className="flex gap-2 mb-4">
          {insights.map((insight, index) => (
            <button
              key={insight.id}
              onClick={() => setCurrentInsight(index)}
              className={`px-3 py-1 text-sm rounded ${
                index === currentInsight ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300"
              }`}
            >
              {insight.title}
            </button>
          ))}
        </div>
      </div>

      {insight && (
        <FIFA25InsightCard
          insight={insight}
          data={testData}
          onNext={() => setCurrentInsight((prev) => Math.min(prev + 1, insights.length - 1))}
          onPrev={() => setCurrentInsight((prev) => Math.max(prev - 1, 0))}
          currentIndex={currentInsight + 1}
          totalSections={insights.length + 2}
        />
      )}
    </div>
  )
}
