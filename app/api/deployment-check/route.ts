import { NextResponse } from "next/server"
import { DeploymentChecker } from "@/lib/deployment-checker"
import { FinalDataValidator } from "@/lib/final-data-validator"
import { PerformanceMonitor } from "@/lib/performance-monitor"

// Test data for validation
const TEST_DATA = {
  managerName: "Test Manager",
  teamName: "Test Team FC",
  totalPoints: 2156,
  overallRank: 234567,
  bestRank: 180000,
  averagePointsPerGW: 56.7,
  personalizedIntro: "Test intro...",
  bestGw: {
    gameweek: 15,
    points: 89,
    topContributors: [
      { name: "Erling Haaland", points: 26, isCaptain: true },
      { name: "Mohamed Salah", points: 18, isCaptain: false },
      { name: "Bukayo Saka", points: 15, isCaptain: false },
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
    bestCaptain: { name: "Erling Haaland", points: 26, gameweek: 15 },
    worstCaptain: { name: "Bruno Fernandes", points: 2, gameweek: 8 },
  },
  transferActivity: {
    totalTransfers: 42,
    totalHits: 4,
    bestTransferIn: { name: "Cole Palmer", pointsGained: 67, gameweek: 12 },
  },
  benchAnalysis: {
    totalBenchPoints: 187,
    averagePerGW: 4.9,
    worstBenchCall: { playerName: "Ollie Watkins", gameweek: 22, points: 18 },
    benchBoostImpact: 34,
  },
  mvpPlayer: {
    name: "Mohamed Salah",
    appearances: 35,
    totalPoints: 324,
    percentageOfTeamScore: 15.0,
    pointsPerGame: 9.3,
  },
  formPlayer: {
    name: "N/A",
    last6GWPoints: 0,
    appearances: 0,
    pointsPerGame: 0,
  },
  oneGotAway: {
    playerName: "Alexander Isak",
    gameweek: 9,
    pointsMissed: 24,
    seasonTotal: 198,
  },
  comparisons: {
    topScorerNeverOwned: { name: "Alexander Isak", points: 198 },
    benchPointsVsAverage: { user: 187, gameAverage: 215 },
    transferHitsVsAverage: { user: 16, gameAverage: 48 },
    captainAvgVsTop10k: { user: 15.6, top10k: 15.4 },
    mostTrustedVsGlobal: { user: "Mohamed Salah", global: "Erling Haaland" },
  },
  chipsUsed: [
    { name: "WILDCARD", gameweek: 9 },
    { name: "BENCH BOOST", gameweek: 26 },
    { name: "FREE HIT", gameweek: 33 },
    { name: "TRIPLE CAPTAIN", gameweek: 18 },
  ],
  bestChip: { name: "BENCH BOOST", gameweek: 26, points: 78 },
  managerTitle: "💪 THE SOLID",
  badges: ["CENTURY CLUB", "ABOVE AVERAGE", "GREEN MACHINE", "CHIP MASTER"],
  bestEarlyGw: null,
  earlyTransfers: 8,
  totalTransfers: 42,
  totalHits: 4,
  mostTransferredIn: { name: "Erling Haaland", count: 2 },
  aboveAverageWeeks: 22,
  captainPoints: 592,
  captainAccuracy: 77,
  topPlayer: { name: "Mohamed Salah", points: 324 },
  teamStats: { goals: 144, assists: 108, cleanSheets: 86 },
  favoriteFormation: "3-4-3",
  leagueWins: 2,
  benchPoints: 187,
  autoSubPoints: 34,
  maxTeamValue: 103.2,
  topScorerMissed: { name: "Alexander Isak", points: 198 },
  benchPointsComparison: { user: 187, average: 215 },
  transferHitsComparison: { user: 16, gameAverage: 48 },
  captainAvgComparison: { user: 15.6, top10k: 15.4 },
  mostTrustedComparison: { user: "Mohamed Salah", global: "Erling Haaland" },
} as any

export async function GET() {
  try {
    console.log("🔍 Running comprehensive deployment check...")

    // Run deployment readiness check
    const deploymentStatus = await DeploymentChecker.checkDeploymentReadiness(TEST_DATA)

    // Generate detailed reports
    const deploymentReport = DeploymentChecker.generateDeploymentReport(deploymentStatus)
    const dataValidationReport = FinalDataValidator.generateDeploymentReport(TEST_DATA)
    const performanceReport = PerformanceMonitor.generatePerformanceReport()

    const fullReport = `
${deploymentReport}

${dataValidationReport}

${performanceReport}

🎯 FINAL VERDICT:
${deploymentStatus.ready ? "✅ APPLICATION IS READY FOR DEPLOYMENT" : "❌ APPLICATION NEEDS FIXES BEFORE DEPLOYMENT"}

Score: ${deploymentStatus.score}/100
Data Quality: ${deploymentStatus.dataQuality}/100
Performance: ${deploymentStatus.performance}
Monitoring: ${deploymentStatus.monitoring}
`

    console.log(fullReport)

    return NextResponse.json({
      ready: deploymentStatus.ready,
      score: deploymentStatus.score,
      report: fullReport,
      details: {
        deployment: deploymentStatus,
        dataValidation: FinalDataValidator.validateForDeployment(TEST_DATA),
        performance: PerformanceMonitor.getAverageMetrics(),
      },
    })
  } catch (error) {
    console.error("❌ Deployment check failed:", error)
    return NextResponse.json({ error: "Deployment check failed", details: error }, { status: 500 })
  }
}
