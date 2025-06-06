import { type NextRequest, NextResponse } from "next/server"
import { FPLAPITester, testMultipleManagers, generateComprehensiveReport } from "@/lib/fpl-api-tester"
import { FPLDataProcessor } from "@/lib/fpl-data-processor"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const managerId = searchParams.get("id")
  const testAll = searchParams.get("all") === "true"

  try {
    if (testAll) {
      // Test all sample IDs
      const sampleIds = ["457099", "423121", "1991174"]
      console.log("🧪 Running comprehensive tests for all sample IDs...")

      const reports = await testMultipleManagers(sampleIds)
      const comprehensiveReport = generateComprehensiveReport(reports)

      // Also test real data processing for each ID
      const dataProcessingResults = []
      for (const id of sampleIds) {
        try {
          console.log(`🔄 Testing real data processing for ID: ${id}`)
          const processor = new FPLDataProcessor(id)
          const data = await processor.processUserData()

          dataProcessingResults.push({
            managerId: id,
            success: true,
            managerName: data.managerName,
            totalPoints: data.totalPoints,
            captainBest: data.captainPerformance.bestCaptain.name,
            captainWorst: data.captainPerformance.worstCaptain.name,
            bestTransferIn: data.transferActivity.bestTransferIn.name,
            worstTransferOut: data.transferActivity.worstTransferOut.name,
            worstBenchCall: data.benchAnalysis.worstBenchCall.playerName,
            topScorerNeverOwned: data.oneGotAway.playerName,
            mvpPlayer: data.mvpPlayer.name,
          })
        } catch (error) {
          dataProcessingResults.push({
            managerId: id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      return NextResponse.json({
        success: true,
        reports,
        comprehensiveReport,
        dataProcessingResults,
        summary: {
          totalTests: reports.reduce((sum, r) => sum + r.totalTests, 0),
          totalPassed: reports.reduce((sum, r) => sum + r.passedTests, 0),
          totalFailed: reports.reduce((sum, r) => sum + r.failedTests, 0),
          dataProcessingSuccess: dataProcessingResults.filter((r) => r.success).length,
          dataProcessingFailed: dataProcessingResults.filter((r) => !r.success).length,
        },
      })
    } else if (managerId) {
      // Test single manager ID
      console.log(`🧪 Running test for manager ID: ${managerId}`)

      const tester = new FPLAPITester(managerId)
      const report = await tester.runComprehensiveTest()

      // Also test real data processing
      let dataProcessingResult = null
      try {
        console.log(`🔄 Testing real data processing for ID: ${managerId}`)
        const processor = new FPLDataProcessor(managerId)
        const data = await processor.processUserData()

        dataProcessingResult = {
          success: true,
          managerName: data.managerName,
          totalPoints: data.totalPoints,
          insights: {
            captainBest: `${data.captainPerformance.bestCaptain.name} (${data.captainPerformance.bestCaptain.points}pts, GW${data.captainPerformance.bestCaptain.gameweek})`,
            captainWorst: `${data.captainPerformance.worstCaptain.name} (${data.captainPerformance.worstCaptain.points}pts, GW${data.captainPerformance.worstCaptain.gameweek})`,
            bestTransferIn: `${data.transferActivity.bestTransferIn.name} (+${data.transferActivity.bestTransferIn.pointsGained}pts, GW${data.transferActivity.bestTransferIn.gameweek})`,
            worstTransferOut: `${data.transferActivity.worstTransferOut.name} (-${data.transferActivity.worstTransferOut.pointsLost}pts, GW${data.transferActivity.worstTransferOut.gameweek})`,
            worstBenchCall: `${data.benchAnalysis.worstBenchCall.playerName} (${data.benchAnalysis.worstBenchCall.points}pts, GW${data.benchAnalysis.worstBenchCall.gameweek})`,
            topScorerNeverOwned: `${data.oneGotAway.playerName} (${data.oneGotAway.seasonTotal}pts total, ${data.oneGotAway.pointsMissed}pts in GW${data.oneGotAway.gameweek})`,
            mvpPlayer: `${data.mvpPlayer.name} (${data.mvpPlayer.totalPoints}pts in ${data.mvpPlayer.appearances} apps)`,
            formPlayer: `${data.formPlayer.name} (${data.formPlayer.last6GWPoints}pts in last 6 GWs)`,
          },
          validation: {
            totalPointsValid: data.totalPoints > 0 && data.totalPoints < 4000,
            captainDataValid: data.captainPerformance.bestCaptain.name !== "Unknown",
            transferDataValid: data.transferActivity.bestTransferIn.name !== "Unknown",
            benchDataValid: data.benchAnalysis.worstBenchCall.playerName !== "Unknown",
            mvpDataValid: data.mvpPlayer.name !== "Unknown",
          },
        }
      } catch (error) {
        dataProcessingResult = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }

      return NextResponse.json({
        success: true,
        report,
        dataProcessingResult,
      })
    } else {
      return NextResponse.json({ success: false, error: "Manager ID is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Test API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
