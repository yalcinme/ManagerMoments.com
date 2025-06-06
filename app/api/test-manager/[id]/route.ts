import { type NextRequest, NextResponse } from "next/server"
import { RealFPLProcessor } from "@/lib/real-fpl-processor"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now()

  try {
    console.log(`🧪 Testing FPL data processing for manager: ${params.id}`)

    const managerId = params.id?.trim()

    if (!managerId || !/^\d+$/.test(managerId)) {
      return NextResponse.json({ error: "Invalid manager ID" }, { status: 400 })
    }

    // Test the processor
    const processor = new RealFPLProcessor(managerId)
    const fplData = await processor.processRealData()

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      responseTime: `${responseTime}ms`,
      managerName: fplData.managerName,
      teamName: fplData.teamName,
      totalPoints: fplData.totalPoints,
      overallRank: fplData.overallRank,
      dataQuality: "✅ All data processed successfully",
      summary: {
        bestGameweek: fplData.bestGw,
        captainPerformance: fplData.captainPerformance,
        transferActivity: fplData.transferActivity,
        benchAnalysis: fplData.benchAnalysis,
        badges: fplData.badges,
        title: fplData.managerTitle,
      },
    })
  } catch (error) {
    console.error("❌ Test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime: `${Date.now() - startTime}ms`,
      },
      { status: 500 },
    )
  }
}
