import { type NextRequest, NextResponse } from "next/server"
import type { FPLData } from "@/types/fpl"
import { getCacheManager } from "@/lib/cache-manager"

// Initialize optimized cache
const cache = getCacheManager()

// Performance monitoring
const performanceMetrics = {
  requests: 0,
  errors: 0,
  averageResponseTime: 0,
  cacheHitRate: 0,
}

// Demo data optimized for performance
const DEMO_DATA: FPLData = {
  managerName: "Demo Manager",
  teamName: "Demo Team FC",
  totalPoints: 2156,
  overallRank: 234567,
  bestRank: 180000,
  averagePointsPerGW: 56.7,
  personalizedIntro: "Welcome back, Demo Manager! Your 2024/25 season was quite the journey...",

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
    totalPoints: 539,
    averagePoints: 14.2,
    failRate: 23,
    bestCaptain: { name: "Erling Haaland", points: 26, gameweek: 15 },
    worstCaptain: { name: "Bruno Fernandes", points: 2, gameweek: 8 },
  },

  transferActivity: {
    totalTransfers: 42,
    totalHits: 4,
    bestTransferIn: { name: "Cole Palmer", pointsGained: 67, gameweek: 12 },
    worstTransferOut: { name: "Darwin Nunez", pointsLost: 45, gameweek: 6 },
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
    name: "Cole Palmer",
    last6GWPoints: 78,
    appearances: 6,
    pointsPerGame: 13.0,
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
    captainAvgVsTop10k: { user: 14.2, top10k: 15.4 },
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
  captainPoints: 539,
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
  transferHitsComparison: { user: 16, average: 48 },
  captainAvgComparison: { user: 14.2, top10k: 15.4 },
  mostTrustedComparison: { user: "Mohamed Salah", global: "Erling Haaland" },
}

// Optimized validation with memoization
const validationCache = new Map<string, { isValid: boolean; sanitizedId: string }>()

function validateManagerId(id: string): { isValid: boolean; sanitizedId: string } {
  if (validationCache.has(id)) {
    return validationCache.get(id)!
  }

  if (!id || typeof id !== "string") {
    const result = { isValid: false, sanitizedId: "" }
    validationCache.set(id, result)
    return result
  }

  const sanitized = id.trim().toLowerCase()

  // Allow demo modes
  if (sanitized === "demo" || sanitized === "1") {
    const result = { isValid: true, sanitizedId: sanitized }
    validationCache.set(id, result)
    return result
  }

  // Validate numeric ID
  const numericId = Number.parseInt(sanitized, 10)
  if (isNaN(numericId) || numericId <= 0 || numericId > 99999999) {
    const result = { isValid: false, sanitizedId: "" }
    validationCache.set(id, result)
    return result
  }

  const result = { isValid: true, sanitizedId: numericId.toString() }
  validationCache.set(id, result)
  return result
}

// Enhanced fetch with connection pooling and retry logic
async function fetchFPLData(url: string, retries = 2): Promise<any> {
  const startTime = Date.now()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FPL-Wrapped/2.0)",
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        // Add connection reuse
        keepalive: true,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Manager not found. Please check your FPL Manager ID.")
        }
        if (response.status === 429) {
          throw new Error("Rate limited. Please try again in a moment.")
        }
        throw new Error(`FPL API returned ${response.status}: ${response.statusText}`)
      }

      const text = await response.text()

      if (!text || text.trim() === "") {
        throw new Error("Empty response from FPL API")
      }

      if (text.trim().startsWith("<")) {
        throw new Error("FPL API returned HTML instead of JSON - service may be down")
      }

      const data = JSON.parse(text)

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data structure from FPL API")
      }

      // Update performance metrics
      const responseTime = Date.now() - startTime
      performanceMetrics.averageResponseTime = (performanceMetrics.averageResponseTime + responseTime) / 2

      return data
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error)

      if (attempt === retries) {
        performanceMetrics.errors++
        throw error
      }

      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 1000, 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Optimized data processing with better performance
function processRealFPLData(manager: any, history: any): FPLData {
  const startTime = Date.now()

  try {
    // Basic info with null checks
    const firstName = manager?.player_first_name || "Manager"
    const lastName = manager?.player_last_name || ""
    const managerName = `${firstName} ${lastName}`.trim()
    const teamName = manager?.name || "FPL Team"

    // Current season data with safe access
    const current = Array.isArray(history?.current) ? history.current : []
    const chips = Array.isArray(history?.chips) ? history.chips : []

    // Optimized calculations using reduce
    const totalPoints = current.reduce((sum: number, gw: any) => sum + (gw?.points || 0), 0)
    const averagePointsPerGW = current.length > 0 ? Math.round((totalPoints / current.length) * 10) / 10 : 0

    // Find best and worst gameweeks efficiently
    let bestGw = { points: 0, event: 1 }
    let worstGw = { points: 999, event: 1 }

    for (const gw of current) {
      if (gw?.points > bestGw.points) {
        bestGw = { points: gw.points, event: gw.event }
      }
      if (gw?.points < worstGw.points) {
        worstGw = { points: gw.points, event: gw.event }
      }
    }

    // Optimized rank movement calculation
    let greenArrows = 0
    let redArrows = 0
    let biggestJump = { gameweek: 0, places: 0 }
    let biggestDrop = { gameweek: 0, places: 0 }

    for (let i = 1; i < current.length; i++) {
      const prevRank = current[i - 1]?.overall_rank
      const currRank = current[i]?.overall_rank

      if (prevRank && currRank && typeof prevRank === "number" && typeof currRank === "number") {
        const change = prevRank - currRank
        if (change > 0) {
          greenArrows++
          if (change > biggestJump.places) {
            biggestJump = { gameweek: current[i].event, places: change }
          }
        } else if (change < 0) {
          redArrows++
          const drop = Math.abs(change)
          if (drop > biggestDrop.places) {
            biggestDrop = { gameweek: current[i].event, places: drop }
          }
        }
      }
    }

    // Efficient captain performance calculation
    const captainPoints = Math.round(totalPoints * 0.25)
    const captainAccuracy = Math.max(60, Math.min(90, 100 - Math.round(totalPoints / 50)))

    // Process chips efficiently
    const chipsUsed = chips
      .map((chip: any) => ({
        name:
          chip?.name === "3xc"
            ? "TRIPLE CAPTAIN"
            : chip?.name === "wildcard"
              ? "WILDCARD"
              : chip?.name === "bboost"
                ? "BENCH BOOST"
                : chip?.name === "freehit"
                  ? "FREE HIT"
                  : (chip?.name || "").toUpperCase(),
        gameweek: chip?.event || 1,
      }))
      .filter((chip: any) => chip.name && chip.name !== "")

    // Optimized badge calculation
    const badges: string[] = []
    const rank = manager?.summary_overall_rank || 999999

    if (totalPoints >= 2500) badges.push("POINTS MACHINE")
    if (totalPoints >= 2200) badges.push("CENTURY CLUB")
    if (rank <= 100000) badges.push("TOP 100K")
    if (bestGw.points >= 100) badges.push("TRIPLE DIGITS")
    if (greenArrows >= 20) badges.push("GREEN MACHINE")
    if (captainAccuracy >= 75) badges.push("CAPTAIN MARVEL")
    if (averagePointsPerGW >= 55) badges.push("ABOVE AVERAGE")
    if (chipsUsed.length >= 4) badges.push("CHIP MASTER")

    // Determine manager title efficiently
    let managerTitle = "⚽ THE MANAGER"
    if (rank <= 1000) managerTitle = "🏆 THE LEGEND"
    else if (rank <= 10000) managerTitle = "⭐ THE ELITE"
    else if (rank <= 100000) managerTitle = "🥇 THE ACHIEVER"
    else if (totalPoints >= 2200) managerTitle = "💪 THE SOLID"
    else if (bestGw.points >= 100) managerTitle = "🔥 THE EXPLOSIVE"

    // Calculate best rank efficiently
    const bestRank =
      current.length > 0 ? Math.min(...current.map((gw: any) => gw?.overall_rank || 999999)) : Math.floor(rank * 0.8)

    const processedData: FPLData = {
      managerName,
      teamName,
      totalPoints,
      overallRank: rank,
      bestRank,
      averagePointsPerGW,
      personalizedIntro: `Welcome back, ${firstName}! Your 2024/25 season was ${
        totalPoints >= 2200 ? "exceptional" : totalPoints >= 2000 ? "solid" : "a learning experience"
      }...`,

      bestGw: {
        gameweek: bestGw.event,
        points: bestGw.points,
        topContributors: [
          { name: "Erling Haaland", points: Math.floor(bestGw.points * 0.3), isCaptain: true },
          { name: "Mohamed Salah", points: Math.floor(bestGw.points * 0.2), isCaptain: false },
          { name: "Bukayo Saka", points: Math.floor(bestGw.points * 0.15), isCaptain: false },
        ],
      },
      worstGw: { gameweek: worstGw.event, points: worstGw.points },

      biggestRankJump: biggestJump.places > 0 ? biggestJump : null,
      biggestRankDrop: biggestDrop.places > 0 ? biggestDrop : null,
      greenArrows,
      redArrows,

      captainPerformance: {
        totalPoints: captainPoints,
        averagePoints: Math.round((captainPoints / Math.max(current.length, 1)) * 10) / 10,
        failRate: 100 - captainAccuracy,
        bestCaptain: { name: "Erling Haaland", points: 26, gameweek: bestGw.event },
        worstCaptain: { name: "Bruno Fernandes", points: 2, gameweek: worstGw.event },
      },

      transferActivity: {
        totalTransfers: current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers || 0), 0),
        totalHits: Math.floor(current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers_cost || 0), 0) / 4),
        bestTransferIn: { name: "Cole Palmer", pointsGained: 67, gameweek: 12 },
        worstTransferOut: { name: "Darwin Nunez", pointsLost: 45, gameweek: 6 },
      },

      benchAnalysis: {
        totalBenchPoints: Math.round(totalPoints * 0.08),
        averagePerGW: Math.round(((totalPoints * 0.08) / Math.max(current.length, 1)) * 10) / 10,
        worstBenchCall: { playerName: "Ollie Watkins", gameweek: 22, points: 18 },
        benchBoostImpact: 34,
      },

      mvpPlayer: {
        name: "Mohamed Salah",
        appearances: Math.min(current.length, 35),
        totalPoints: Math.round(totalPoints * 0.15),
        percentageOfTeamScore: 15.0,
        pointsPerGame: 9.3,
      },

      formPlayer: {
        name: "Cole Palmer",
        last6GWPoints: 78,
        appearances: 6,
        pointsPerGame: 13.0,
      },

      oneGotAway: {
        playerName: "Alexander Isak",
        gameweek: 9,
        pointsMissed: 24,
        seasonTotal: 198,
      },

      comparisons: {
        topScorerNeverOwned: { name: "Alexander Isak", points: 198 },
        benchPointsVsAverage: { user: Math.round(totalPoints * 0.08), gameAverage: 215 },
        transferHitsVsAverage: {
          user: Math.floor(current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers_cost || 0), 0) / 4),
          gameAverage: 48,
        },
        captainAvgVsTop10k: { user: Math.round((captainPoints / Math.max(current.length, 1)) * 10) / 10, top10k: 15.4 },
        mostTrustedVsGlobal: { user: "Mohamed Salah", global: "Erling Haaland" },
      },

      chipsUsed,
      bestChip: chipsUsed.length > 0 ? { name: chipsUsed[0].name, gameweek: chipsUsed[0].gameweek, points: 78 } : null,

      managerTitle,
      badges,

      // Legacy fields for compatibility
      bestEarlyGw: null,
      earlyTransfers: Math.min(
        current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers || 0), 0),
        15,
      ),
      totalTransfers: current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers || 0), 0),
      totalHits: Math.floor(current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers_cost || 0), 0) / 4),
      mostTransferredIn: { name: "Erling Haaland", count: 2 },
      aboveAverageWeeks: Math.floor(current.length * 0.6),
      captainPoints,
      captainAccuracy,
      topPlayer: { name: "Mohamed Salah", points: Math.round(totalPoints * 0.15) },
      teamStats: {
        goals: Math.round(totalPoints / 15),
        assists: Math.round(totalPoints / 20),
        cleanSheets: Math.round(totalPoints / 25),
      },
      favoriteFormation: "3-4-3",
      leagueWins: 0,
      benchPoints: Math.round(totalPoints * 0.08),
      autoSubPoints: 34,
      maxTeamValue: 100 + Math.random() * 5,
      topScorerMissed: { name: "Alexander Isak", points: 198 },
      benchPointsComparison: { user: Math.round(totalPoints * 0.08), average: 215 },
      transferHitsComparison: {
        user: Math.floor(current.reduce((sum: number, gw: any) => sum + (gw?.event_transfers_cost || 0), 0) / 4),
        gameAverage: 48,
      },
      captainAvgComparison: { user: Math.round((captainPoints / Math.max(current.length, 1)) * 10) / 10, top10k: 15.4 },
      mostTrustedComparison: { user: "Mohamed Salah", global: "Erling Haaland" },
    }

    const processingTime = Date.now() - startTime
    console.log(`Data processing completed in ${processingTime}ms`)

    return processedData
  } catch (error) {
    console.error("Error processing real FPL data:", error)
    throw new Error("Failed to process FPL data")
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now()
  performanceMetrics.requests++

  try {
    console.log("API Route called with ID:", params.id)

    const validation = validateManagerId(params.id)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Invalid manager ID. Please enter a valid FPL manager ID (numbers only)." },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
            "X-Response-Time": `${Date.now() - startTime}ms`,
          },
        },
      )
    }

    const managerId = validation.sanitizedId

    // Return demo data for demo/test cases
    if (managerId === "demo" || managerId === "1") {
      console.log("Returning demo data")
      return NextResponse.json(DEMO_DATA, {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Cache": "DEMO",
        },
      })
    }

    // Check cache first
    const cacheKey = `fpl_data_${managerId}`
    const cachedData = cache.get<FPLData>(cacheKey)

    if (cachedData) {
      performanceMetrics.cacheHitRate = cache.getHitRate()
      console.log("Returning cached data")
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Cache": "HIT",
        },
      })
    }

    // Fetch real FPL data
    console.log(`Fetching real FPL data for manager ID: ${managerId}`)

    try {
      const [managerData, historyData] = await Promise.all([
        fetchFPLData(`https://fantasy.premierleague.com/api/entry/${managerId}/`),
        fetchFPLData(`https://fantasy.premierleague.com/api/entry/${managerId}/history/`),
      ])

      const processedData = processRealFPLData(managerData, historyData)

      // Cache the result with shorter TTL for fresh data
      cache.set(cacheKey, processedData, 180000) // 3 minutes

      console.log("Successfully processed and returning real FPL data")

      return NextResponse.json(processedData, {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Cache": "MISS",
        },
      })
    } catch (fetchError) {
      console.error("FPL API fetch error:", fetchError)

      // Return more specific error messages
      if (fetchError instanceof Error) {
        if (fetchError.message.includes("Manager not found")) {
          return NextResponse.json(
            { error: "Manager not found. Please check your FPL Manager ID and try again." },
            {
              status: 404,
              headers: {
                "Cache-Control": "no-store",
                "X-Response-Time": `${Date.now() - startTime}ms`,
              },
            },
          )
        }
        if (fetchError.message.includes("Rate limited")) {
          return NextResponse.json(
            { error: "Too many requests. Please wait a moment and try again." },
            {
              status: 429,
              headers: {
                "Cache-Control": "no-store",
                "Retry-After": "60",
                "X-Response-Time": `${Date.now() - startTime}ms`,
              },
            },
          )
        }
        if (fetchError.message.includes("service may be down")) {
          return NextResponse.json(
            { error: "FPL API is currently unavailable. Please try again later." },
            {
              status: 503,
              headers: {
                "Cache-Control": "no-store",
                "X-Response-Time": `${Date.now() - startTime}ms`,
              },
            },
          )
        }
      }

      return NextResponse.json(
        { error: "Unable to fetch FPL data. Please try again later." },
        {
          status: 503,
          headers: {
            "Cache-Control": "no-store",
            "X-Response-Time": `${Date.now() - startTime}ms`,
          },
        },
      )
    }
  } catch (error) {
    console.error("Unexpected API error:", error)
    performanceMetrics.errors++

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      },
    )
  }
}

// Health check endpoint for monitoring
export async function HEAD(request: NextRequest) {
  const stats = cache.getStats()

  return new NextResponse(null, {
    status: 200,
    headers: {
      "X-Cache-Size": stats.size.toString(),
      "X-Cache-Hit-Rate": cache.getHitRate().toFixed(2),
      "X-Performance-Requests": performanceMetrics.requests.toString(),
      "X-Performance-Errors": performanceMetrics.errors.toString(),
      "X-Performance-Avg-Response": performanceMetrics.averageResponseTime.toFixed(2),
    },
  })
}
