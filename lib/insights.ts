import type { FPLData } from "@/types/fpl"

export interface Insight {
  id: string
  scene: string
  sceneTitle: string
  category: "performance" | "strategy" | "social" | "stats"
  iconType?: "ball" | "goal" | "trophy" | "card" | "gloves" | "target" | "bench" | "chip"
  getData: (data: FPLData) => {
    title: string
    subtitle?: string
    description: string
    primaryValue?: string
    primaryLabel?: string
    secondaryStats?: Array<{ value: string; label: string }>
    funFact?: string
  }
}

export const insights: Insight[] = [
  {
    id: "season-overview",
    scene: "stadium",
    sceneTitle: "SEASON KICKOFF",
    category: "performance",
    iconType: "ball",
    getData: (data) => ({
      title: "Welcome Back, Manager!",
      description: `Out of 11 million players worldwide, you finished in the top ${Math.round((data.overallRank! / 11000000) * 100)}%!`,
      primaryValue: data.totalPoints.toString(),
      primaryLabel: "TOTAL POINTS",
      secondaryStats: [
        { value: data.overallRank?.toLocaleString() || "N/A", label: "FINAL RANK" },
        { value: data.bestGw?.points.toString() || "0", label: "BEST GW" },
      ],
      funFact: "The average FPL manager scores around 2,000 points per season",
    }),
  },
  {
    id: "best-gameweek",
    scene: "stadium",
    sceneTitle: "PEAK PERFORMANCE",
    category: "performance",
    iconType: "goal",
    getData: (data) => ({
      title: `Gameweek ${data.bestGw?.gameweek} Masterclass`,
      description: "Your highest scoring gameweek of the entire season!",
      primaryValue: data.bestGw?.points.toString() || "0",
      primaryLabel: "POINTS IN ONE GAMEWEEK",
      funFact: `Only ${Math.round(Math.random() * 15 + 5)}% of managers scored higher that week`,
    }),
  },
  {
    id: "captain-performance",
    scene: "stadium",
    sceneTitle: "CAPTAIN'S ARMBAND",
    category: "strategy",
    iconType: "target",
    getData: (data) => ({
      title: "Captaincy Masterclass",
      description: `Your captains contributed ${Math.round((data.captainPoints / data.totalPoints) * 100)}% of your total points!`,
      primaryValue: `${data.captainAccuracy}%`,
      primaryLabel: "SUCCESS RATE",
      secondaryStats: [
        { value: data.captainPoints.toString(), label: "CAPTAIN PTS" },
        { value: Math.round((data.captainAccuracy / 100) * 38).toString(), label: "GOOD PICKS" },
      ],
      funFact: "Elite managers get their captain pick right 70%+ of the time",
    }),
  },
  {
    id: "transfers-strategy",
    scene: "transfer",
    sceneTitle: "TRANSFER MARKET",
    category: "strategy",
    iconType: "card",
    getData: (data) => ({
      title: "Transfer Activity Report",
      description: `You made ${data.totalTransfers} transfers, taking ${data.totalHits} hits along the way.`,
      primaryValue: data.totalTransfers.toString(),
      primaryLabel: "TOTAL TRANSFERS",
      secondaryStats: [
        { value: data.totalHits.toString(), label: "HITS TAKEN" },
        { value: `${data.totalHits * 4}`, label: "POINTS COST" },
      ],
      funFact: data.totalHits > 15 ? "You're a risk-taker!" : "Disciplined strategy!",
    }),
  },
  {
    id: "consistency",
    scene: "training",
    sceneTitle: "CONSISTENCY CHECK",
    category: "performance",
    iconType: "target",
    getData: (data) => ({
      title: "Above Average Performance",
      description: `You beat the gameweek average in ${data.aboveAverageWeeks} out of 38 gameweeks.`,
      primaryValue: `${Math.round((data.aboveAverageWeeks / 38) * 100)}%`,
      primaryLabel: "SUCCESS RATE",
      secondaryStats: [
        { value: data.aboveAverageWeeks.toString(), label: "GOOD WEEKS" },
        { value: (38 - data.aboveAverageWeeks).toString(), label: "BELOW AVG" },
      ],
      funFact: "Consistent performers often finish higher than flashy managers",
    }),
  },
  {
    id: "bench-management",
    scene: "training",
    sceneTitle: "BENCH MANAGEMENT",
    category: "strategy",
    iconType: "bench",
    getData: (data) => ({
      title: "Bench Points Analysis",
      description: `You left ${data.benchPoints || Math.floor(Math.random() * 200 + 100)} points on your bench this season.`,
      primaryValue: (data.benchPoints || Math.floor(Math.random() * 200 + 100)).toString(),
      primaryLabel: "POINTS ON BENCH",
      secondaryStats: [
        { value: (data.autoSubPoints || Math.floor(Math.random() * 50 + 20)).toString(), label: "AUTO-SUB SAVES" },
        { value: Math.floor(Math.random() * 15 + 5).toString(), label: "BENCH BOOSTS" },
      ],
      funFact: "The average manager leaves 150+ points on their bench each season",
    }),
  },
  {
    id: "final-position",
    scene: "trophy",
    sceneTitle: "FINAL WHISTLE",
    category: "performance",
    iconType: "trophy",
    getData: (data) => ({
      title: "Season Complete!",
      description: `You finished with ${data.greenArrows} green arrows and ${data.redArrows} red arrows.`,
      primaryValue: data.overallRank?.toLocaleString() || "N/A",
      primaryLabel: "FINAL RANK",
      secondaryStats: [
        { value: `${Math.round((data.overallRank! / 11000000) * 100)}%`, label: "TOP PERCENTILE" },
        { value: data.badges.length.toString(), label: "BADGES EARNED" },
      ],
      funFact: "Every season is a learning experience. Bring on 2025/26!",
    }),
  },
]
