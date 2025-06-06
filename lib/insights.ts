import type { FPLData } from "@/types/fpl"

export interface InsightData {
  primaryValue: string | number
  primaryLabel: string
  description: string
  funFact?: string
  secondaryStats?: Array<{
    value: string | number
    label: string
    trend?: "up" | "down" | "neutral"
  }>
  trend?: "up" | "down" | "neutral"
}

export interface Insight {
  id: string
  title: string
  subtitle: string
  iconType: string
  getData: (data: FPLData) => InsightData
}

export const insights: Insight[] = [
  {
    id: "season-summary",
    title: "Season Overview",
    subtitle: "Your 2024/25 FPL Journey",
    iconType: "trophy",
    getData: (data: FPLData): InsightData => {
      const percentile = data.overallRank ? Math.round((data.overallRank / 11000000) * 100) : 50
      return {
        primaryValue: data.totalPoints?.toLocaleString() || "0",
        primaryLabel: "Total Points",
        description: `Out of 11 million managers, you finished in the top ${percentile}% with ${data.totalPoints} points. ${
          percentile <= 10
            ? "Outstanding performance!"
            : percentile <= 25
              ? "Great season!"
              : percentile <= 50
                ? "Solid effort!"
                : "Room for improvement next season!"
        }`,
        funFact: `The average FPL manager scored around 2,100 points this season.`,
        secondaryStats: [
          { value: data.overallRank?.toLocaleString() || "N/A", label: "Final Rank" },
          { value: `${percentile}%`, label: "Top Percentile" },
          { value: Math.round(data.averagePointsPerGW || 0), label: "Avg Per GW" },
          { value: data.greenArrows || 0, label: "Green Arrows" },
        ],
      }
    },
  },
  {
    id: "captain-performance",
    title: "Captain Masterclass",
    subtitle: "Your Armband Decisions",
    iconType: "crown",
    getData: (data: FPLData): InsightData => {
      const successRate = 100 - (data.captainPerformance?.failRate || 25)
      return {
        primaryValue: `${successRate}%`,
        primaryLabel: "Captain Success Rate",
        description: `Your captains earned ${data.captainPerformance?.totalPoints || 0} points this season, averaging ${data.captainPerformance?.averagePoints || 0} points per gameweek. ${
          successRate >= 75
            ? "Excellent captaincy!"
            : successRate >= 60
              ? "Good decision making!"
              : "Consider more consistent captain choices."
        }`,
        funFact: `Top 10k managers averaged ${data.comparisons?.captainAvgVsTop10k?.top10k || 15.4} captain points per gameweek.`,
        secondaryStats: [
          { value: data.captainPerformance?.totalPoints || 0, label: "Captain Points" },
          { value: data.captainPerformance?.averagePoints || 0, label: "Avg Per GW" },
          { value: data.captainPerformance?.bestCaptain?.name || "N/A", label: "Best Captain" },
          { value: data.captainPerformance?.bestCaptain?.points || 0, label: "Best Score" },
        ],
      }
    },
  },
  {
    id: "transfer-activity",
    title: "Transfer Market",
    subtitle: "Your Squad Tinkering",
    iconType: "zap",
    getData: (data: FPLData): InsightData => {
      const transferCount = data.transferActivity?.totalTransfers || 0
      const hitCount = data.transferActivity?.totalHits || 0
      return {
        primaryValue: transferCount,
        primaryLabel: "Total Transfers",
        description: `You made ${transferCount} transfers this season, taking ${hitCount} hits for ${hitCount * 4} points. ${
          transferCount <= 30
            ? "Conservative approach!"
            : transferCount <= 50
              ? "Balanced strategy!"
              : "Very active in the market!"
        } Your best signing was ${data.transferActivity?.bestTransferIn?.name || "unknown"}.`,
        funFact: `The average manager makes 47 transfers per season.`,
        secondaryStats: [
          { value: hitCount, label: "Point Hits" },
          { value: hitCount * 4, label: "Points Cost" },
          { value: data.transferActivity?.bestTransferIn?.name || "N/A", label: "Best Signing" },
          { value: data.transferActivity?.bestTransferIn?.pointsGained || 0, label: "Points Gained" },
        ],
      }
    },
  },
  {
    id: "bench-analysis",
    title: "Bench Management",
    subtitle: "Points Left Behind",
    iconType: "users",
    getData: (data: FPLData): InsightData => {
      const benchPoints = data.benchAnalysis?.totalBenchPoints || 0
      const avgPerGW = data.benchAnalysis?.averagePerGW || 0
      return {
        primaryValue: benchPoints,
        primaryLabel: "Bench Points",
        description: `Your bench scored ${benchPoints} points this season (${avgPerGW} per gameweek). ${
          benchPoints <= 150
            ? "Excellent team selection!"
            : benchPoints <= 200
              ? "Good bench management!"
              : "Consider your starting XI more carefully."
        } Your worst bench call was leaving ${data.benchAnalysis?.worstBenchCall?.playerName || "a player"} on the bench.`,
        funFact: `The average manager leaves 215 points on the bench each season.`,
        secondaryStats: [
          { value: avgPerGW, label: "Avg Per GW" },
          { value: data.benchAnalysis?.worstBenchCall?.points || 0, label: "Worst Miss" },
          { value: data.benchAnalysis?.worstBenchCall?.playerName || "N/A", label: "Player" },
          { value: data.benchAnalysis?.benchBoostImpact || 0, label: "BB Impact" },
        ],
      }
    },
  },
  {
    id: "biggest-gameweek",
    title: "Peak Performance",
    subtitle: "Your Best Gameweek",
    iconType: "star",
    getData: (data: FPLData): InsightData => {
      const bestGW = data.bestGw
      return {
        primaryValue: bestGW?.points || 0,
        primaryLabel: `Gameweek ${bestGW?.gameweek || 1}`,
        description: `Your highest score was ${bestGW?.points || 0} points in Gameweek ${bestGW?.gameweek || 1}. ${
          (bestGW?.points || 0) >= 100
            ? "Triple digits - incredible!"
            : (bestGW?.points || 0) >= 80
              ? "Excellent gameweek!"
              : "A solid performance!"
        } Your top contributors were ${bestGW?.topContributors?.map((c) => c.name).join(", ") || "your key players"}.`,
        funFact: `Only 5% of managers score 100+ points in a single gameweek.`,
        secondaryStats: [
          { value: bestGW?.topContributors?.[0]?.name || "N/A", label: "Top Scorer" },
          { value: bestGW?.topContributors?.[0]?.points || 0, label: "Points" },
          { value: bestGW?.topContributors?.find((c) => c.isCaptain)?.name || "N/A", label: "Captain" },
          { value: bestGW?.topContributors?.find((c) => c.isCaptain)?.points || 0, label: "Captain Pts" },
        ],
      }
    },
  },
  {
    id: "one-got-away",
    title: "The One That Got Away",
    subtitle: "Missed Opportunities",
    iconType: "target",
    getData: (data: FPLData): InsightData => {
      const missedPlayer = data.oneGotAway
      return {
        primaryValue: missedPlayer?.seasonTotal || 0,
        primaryLabel: `${missedPlayer?.playerName || "Unknown Player"}`,
        description: `${missedPlayer?.playerName || "A top player"} scored ${missedPlayer?.seasonTotal || 0} points this season but never made it into your squad. ${
          (missedPlayer?.seasonTotal || 0) >= 200
            ? "That's a lot of missed points!"
            : "Could have been a valuable addition!"
        } Their best gameweek was ${missedPlayer?.pointsMissed || 0} points in GW${missedPlayer?.gameweek || 1}.`,
        funFact: `Every manager misses out on at least one premium player each season.`,
        secondaryStats: [
          { value: missedPlayer?.pointsMissed || 0, label: "Best GW" },
          { value: `GW${missedPlayer?.gameweek || 1}`, label: "When" },
          { value: Math.round((missedPlayer?.seasonTotal || 0) / 38), label: "Avg Per GW" },
          { value: "Never owned", label: "Ownership" },
        ],
      }
    },
  },
  {
    id: "you-vs-game",
    title: "You vs The Game",
    subtitle: "How You Compare",
    iconType: "chart",
    getData: (data: FPLData): InsightData => {
      const userBench = data.comparisons?.benchPointsVsAverage?.user || 0
      const avgBench = data.comparisons?.benchPointsVsAverage?.gameAverage || 215
      const benchDiff = avgBench - userBench
      return {
        primaryValue: benchDiff > 0 ? `+${benchDiff}` : benchDiff,
        primaryLabel: "vs Average Bench Points",
        description: `Compared to the average manager, you ${
          benchDiff > 0
            ? `saved ${benchDiff} points with better team selection`
            : `left ${Math.abs(benchDiff)} more points on the bench`
        }. Your captain averaged ${data.comparisons?.captainAvgVsTop10k?.user || 0} points vs ${data.comparisons?.captainAvgVsTop10k?.top10k || 15.4} for top 10k managers.`,
        funFact: `Your most trusted player was ${data.comparisons?.mostTrustedVsGlobal?.user || "unknown"}, while globally it was ${data.comparisons?.mostTrustedVsGlobal?.global || "Haaland"}.`,
        secondaryStats: [
          { value: data.comparisons?.transferHitsVsAverage?.user || 0, label: "Your Hits" },
          { value: data.comparisons?.transferHitsVsAverage?.gameAverage || 48, label: "Avg Hits" },
          { value: data.comparisons?.captainAvgVsTop10k?.user || 0, label: "Your Capt Avg" },
          { value: data.comparisons?.captainAvgVsTop10k?.top10k || 15.4, label: "Top 10k Avg" },
        ],
      }
    },
  },
]

// FIFA-style insights with background images
export const fifaInsights = [
  {
    id: "season-summary",
    title: "Season Kickoff",
    description: "Your FPL journey begins",
    backgroundImage: "/images/fifa-season-kickoff.png",
    getData: (data: FPLData) => ({
      totalPoints: data.totalPoints,
      rank: data.overallRank,
      average: data.averagePointsPerGW,
      greenArrows: data.greenArrows,
    }),
  },
  {
    id: "captain-performance",
    title: "Captain Masterclass",
    description: "Your captaincy decisions",
    backgroundImage: "/images/fifa-captain.png",
    getData: (data: FPLData) => data.captainPerformance,
  },
  {
    id: "transfer-activity",
    title: "Transfer Market",
    description: "Your transfer strategy",
    backgroundImage: "/images/fifa-transfers.png",
    getData: (data: FPLData) => data.transferActivity,
  },
  {
    id: "bench-analysis",
    title: "Bench Management",
    description: "Your bench decisions",
    backgroundImage: "/images/fifa-bench.png",
    getData: (data: FPLData) => data.benchAnalysis,
  },
  {
    id: "biggest-gameweek",
    title: "Peak Performance",
    description: "Your best gameweek",
    backgroundImage: "/images/fifa-best-gameweek.png",
    getData: (data: FPLData) => data.bestGw,
  },
  {
    id: "one-got-away",
    title: "The One That Got Away",
    description: "Missed opportunities",
    backgroundImage: "/images/fifa-consistency-check.png",
    getData: (data: FPLData) => data.oneGotAway,
  },
  {
    id: "you-vs-game",
    title: "You vs The Game",
    description: "How you compare",
    backgroundImage: "/images/fifa-you-vs-game.png",
    getData: (data: FPLData) => data.comparisons,
  },
]
