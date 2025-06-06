import type { FPLData } from "@/types/fpl"

export interface ValidationError {
  field: string
  message: string
  severity: "error" | "warning"
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  score: number // 0-100 data quality score
}

export class DataValidator {
  static validateFPLData(data: FPLData): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []

    // Validate basic structure
    this.validateBasicFields(data, errors)

    // Validate 2024/25 season specific ranges
    this.validate2024Season(data, errors, warnings)

    // Validate calculations
    this.validateCalculations(data, errors, warnings)

    // Validate data consistency
    this.validateConsistency(data, errors, warnings)

    const score = this.calculateDataQualityScore(data, errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    }
  }

  private static validateBasicFields(data: FPLData, errors: ValidationError[]) {
    if (!data.managerName?.trim()) {
      errors.push({ field: "managerName", message: "Manager name is required", severity: "error" })
    }

    if (!data.teamName?.trim()) {
      errors.push({ field: "teamName", message: "Team name is required", severity: "error" })
    }

    if (typeof data.totalPoints !== "number" || data.totalPoints < 0) {
      errors.push({ field: "totalPoints", message: "Total points must be a positive number", severity: "error" })
    }

    if (data.overallRank && (typeof data.overallRank !== "number" || data.overallRank < 1)) {
      errors.push({ field: "overallRank", message: "Overall rank must be a positive number", severity: "error" })
    }
  }

  private static validate2024Season(data: FPLData, errors: ValidationError[], warnings: ValidationError[]) {
    // 2024/25 season specific validations

    // Total points range for 2024/25
    if (data.totalPoints < 100 || data.totalPoints > 4000) {
      warnings.push({
        field: "totalPoints",
        message: `Total points (${data.totalPoints}) outside typical 2024/25 range (100-3500)`,
        severity: "warning",
      })
    }

    // Overall rank range for 2024/25 (approximately 11 million players)
    if (data.overallRank && (data.overallRank < 1 || data.overallRank > 12000000)) {
      warnings.push({
        field: "overallRank",
        message: `Overall rank (${data.overallRank}) outside 2024/25 range (1-11M)`,
        severity: "warning",
      })
    }

    // Best gameweek points for 2024/25
    if (data.bestGw && (data.bestGw.points < 5 || data.bestGw.points > 200)) {
      warnings.push({
        field: "bestGw.points",
        message: `Best gameweek points (${data.bestGw.points}) outside typical 2024/25 range (5-180)`,
        severity: "warning",
      })
    }

    // Gameweek range validation for 2024/25 season
    if (data.bestGw && (data.bestGw.gameweek < 1 || data.bestGw.gameweek > 38)) {
      errors.push({
        field: "bestGw.gameweek",
        message: "Best gameweek must be between 1 and 38 for 2024/25 season",
        severity: "error",
      })
    }

    if (data.worstGw && (data.worstGw.gameweek < 1 || data.worstGw.gameweek > 38)) {
      errors.push({
        field: "worstGw.gameweek",
        message: "Worst gameweek must be between 1 and 38 for 2024/25 season",
        severity: "error",
      })
    }

    // Captain accuracy for 2024/25
    if (data.captainAccuracy < 0 || data.captainAccuracy > 100) {
      errors.push({
        field: "captainAccuracy",
        message: "Captain accuracy must be between 0 and 100",
        severity: "error",
      })
    }

    // Average points per gameweek for 2024/25
    if (data.averagePointsPerGW < 0 || data.averagePointsPerGW > 120) {
      warnings.push({
        field: "averagePointsPerGW",
        message: `Average points per GW (${data.averagePointsPerGW}) outside typical 2024/25 range (20-100)`,
        severity: "warning",
      })
    }

    // Green/Red arrows validation for 2024/25 (max 37 possible changes)
    const totalArrows = data.greenArrows + data.redArrows
    if (totalArrows > 37) {
      warnings.push({
        field: "arrows",
        message: `Total arrows (${totalArrows}) exceeds maximum possible (37) for 2024/25 season`,
        severity: "warning",
      })
    }
  }

  private static validateCalculations(data: FPLData, errors: ValidationError[], warnings: ValidationError[]) {
    // Validate average points calculation for 38 gameweeks
    const expectedAverage = data.totalPoints / 38
    const actualAverage = data.averagePointsPerGW

    if (Math.abs(expectedAverage - actualAverage) > 1) {
      warnings.push({
        field: "averagePointsPerGW",
        message: `Average points calculation may be incorrect. Expected: ${expectedAverage.toFixed(1)}, Got: ${actualAverage}`,
        severity: "warning",
      })
    }

    // Validate captain performance calculations
    if (data.captainPerformance) {
      const { totalPoints: captainPoints, averagePoints } = data.captainPerformance
      const expectedCaptainAvg = captainPoints / 38

      if (Math.abs(averagePoints - expectedCaptainAvg) > 1) {
        warnings.push({
          field: "captainPerformance.averagePoints",
          message: `Captain average calculation inconsistent. Expected: ${expectedCaptainAvg.toFixed(1)}, Got: ${averagePoints}`,
          severity: "warning",
        })
      }

      // Captain points should be reasonable percentage of total (15-35% typical)
      const captainPercentage = (captainPoints / data.totalPoints) * 100
      if (captainPercentage < 10 || captainPercentage > 40) {
        warnings.push({
          field: "captainPerformance.totalPoints",
          message: `Captain points percentage unusual for 2024/25: ${captainPercentage.toFixed(1)}%`,
          severity: "warning",
        })
      }
    }

    // Validate MVP percentage
    if (data.mvpPlayer) {
      const calculatedPercentage = (data.mvpPlayer.totalPoints / data.totalPoints) * 100
      if (Math.abs(calculatedPercentage - data.mvpPlayer.percentageOfTeamScore) > 2) {
        warnings.push({
          field: "mvpPlayer.percentageOfTeamScore",
          message: `MVP percentage calculation inconsistent`,
          severity: "warning",
        })
      }
    }
  }

  private static validateConsistency(data: FPLData, errors: ValidationError[], warnings: ValidationError[]) {
    // Validate best rank vs overall rank
    if (data.overallRank && data.bestRank && data.bestRank > data.overallRank) {
      warnings.push({
        field: "bestRank",
        message: "Best rank should be better (lower) than overall rank",
        severity: "warning",
      })
    }

    // Validate transfer consistency
    if (data.transferActivity) {
      const { totalTransfers, totalHits } = data.transferActivity
      if (totalHits > totalTransfers) {
        errors.push({
          field: "transferActivity.totalHits",
          message: "Total hits cannot exceed total transfers",
          severity: "error",
        })
      }

      // Validate transfer ranges for 2024/25
      if (totalTransfers > 100) {
        warnings.push({
          field: "transferActivity.totalTransfers",
          message: `Very high transfer count (${totalTransfers}) for 2024/25 season`,
          severity: "warning",
        })
      }
    }

    // Validate bench points consistency
    if (data.benchAnalysis) {
      const { totalBenchPoints, averagePerGW } = data.benchAnalysis
      const expectedAvg = totalBenchPoints / 38

      if (Math.abs(expectedAvg - averagePerGW) > 0.5) {
        warnings.push({
          field: "benchAnalysis.averagePerGW",
          message: `Bench average calculation inconsistent`,
          severity: "warning",
        })
      }
    }
  }

  private static calculateDataQualityScore(
    data: FPLData,
    errors: ValidationError[],
    warnings: ValidationError[],
  ): number {
    let score = 100

    // Deduct points for errors and warnings
    score -= errors.length * 20
    score -= warnings.length * 5

    // Bonus points for data completeness and 2024/25 accuracy
    if (data.bestGw?.topContributors?.length > 0) score += 5
    if (data.chipsUsed?.length > 0) score += 5
    if (data.badges?.length > 0) score += 5
    if (data.mvpPlayer?.name && data.mvpPlayer.name !== "Unknown") score += 5
    if (data.captainPerformance?.bestCaptain?.name) score += 5
    if (data.oneGotAway?.playerName && data.oneGotAway.playerName !== "Unknown") score += 5

    // Bonus for realistic 2024/25 ranges
    if (data.totalPoints >= 1000 && data.totalPoints <= 3500) score += 5
    if (data.overallRank && data.overallRank <= 11000000) score += 5
    if (data.averagePointsPerGW >= 30 && data.averagePointsPerGW <= 100) score += 5

    return Math.max(0, Math.min(100, score))
  }

  static sanitizeData(data: FPLData): FPLData {
    const sanitized = { ...data }

    // Sanitize numeric fields with 2024/25 realistic ranges
    sanitized.totalPoints = Math.max(0, Math.min(4000, Number(sanitized.totalPoints) || 0))
    sanitized.overallRank = sanitized.overallRank
      ? Math.max(1, Math.min(12000000, Number(sanitized.overallRank)))
      : null
    sanitized.bestRank = Math.max(1, Number(sanitized.bestRank) || 999999)
    sanitized.averagePointsPerGW = Math.max(0, Math.min(120, Number(sanitized.averagePointsPerGW) || 0))
    sanitized.greenArrows = Math.max(0, Math.min(37, Number(sanitized.greenArrows) || 0))
    sanitized.redArrows = Math.max(0, Math.min(37, Number(sanitized.redArrows) || 0))
    sanitized.captainAccuracy = Math.max(0, Math.min(100, Number(sanitized.captainAccuracy) || 0))

    // Sanitize strings
    sanitized.managerName = String(sanitized.managerName || "Manager").trim()
    sanitized.teamName = String(sanitized.teamName || "FPL Team").trim()

    // Sanitize arrays
    sanitized.badges = Array.isArray(sanitized.badges) ? sanitized.badges : []
    sanitized.chipsUsed = Array.isArray(sanitized.chipsUsed) ? sanitized.chipsUsed : []

    // Sanitize gameweek ranges
    if (sanitized.bestGw) {
      sanitized.bestGw.gameweek = Math.max(1, Math.min(38, sanitized.bestGw.gameweek))
      sanitized.bestGw.points = Math.max(0, Math.min(200, sanitized.bestGw.points))
    }

    if (sanitized.worstGw) {
      sanitized.worstGw.gameweek = Math.max(1, Math.min(38, sanitized.worstGw.gameweek))
      sanitized.worstGw.points = Math.max(0, Math.min(200, sanitized.worstGw.points))
    }

    return sanitized
  }
}
