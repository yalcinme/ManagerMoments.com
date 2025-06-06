import type { FPLData } from "@/types/fpl"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  dataIntegrity: {
    totalPoints: boolean
    rankings: boolean
    calculations: boolean
    consistency: boolean
  }
}

export class FPLDataValidator {
  static validate(data: FPLData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const result: ValidationResult = {
      isValid: true,
      errors,
      warnings,
      dataIntegrity: {
        totalPoints: true,
        rankings: true,
        calculations: true,
        consistency: true,
      },
    }

    // Validate basic data structure
    this.validateBasicStructure(data, errors)

    // Validate calculations
    this.validateCalculations(data, errors, warnings)

    // Validate data consistency
    this.validateConsistency(data, errors, warnings)

    // Validate ranges and logical bounds
    this.validateRanges(data, errors, warnings)

    // Update integrity flags
    result.dataIntegrity.totalPoints = !errors.some((e) => e.includes("points"))
    result.dataIntegrity.rankings = !errors.some((e) => e.includes("rank"))
    result.dataIntegrity.calculations = !errors.some((e) => e.includes("calculation"))
    result.dataIntegrity.consistency = !errors.some((e) => e.includes("consistency"))

    result.isValid = errors.length === 0

    return result
  }

  private static validateBasicStructure(data: FPLData, errors: string[]) {
    // Required fields
    if (!data.managerName || data.managerName.trim() === "") {
      errors.push("Manager name is required")
    }

    if (!data.teamName || data.teamName.trim() === "") {
      errors.push("Team name is required")
    }

    if (typeof data.totalPoints !== "number" || data.totalPoints < 0) {
      errors.push("Total points must be a positive number")
    }

    if (data.overallRank && (typeof data.overallRank !== "number" || data.overallRank < 1)) {
      errors.push("Overall rank must be a positive number")
    }
  }

  private static validateCalculations(data: FPLData, errors: string[], warnings: string[]) {
    // Average points per gameweek calculation
    const expectedAverage = Math.round((data.totalPoints / 38) * 10) / 10
    if (Math.abs(data.averagePointsPerGW - expectedAverage) > 0.2) {
      warnings.push(
        `Average points per GW calculation may be incorrect. Expected: ${expectedAverage}, Got: ${data.averagePointsPerGW}`,
      )
    }

    // Captain performance calculations
    if (data.captainPerformance) {
      const { totalPoints: captainPoints, averagePoints } = data.captainPerformance
      const expectedCaptainAvg = Math.round((captainPoints / 38) * 10) / 10

      if (Math.abs(averagePoints - expectedCaptainAvg) > 0.5) {
        warnings.push(
          `Captain average calculation inconsistent. Expected: ${expectedCaptainAvg}, Got: ${averagePoints}`,
        )
      }

      // Captain points should be reasonable percentage of total
      const captainPercentage = (captainPoints / data.totalPoints) * 100
      if (captainPercentage < 15 || captainPercentage > 35) {
        warnings.push(`Captain points percentage seems unusual: ${captainPercentage.toFixed(1)}%`)
      }
    }

    // Transfer activity validation
    if (data.transferActivity) {
      const { totalTransfers, totalHits } = data.transferActivity

      // Hits should not exceed transfers
      if (totalHits > totalTransfers) {
        errors.push("Total hits cannot exceed total transfers")
      }

      // Reasonable transfer limits
      if (totalTransfers > 200) {
        warnings.push(`Very high transfer count: ${totalTransfers}`)
      }
    }

    // Bench analysis validation
    if (data.benchAnalysis) {
      const { totalBenchPoints, averagePerGW } = data.benchAnalysis
      const expectedBenchAvg = Math.round((totalBenchPoints / 38) * 10) / 10

      if (Math.abs(averagePerGW - expectedBenchAvg) > 0.2) {
        warnings.push(`Bench average calculation inconsistent. Expected: ${expectedBenchAvg}, Got: ${averagePerGW}`)
      }
    }
  }

  private static validateConsistency(data: FPLData, errors: string[], warnings: string[]) {
    // Green arrows + red arrows should be reasonable
    const totalArrows = data.greenArrows + data.redArrows
    if (totalArrows > 37) {
      warnings.push(`Total arrows (${totalArrows}) exceeds maximum possible (37)`)
    }

    // Best rank should be better than overall rank
    if (data.overallRank && data.bestRank > data.overallRank) {
      warnings.push("Best rank should be better (lower) than overall rank")
    }

    // MVP player validation
    if (data.mvpPlayer) {
      const { appearances, totalPoints, percentageOfTeamScore } = data.mvpPlayer

      if (appearances > 38) {
        errors.push("MVP player appearances cannot exceed 38")
      }

      const calculatedPercentage = (totalPoints / data.totalPoints) * 100
      if (Math.abs(calculatedPercentage - percentageOfTeamScore) > 1) {
        warnings.push(
          `MVP percentage calculation inconsistent. Expected: ${calculatedPercentage.toFixed(1)}%, Got: ${percentageOfTeamScore}%`,
        )
      }
    }

    // Gameweek validation
    if (data.bestGw && (data.bestGw.gameweek < 1 || data.bestGw.gameweek > 38)) {
      errors.push("Best gameweek must be between 1 and 38")
    }

    if (data.worstGw && (data.worstGw.gameweek < 1 || data.worstGw.gameweek > 38)) {
      errors.push("Worst gameweek must be between 1 and 38")
    }
  }

  private static validateRanges(data: FPLData, errors: string[], warnings: string[]) {
    // Total points reasonable range
    if (data.totalPoints < 500 || data.totalPoints > 3000) {
      warnings.push(`Total points (${data.totalPoints}) outside typical range (500-3000)`)
    }

    // Overall rank reasonable range
    if (data.overallRank && (data.overallRank < 1 || data.overallRank > 12000000)) {
      warnings.push(`Overall rank (${data.overallRank}) outside reasonable range`)
    }

    // Best gameweek points
    if (data.bestGw && (data.bestGw.points < 20 || data.bestGw.points > 200)) {
      warnings.push(`Best gameweek points (${data.bestGw.points}) outside typical range (20-200)`)
    }

    // Captain accuracy
    if (data.captainAccuracy < 0 || data.captainAccuracy > 100) {
      errors.push("Captain accuracy must be between 0 and 100")
    }

    // Badge validation
    if (!Array.isArray(data.badges)) {
      errors.push("Badges must be an array")
    } else if (data.badges.length > 10) {
      warnings.push(`High number of badges: ${data.badges.length}`)
    }
  }

  static validateEndpointResponse(response: any): boolean {
    if (!response || typeof response !== "object") {
      return false
    }

    // Check required fields exist
    const requiredFields = ["managerName", "teamName", "totalPoints"]
    return requiredFields.every((field) => field in response)
  }

  static sanitizeData(data: FPLData): FPLData {
    // Create a deep copy and sanitize
    const sanitized = JSON.parse(JSON.stringify(data))

    // Ensure numeric fields are numbers
    sanitized.totalPoints = Number(sanitized.totalPoints) || 0
    sanitized.overallRank = sanitized.overallRank ? Number(sanitized.overallRank) : null
    sanitized.bestRank = Number(sanitized.bestRank) || 999999
    sanitized.averagePointsPerGW = Number(sanitized.averagePointsPerGW) || 0
    sanitized.greenArrows = Number(sanitized.greenArrows) || 0
    sanitized.redArrows = Number(sanitized.redArrows) || 0
    sanitized.captainAccuracy = Math.max(0, Math.min(100, Number(sanitized.captainAccuracy) || 0))

    // Ensure arrays are arrays
    sanitized.badges = Array.isArray(sanitized.badges) ? sanitized.badges : []
    sanitized.chipsUsed = Array.isArray(sanitized.chipsUsed) ? sanitized.chipsUsed : []

    // Sanitize strings
    sanitized.managerName = String(sanitized.managerName || "Manager").trim()
    sanitized.teamName = String(sanitized.teamName || "FPL Team").trim()

    return sanitized
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = {
    apiCalls: 0,
    averageResponseTime: 0,
    errorRate: 0,
    cacheHitRate: 0,
  }

  static recordApiCall(responseTime: number, success: boolean) {
    this.metrics.apiCalls++
    this.metrics.averageResponseTime = (this.metrics.averageResponseTime + responseTime) / 2

    if (!success) {
      this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.apiCalls - 1) + 1) / this.metrics.apiCalls
    }
  }

  static getMetrics() {
    return { ...this.metrics }
  }

  static reset() {
    this.metrics = {
      apiCalls: 0,
      averageResponseTime: 0,
      errorRate: 0,
      cacheHitRate: 0,
    }
  }
}
