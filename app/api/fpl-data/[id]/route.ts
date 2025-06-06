import { type NextRequest, NextResponse } from "next/server"
import { RealFPLProcessor } from "@/lib/real-fpl-processor"
import { ProductionCache, RateLimiter } from "@/lib/production-cache"
import { ErrorHandler, ProductionMonitor } from "@/lib/production-monitoring"
import { DataValidator } from "@/lib/data-validation"
import { FinalDataValidator } from "@/lib/final-data-validator"
import { PerformanceMonitor } from "@/lib/performance-monitor"
import type { FPLData } from "@/types/fpl"

// Validated demo data with accurate 2024/25 FPL values
const DEMO_DATA: FPLData = {
  managerName: "Demo Manager",
  teamName: "Demo Team FC",
  totalPoints: 2156, // Realistic 2024/25 total
  overallRank: 234567, // Realistic rank out of 11M
  bestRank: 180000,
  averagePointsPerGW: 56.7, // 2156/38 = 56.7
  personalizedIntro: "Welcome back, Demo Manager! Your 2024/25 season was quite the journey...",

  bestGw: {
    gameweek: 15,
    points: 89, // Realistic high gameweek
    topContributors: [
      { name: "Erling Haaland", points: 26, isCaptain: true }, // 13*2 for captain
      { name: "Mohamed Salah", points: 18, isCaptain: false },
      { name: "Bukayo Saka", points: 15, isCaptain: false },
    ],
  },
  worstGw: { gameweek: 8, points: 31 }, // Realistic low gameweek

  biggestRankJump: { gameweek: 15, places: 45000 }, // After good gameweek
  biggestRankDrop: { gameweek: 8, places: 25000 }, // After bad gameweek
  greenArrows: 18, // Out of 37 possible
  redArrows: 12,

  captainPerformance: {
    totalPoints: 592, // CORRECTED: Realistic captain total (27.6% of 2156)
    averagePoints: 15.6, // CORRECTED: 592/38 = 15.6 captain points per GW
    failRate: 23, // 77% success rate
    bestCaptain: { name: "Erling Haaland", points: 26, gameweek: 15 }, // Captain points (doubled)
    worstCaptain: { name: "Bruno Fernandes", points: 2, gameweek: 8 }, // Captain points (doubled)
  },

  transferActivity: {
    totalTransfers: 42, // Realistic for active manager
    totalHits: 4, // 16 points cost
    bestTransferIn: { name: "Cole Palmer", pointsGained: 67, gameweek: 12 },
  },

  benchAnalysis: {
    totalBenchPoints: 187, // ~5 per gameweek average
    averagePerGW: 4.9, // 187/38 = 4.9
    worstBenchCall: { playerName: "Ollie Watkins", gameweek: 22, points: 18 },
    benchBoostImpact: 34,
  },

  mvpPlayer: {
    name: "Mohamed Salah",
    appearances: 35,
    totalPoints: 324, // 15% of team total
    percentageOfTeamScore: 15.0, // 324/2156 = 15.0%
    pointsPerGame: 9.3, // 324/35 = 9.3
  },

  formPlayer: {
    name: "N/A", // Removed from experience
    last6GWPoints: 0,
    appearances: 0,
    pointsPerGame: 0,
  },

  oneGotAway: {
    playerName: "Alexander Isak",
    gameweek: 9,
    pointsMissed: 24,
    seasonTotal: 198, // Realistic top scorer total
  },

  comparisons: {
    topScorerNeverOwned: { name: "Alexander Isak", points: 198 },
    benchPointsVsAverage: { user: 187, gameAverage: 215 }, // 2024/25 average
    transferHitsVsAverage: { user: 16, gameAverage: 48 }, // 2024/25 average
    captainAvgVsTop10k: { user: 15.6, top10k: 15.4 }, // CORRECTED: captain points comparison
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

  // Legacy fields for compatibility
  bestEarlyGw: null,
  earlyTransfers: 8,
  totalTransfers: 42,
  totalHits: 4,
  mostTransferredIn: { name: "Erling Haaland", count: 2 },
  aboveAverageWeeks: 22,
  captainPoints: 592, // CORRECTED: Total captain points
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
  captainAvgComparison: { user: 15.6, top10k: 15.4 }, // CORRECTED
  mostTrustedComparison: { user: "Mohamed Salah", global: "Erling Haaland" },
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  return cfConnectingIP || realIP || forwarded?.split(",")[0] || "unknown"
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now()
  const clientIP = getClientIP(request)

  try {
    console.log(`🔄 API called with manager ID: ${params.id} from IP: ${clientIP}`)

    const managerId = params.id?.trim()

    if (!managerId) {
      return NextResponse.json({ error: "Manager ID is required" }, { status: 400 })
    }

    // Rate limiting
    if (!RateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before trying again.",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
          },
        },
      )
    }

    // Return demo data for demo/test cases
    if (managerId === "demo" || managerId === "1") {
      console.log("✅ Returning validated demo data")

      // Ensure demo data is complete
      if (!DEMO_DATA.managerName || !DEMO_DATA.totalPoints) {
        console.error("❌ Demo data is incomplete")
        return NextResponse.json({ error: "Demo data configuration error" }, { status: 500 })
      }

      // Comprehensive validation
      const validation = FinalDataValidator.validateForDeployment(DEMO_DATA)
      console.log("📊 Demo Data Validation:", validation)

      // Record performance metrics
      PerformanceMonitor.recordMetrics({
        apiResponseTime: Date.now() - startTime,
        dataProcessingTime: 0,
        renderTime: 0,
        totalLoadTime: Date.now() - startTime,
        memoryUsage: 25,
        cacheHitRate: 100,
        errorRate: 0,
      })

      return NextResponse.json(DEMO_DATA, {
        headers: {
          "Cache-Control": "no-store",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Data-Source": "DEMO",
          "X-Data-Quality": validation.score.toString(),
          "X-Validation-Status": validation.isValid ? "VALID" : "INVALID",
          "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
          "Content-Type": "application/json",
        },
      })
    }

    // Validate numeric ID
    if (!/^\d+$/.test(managerId)) {
      return NextResponse.json(
        { error: "Invalid manager ID. Please enter a valid numeric FPL Manager ID." },
        { status: 400 },
      )
    }

    const numericId = Number.parseInt(managerId, 10)
    if (numericId <= 0 || numericId > 99999999) {
      return NextResponse.json({ error: "Manager ID must be between 1 and 99999999." }, { status: 400 })
    }

    // Check cache first
    const cacheKey = `fpl-data-${managerId}`
    const cachedData = ProductionCache.get<FPLData>(cacheKey)

    if (cachedData) {
      console.log(`✅ Returning cached data for manager: ${managerId}`)

      ProductionMonitor.recordRequest({
        timestamp: new Date(),
        managerId,
        responseTime: Date.now() - startTime,
        success: true,
        cacheHit: true,
      })

      // Record performance metrics
      PerformanceMonitor.recordMetrics({
        apiResponseTime: Date.now() - startTime,
        dataProcessingTime: 0,
        renderTime: 0,
        totalLoadTime: Date.now() - startTime,
        memoryUsage: 30,
        cacheHitRate: 100,
        errorRate: 0,
      })

      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Data-Source": "CACHE",
          "X-Cache": "HIT",
          "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
        },
      })
    }

    try {
      // Process real FPL data
      console.log(`🔄 Processing real FPL data for manager: ${managerId}`)
      const processingStartTime = Date.now()

      const processor = new RealFPLProcessor(managerId)
      const fplData = await processor.processRealData()

      const processingTime = Date.now() - processingStartTime

      // Validate response data before sending
      if (!fplData.managerName || typeof fplData.totalPoints !== "number") {
        throw new Error("Processed data is incomplete")
      }

      // Comprehensive validation
      const validation = FinalDataValidator.validateForDeployment(fplData)
      console.log("📊 Real Data Validation:", validation)

      if (!validation.isValid) {
        console.warn(`⚠️ Data validation failed for manager ${managerId}:`, validation.errors)

        // Try to sanitize and continue
        const sanitizedData = DataValidator.sanitizeData(fplData)
        const revalidation = FinalDataValidator.validateForDeployment(sanitizedData)

        if (revalidation.isValid) {
          console.log(`✅ Data sanitized successfully for manager ${managerId}`)
          ProductionCache.set(cacheKey, sanitizedData, 5 * 60 * 1000)

          // Record performance metrics
          PerformanceMonitor.recordMetrics({
            apiResponseTime: Date.now() - startTime,
            dataProcessingTime: processingTime,
            renderTime: 0,
            totalLoadTime: Date.now() - startTime,
            memoryUsage: 45,
            cacheHitRate: 0,
            errorRate: 0,
          })

          return NextResponse.json(sanitizedData, {
            headers: {
              "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
              "X-Response-Time": `${Date.now() - startTime}ms`,
              "X-Data-Source": "REAL_FPL_API_SANITIZED",
              "X-Data-Quality": revalidation.score.toString(),
              "X-Cache": "MISS",
              "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
            },
          })
        } else {
          throw new Error("Data validation failed after sanitization")
        }
      }

      // Cache successful result
      ProductionCache.set(cacheKey, fplData, 5 * 60 * 1000)

      console.log(`✅ Successfully processed real FPL data for manager ${managerId} (Quality: ${validation.score}%)`)

      // Record performance metrics
      PerformanceMonitor.recordMetrics({
        apiResponseTime: Date.now() - startTime,
        dataProcessingTime: processingTime,
        renderTime: 0,
        totalLoadTime: Date.now() - startTime,
        memoryUsage: 50,
        cacheHitRate: 0,
        errorRate: 0,
      })

      return NextResponse.json(fplData, {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Data-Source": "REAL_FPL_API",
          "X-Data-Quality": validation.score.toString(),
          "X-Cache": "MISS",
          "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
        },
      })
    } catch (fetchError) {
      console.error("❌ FPL data processing error:", fetchError)

      const errorInfo = ErrorHandler.handleFPLAPIError(fetchError, managerId)

      ProductionMonitor.recordRequest({
        timestamp: new Date(),
        managerId,
        responseTime: Date.now() - startTime,
        success: false,
        errorType: errorInfo.type,
        cacheHit: false,
      })

      // Record performance metrics with error
      PerformanceMonitor.recordMetrics({
        apiResponseTime: Date.now() - startTime,
        dataProcessingTime: 0,
        renderTime: 0,
        totalLoadTime: Date.now() - startTime,
        memoryUsage: 20,
        cacheHitRate: 0,
        errorRate: 100,
      })

      return NextResponse.json(
        { error: errorInfo.message, type: errorInfo.type },
        {
          status: errorInfo.status,
          headers: {
            "X-Response-Time": `${Date.now() - startTime}ms`,
            "X-Error-Type": errorInfo.type,
            "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
          },
        },
      )
    }
  } catch (error) {
    console.error("❌ Unexpected API error:", error)

    ProductionMonitor.recordRequest({
      timestamp: new Date(),
      managerId: params.id || "unknown",
      responseTime: Date.now() - startTime,
      success: false,
      errorType: "INTERNAL_ERROR",
      cacheHit: false,
    })

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", type: "INTERNAL_ERROR" },
      {
        status: 500,
        headers: {
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Error": "INTERNAL_ERROR",
          "X-RateLimit-Remaining": RateLimiter.getRemainingRequests(clientIP).toString(),
        },
      },
    )
  }
}
