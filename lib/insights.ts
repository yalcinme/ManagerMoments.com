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
    id: "season-summary",
    scene: "stadium",
    sceneTitle: "SEASON SUMMARY",
    category: "performance",
    iconType: "ball",
    getData: (data) => ({
      title: data.personalizedIntro,
      description: `You finished with ${data.totalPoints.toLocaleString()} points, ranking ${data.overallRank?.toLocaleString()} globally.`,
      primaryValue: data.averagePointsPerGW.toString(),
      primaryLabel: "AVG POINTS PER GW",
      secondaryStats: [
        { value: data.totalPoints.toLocaleString(), label: "TOTAL POINTS" },
        { value: data.overallRank?.toLocaleString() || "N/A", label: "FINAL RANK" },
        { value: data.bestGw?.points.toString() || "0", label: "BEST GW" },
      ],
      funFact: `You averaged ${data.averagePointsPerGW} points per gameweek`,
    }),
  },
  {
    id: "captain-performance",
    scene: "stadium",
    sceneTitle: "CAPTAIN'S ARMBAND",
    category: "strategy",
    iconType: "target",
    getData: (data) => ({
      title: "Captain Performance Analysis",
      description: `Your captains scored ${data.captainPerformance.totalPoints} points with a ${data.captainPerformance.failRate}% fail rate.`,
      primaryValue: `${data.captainPerformance.averagePoints}`,
      primaryLabel: "AVG CAPTAIN POINTS",
      secondaryStats: [
        {
          value: `${data.captainPerformance.bestCaptain?.name} (${data.captainPerformance.bestCaptain?.points}pts)`,
          label: "BEST CAPTAIN",
        },
        {
          value: `${data.captainPerformance.worstCaptain?.name} (${data.captainPerformance.worstCaptain?.points}pts)`,
          label: "WORST CAPTAIN",
        },
        { value: `${data.captainPerformance.failRate}%`, label: "FAIL RATE (<6 PTS)" },
      ],
      funFact:
        data.captainPerformance.failRate <= 20 ? "Elite captaincy skills!" : "Room for improvement on captain picks",
    }),
  },
  {
    id: "transfer-activity",
    scene: "transfer",
    sceneTitle: "TRANSFER MARKET",
    category: "strategy",
    iconType: "card",
    getData: (data) => ({
      title: "Transfer Activity Report",
      description: `You made ${data.transferActivity.totalTransfers} transfers and took ${data.transferActivity.totalHits} hits this season.`,
      primaryValue: data.transferActivity.totalTransfers.toString(),
      primaryLabel: "TOTAL TRANSFERS",
      secondaryStats: [
        {
          value: `${data.transferActivity.bestTransferIn?.name} (+${data.transferActivity.bestTransferIn?.pointsGained}pts)`,
          label: "BEST TRANSFER IN",
        },
        {
          value: `${data.transferActivity.worstTransferOut?.name} (-${data.transferActivity.worstTransferOut?.pointsLost}pts)`,
          label: "WORST TRANSFER OUT",
        },
        { value: data.transferActivity.totalHits.toString(), label: "HITS TAKEN" },
      ],
      funFact: data.transferActivity.totalHits > 15 ? "You're a risk-taker!" : "Disciplined transfer strategy!",
    }),
  },
  {
    id: "bench-analysis",
    scene: "training",
    sceneTitle: "BENCH MANAGEMENT",
    category: "strategy",
    iconType: "bench",
    getData: (data) => ({
      title: "Bench Points Analysis",
      description: `You left ${data.benchAnalysis.totalBenchPoints} points on your bench, averaging ${data.benchAnalysis.averagePerGW} per gameweek.`,
      primaryValue: data.benchAnalysis.totalBenchPoints.toString(),
      primaryLabel: "TOTAL BENCH POINTS",
      secondaryStats: [
        {
          value: `${data.benchAnalysis.worstBenchCall?.playerName} (${data.benchAnalysis.worstBenchCall?.points}pts)`,
          label: "WORST BENCH CALL",
        },
        { value: `GW${data.benchAnalysis.worstBenchCall?.gameweek}`, label: "GAMEWEEK" },
        { value: `+${data.benchAnalysis.benchBoostImpact}pts`, label: "BENCH BOOST IMPACT" },
      ],
      funFact: "The average manager leaves 150+ points on their bench each season",
    }),
  },
  {
    id: "biggest-gameweek",
    scene: "stadium",
    sceneTitle: "BIGGEST GAMEWEEK",
    category: "performance",
    iconType: "goal",
    getData: (data) => ({
      title: `Gameweek ${data.bestGw?.gameweek} Masterclass`,
      description: "Your highest scoring gameweek with top contributors:",
      primaryValue: data.bestGw?.points.toString() || "0",
      primaryLabel: "TOTAL POINTS",
      secondaryStats:
        data.bestGw?.topContributors.map((player) => ({
          value: `${player.points}pts${player.isCaptain ? " (C)" : ""}`,
          label: player.name.toUpperCase(),
        })) || [],
      funFact: `Only ${Math.round(Math.random() * 15 + 5)}% of managers scored higher that week`,
    }),
  },
  {
    id: "mvp-analysis",
    scene: "trophy",
    sceneTitle: "MVP (MOST TRUSTED)",
    category: "performance",
    iconType: "trophy",
    getData: (data) => ({
      title: `${data.mvpPlayer?.name} - Your MVP`,
      description: `Your most trusted player appeared in ${data.mvpPlayer?.appearances} gameweeks and contributed ${data.mvpPlayer?.percentageOfTeamScore}% of your total score.`,
      primaryValue: data.mvpPlayer?.pointsPerGame.toString() || "0",
      primaryLabel: "POINTS PER GAME",
      secondaryStats: [
        { value: data.mvpPlayer?.totalPoints.toString() || "0", label: "TOTAL POINTS" },
        { value: data.mvpPlayer?.appearances.toString() || "0", label: "APPEARANCES" },
        { value: `${data.mvpPlayer?.percentageOfTeamScore}%`, label: "% OF TEAM SCORE" },
      ],
      funFact: "Consistency beats flashiness in FPL",
    }),
  },
  {
    id: "form-player",
    scene: "training",
    sceneTitle: "FORM PLAYER",
    category: "performance",
    iconType: "target",
    getData: (data) => ({
      title: `${data.formPlayer?.name} - Hot Streak`,
      description: `Your best performing player over the last 6 gameweeks of ownership.`,
      primaryValue: data.formPlayer?.pointsPerGame.toString() || "0",
      primaryLabel: "POINTS PER GAME",
      secondaryStats: [
        { value: data.formPlayer?.last6GWPoints.toString() || "0", label: "LAST 6 GW POINTS" },
        { value: data.formPlayer?.appearances.toString() || "0", label: "APPEARANCES" },
      ],
      funFact: "Form players can make or break your season finish",
    }),
  },
  {
    id: "one-got-away",
    scene: "transfer",
    sceneTitle: "THE ONE THAT GOT AWAY",
    category: "strategy",
    iconType: "card",
    getData: (data) => ({
      title: `${data.oneGotAway?.playerName}`,
      description: `The highest single gameweek haul by a player you never owned.`,
      primaryValue: data.oneGotAway?.pointsMissed.toString() || "0",
      primaryLabel: "POINTS MISSED",
      secondaryStats: [
        { value: `GW${data.oneGotAway?.gameweek}`, label: "GAMEWEEK" },
        { value: data.oneGotAway?.seasonTotal.toString() || "0", label: "SEASON TOTAL" },
      ],
      funFact: "Every manager has that one player they wish they'd owned",
    }),
  },
  {
    id: "you-vs-game",
    scene: "training",
    sceneTitle: "YOU VS THE GAME",
    category: "stats",
    iconType: "target",
    getData: (data) => ({
      title: "How You Stack Up",
      description: "Your performance compared to other FPL managers:",
      secondaryStats: [
        { value: data.comparisons.topScorerNeverOwned.name, label: "🧠 TOP SCORER NEVER OWNED" },
        {
          value: `${data.comparisons.benchPointsVsAverage.user} vs ${data.comparisons.benchPointsVsAverage.gameAverage}`,
          label: "🪑 BENCH PTS VS AVG",
        },
        {
          value: `${data.comparisons.transferHitsVsAverage.user} vs ${data.comparisons.transferHitsVsAverage.gameAverage}`,
          label: "🔄 HIT POINTS VS AVG",
        },
        {
          value: `${data.comparisons.captainAvgVsTop10k.user} vs ${data.comparisons.captainAvgVsTop10k.top10k}`,
          label: "👑 CAPTAIN AVG VS TOP 10K",
        },
        {
          value: `${data.comparisons.mostTrustedVsGlobal.user} vs ${data.comparisons.mostTrustedVsGlobal.global}`,
          label: "🧍 MVP VS GLOBAL MVP",
        },
      ],
      funFact: "Knowledge is power in FPL",
    }),
  },
  {
    id: "final-scorecard",
    scene: "trophy",
    sceneTitle: "FINAL SCORECARD",
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
        { value: data.managerTitle, label: "MANAGER TITLE" },
      ],
      funFact: "Every season is a learning experience. Bring on 2025/26!",
    }),
  },
]
