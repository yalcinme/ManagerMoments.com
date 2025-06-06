import type { FPLData } from "@/types/fpl"

export interface ValidationReport {
  isValid: boolean
  score: number // 0-100
  errors: string[]
  warnings: string[]
  dataQuality: {
    completeness: number
    accuracy: number
    consistency: number
    realism: number
  }
  recommendations: string[]
}

export class FinalDataValidator {
  static validateForDeployment(data: FPLData): ValidationReport {
    const errors: string[] = []
    const warnings: string[] = []
    const recommendations: string[] = []

    // 1. Essential Data Validation
    const essentialChecks = this.validateEssentialData(data, errors)

    // 2. Mathematical Consistency
    const mathChecks = this.validateMathematicalConsistency(data, errors, warnings)

    // 3. 2024/25 Season Realism
    const realismChecks = this.validate2024SeasonRealism(data, warnings)

    // 4. Captain Data Accuracy
    const captainChecks = this.validateCaptainData(data, errors, warnings)

    // 5. Performance Metrics
    const performanceChecks = this.validatePerformanceMetrics(data, warnings)

    // 6. Data Completeness
    const completenessChecks = this.validateDataCompleteness(data, warnings, recommendations)

    // Calculate quality scores
    const dataQuality = {
      completeness: completenessChecks,
      accuracy: mathChecks,
      consistency: essentialChecks,
      realism: realismChecks,
    }

    // Calculate overall score
    const score = this.calculateOverallScore(dataQuality, errors.length, warnings.length)

    // Generate recommendations
    if (score < 90) {
      recommendations.push("Consider improving data quality before deployment")
    }
    if (errors.length > 0) {
      recommendations.push("Fix all critical errors before going live")
    }
    if (warnings.length > 5) {
      recommendations.push("Review and address data warnings")
    }

    return {
      isValid: errors.length === 0 && score >= 80,
      score,
      errors,
      warnings,
      dataQuality,
      recommendations,
    }
  }

  private static validateEssentialData(data: FPLData, errors: string[]): number {
    let score = 100

    // Manager info
    if (!data.managerName?.trim()) {
      errors.push("Manager name is missing")
      score -= 20
    }
    if (!data.teamName?.trim()) {
      errors.push("Team name is missing")
      score -= 20
    }

    // Core stats
    if (typeof data.totalPoints !== "number" || data.totalPoints < 0) {
      errors.push("Invalid total points")
      score -= 25
    }
    if (data.overallRank && (typeof data.overallRank !== "number" || data.overallRank < 1)) {
      errors.push("Invalid overall rank")
      score -= 15
    }

    // Essential objects
    if (!data.bestGw || typeof data.bestGw.points !== "number") {
      errors.push("Best gameweek data is invalid")
      score -= 20
    }
    if (!data.captainPerformance || typeof data.captainPerformance.totalPoints !== "number") {
      errors.push("Captain performance data is invalid")
      score -= 20
    }

    return Math.max(0, score)
  }

  private static validateMathematicalConsistency(data: FPLData, errors: string[], warnings: string[]): number {
    let score = 100

    // Average points calculation
    if (data.totalPoints > 0 && data.averagePointsPerGW > 0) {
      const expectedAvg = data.totalPoints / 38
      const actualAvg = data.averagePointsPerGW
      const difference = Math.abs(expectedAvg - actualAvg)

      if (difference > 2) {
        errors.push(`Average points calculation error: Expected ${expectedAvg.toFixed(1)}, got ${actualAvg}`)
        score -= 25
      } else if (difference > 1) {
        warnings.push(`Minor average points discrepancy: ${difference.toFixed(1)} points`)
        score -= 10
      }
    }

    // Captain performance consistency
    if (data.captainPerformance) {
      const { totalPoints: captainTotal, averagePoints } = data.captainPerformance
      const expectedCaptainAvg = captainTotal / 38

      if (Math.abs(averagePoints - expectedCaptainAvg) > 1) {
        warnings.push("Captain average calculation inconsistency")
        score -= 15
      }

      // Captain contribution should be reasonable (15-35% of total)
      const captainPercentage = (captainTotal / data.totalPoints) * 100
      if (captainPercentage < 10 || captainPercentage > 40) {
        warnings.push(`Unusual captain contribution: ${captainPercentage.toFixed(1)}%`)
        score -= 10
      }
    }

    // Arrow consistency
    const totalArrows = data.greenArrows + data.redArrows
    if (totalArrows > 37) {
      errors.push(`Too many arrows: ${totalArrows} (max 37)`)
      score -= 20
    }

    return Math.max(0, score)
  }

  private static validate2024SeasonRealism(data: FPLData, warnings: string[]): number {
    let score = 100

    // Total points realism for 2024/25
    if (data.totalPoints < 500 || data.totalPoints > 3500) {
      warnings.push(`Total points outside typical 2024/25 range: ${data.totalPoints}`)
      score -= 15
    }

    // Rank realism
    if (data.overallRank && (data.overallRank < 1 || data.overallRank > 11000000)) {
      warnings.push(`Overall rank outside 2024/25 range: ${data.overallRank}`)
      score -= 15
    }

    // Best gameweek realism
    if (data.bestGw && (data.bestGw.points < 20 || data.bestGw.points > 180)) {
      warnings.push(`Best gameweek points unusual for 2024/25: ${data.bestGw.points}`)
      score -= 10
    }

    // Captain average realism
    if (
      data.captainPerformance &&
      (data.captainPerformance.averagePoints < 4 || data.captainPerformance.averagePoints > 25)
    ) {
      warnings.push(`Captain average outside typical range: ${data.captainPerformance.averagePoints}`)
      score -= 10
    }

    return Math.max(0, score)
  }

  private static validateCaptainData(data: FPLData, errors: string[], warnings: string[]): number {
    let score = 100

    if (!data.captainPerformance) {
      errors.push("Captain performance data missing")
      return 0
    }

    const { totalPoints, averagePoints, failRate, bestCaptain, worstCaptain } = data.captainPerformance

    // Validate captain totals
    if (totalPoints < 0 || totalPoints > 1500) {
      warnings.push(`Captain total points unusual: ${totalPoints}`)
      score -= 15
    }

    // Validate averages
    if (averagePoints < 2 || averagePoints > 30) {
      warnings.push(`Captain average unusual: ${averagePoints}`)
      score -= 15
    }

    // Validate fail rate
    if (failRate < 0 || failRate > 100) {
      errors.push(`Invalid captain fail rate: ${failRate}`)
      score -= 25
    }

    // Validate best/worst captain
    if (!bestCaptain?.name || !worstCaptain?.name) {
      warnings.push("Missing best/worst captain data")
      score -= 10
    }

    if (bestCaptain && (bestCaptain.points < 0 || bestCaptain.points > 60)) {
      warnings.push(`Best captain points unusual: ${bestCaptain.points}`)
      score -= 10
    }

    return Math.max(0, score)
  }

  private static validatePerformanceMetrics(data: FPLData, warnings: string[]): number {
    let score = 100

    // Transfer activity
    if (data.transferActivity) {
      const { totalTransfers, totalHits } = data.transferActivity
      if (totalTransfers < 0 || totalTransfers > 150) {
        warnings.push(`Transfer count unusual: ${totalTransfers}`)
        score -= 10
      }
      if (totalHits > totalTransfers) {
        warnings.push("More hits than transfers")
        score -= 15
      }
    }

    // Bench analysis
    if (data.benchAnalysis) {
      const { totalBenchPoints, averagePerGW } = data.benchAnalysis
      if (totalBenchPoints < 0 || totalBenchPoints > 500) {
        warnings.push(`Bench points unusual: ${totalBenchPoints}`)
        score -= 10
      }
      if (averagePerGW < 0 || averagePerGW > 15) {
        warnings.push(`Bench average unusual: ${averagePerGW}`)
        score -= 10
      }
    }

    // MVP player
    if (data.mvpPlayer) {
      const { percentageOfTeamScore, pointsPerGame } = data.mvpPlayer
      if (percentageOfTeamScore < 5 || percentageOfTeamScore > 40) {
        warnings.push(`MVP percentage unusual: ${percentageOfTeamScore}%`)
        score -= 10
      }
      if (pointsPerGame < 2 || pointsPerGame > 20) {
        warnings.push(`MVP points per game unusual: ${pointsPerGame}`)
        score -= 10
      }
    }

    return Math.max(0, score)
  }

  private static validateDataCompleteness(data: FPLData, warnings: string[], recommendations: string[]): number {
    let score = 100

    // Check for missing optional data
    if (!data.bestGw?.topContributors?.length) {
      warnings.push("Missing top contributors data")
      score -= 5
      recommendations.push("Add top contributors for better insights")
    }

    if (!data.chipsUsed?.length) {
      warnings.push("No chips data available")
      score -= 5
      recommendations.push("Include chip usage data if available")
    }

    if (!data.badges?.length) {
      warnings.push("No badges assigned")
      score -= 5
      recommendations.push("Generate achievement badges")
    }

    if (!data.mvpPlayer?.name || data.mvpPlayer.name === "Unknown") {
      warnings.push("MVP player not identified")
      score -= 10
      recommendations.push("Improve MVP player detection")
    }

    if (!data.oneGotAway?.playerName || data.oneGotAway.playerName === "Unknown") {
      warnings.push("Top scorer never owned not identified")
      score -= 10
      recommendations.push("Enhance player analysis")
    }

    return Math.max(0, score)
  }

  private static calculateOverallScore(
    dataQuality: { completeness: number; accuracy: number; consistency: number; realism: number },
    errorCount: number,
    warningCount: number,
  ): number {
    // Base score from data quality
    const baseScore =
      (dataQuality.completeness + dataQuality.accuracy + dataQuality.consistency + dataQuality.realism) / 4

    // Penalties
    const errorPenalty = errorCount * 15
    const warningPenalty = warningCount * 3

    return Math.max(0, Math.min(100, baseScore - errorPenalty - warningPenalty))
  }

  static generateDeploymentReport(data: FPLData): string {
    const report = this.validateForDeployment(data)

    let output = "🚀 DEPLOYMENT READINESS REPORT\n"
    output += "================================\n\n"

    output += `Overall Score: ${report.score}/100 ${report.score >= 90 ? "🟢" : report.score >= 80 ? "🟡" : "🔴"}\n`
    output += `Status: ${report.isValid ? "✅ READY FOR DEPLOYMENT" : "❌ NEEDS FIXES"}\n\n`

    output += "📊 Data Quality Breakdown:\n"
    output += `- Completeness: ${report.dataQuality.completeness}/100\n`
    output += `- Accuracy: ${report.dataQuality.accuracy}/100\n`
    output += `- Consistency: ${report.dataQuality.consistency}/100\n`
    output += `- Realism: ${report.dataQuality.realism}/100\n\n`

    if (report.errors.length > 0) {
      output += "🚨 Critical Errors:\n"
      report.errors.forEach((error, i) => {
        output += `${i + 1}. ${error}\n`
      })
      output += "\n"
    }

    if (report.warnings.length > 0) {
      output += "⚠️ Warnings:\n"
      report.warnings.forEach((warning, i) => {
        output += `${i + 1}. ${warning}\n`
      })
      output += "\n"
    }

    if (report.recommendations.length > 0) {
      output += "💡 Recommendations:\n"
      report.recommendations.forEach((rec, i) => {
        output += `${i + 1}. ${rec}\n`
      })
      output += "\n"
    }

    return output
  }
}
