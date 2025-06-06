import { FinalDataValidator } from "./final-data-validator"
import { PerformanceMonitor } from "./performance-monitor"
import { ProductionMonitor } from "./production-monitoring"
import type { FPLData } from "@/types/fpl"

export interface DeploymentStatus {
  ready: boolean
  score: number
  issues: string[]
  recommendations: string[]
  dataQuality: number
  performance: string
  monitoring: string
}

export class DeploymentChecker {
  static async checkDeploymentReadiness(testData?: FPLData): Promise<DeploymentStatus> {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    console.log("🔍 Running deployment readiness check...")

    // 1. Data Validation Check
    let dataQuality = 0
    if (testData) {
      const validation = FinalDataValidator.validateForDeployment(testData)
      dataQuality = validation.score

      if (!validation.isValid) {
        issues.push("Data validation failed")
        score -= 30
      }

      if (validation.score < 90) {
        issues.push(`Data quality below threshold: ${validation.score}/100`)
        score -= 20
      }

      if (validation.errors.length > 0) {
        issues.push(`${validation.errors.length} critical data errors`)
        score -= 25
      }

      if (validation.warnings.length > 5) {
        issues.push(`${validation.warnings.length} data warnings`)
        score -= 10
      }

      recommendations.push(...validation.recommendations)
    } else {
      recommendations.push("Test with real data before deployment")
      score -= 10
    }

    // 2. Performance Check
    const performanceReady = PerformanceMonitor.isDeploymentReady()
    const performanceGrade = performanceReady ? "GOOD" : "NEEDS_IMPROVEMENT"

    if (!performanceReady) {
      issues.push("Performance metrics below deployment threshold")
      score -= 25
    }

    // 3. Monitoring Check
    const healthStatus = ProductionMonitor.getHealthStatus()
    const monitoringGrade = healthStatus.status === "healthy" ? "HEALTHY" : "DEGRADED"

    if (healthStatus.status !== "healthy") {
      issues.push(`System health: ${healthStatus.status}`)
      score -= 15
    }

    if (healthStatus.successRate < 95) {
      issues.push(`Low success rate: ${healthStatus.successRate}%`)
      score -= 20
    }

    // 4. Environment Check
    const envCheck = this.checkEnvironment()
    if (!envCheck.ready) {
      issues.push(...envCheck.issues)
      score -= envCheck.penalty
    }

    // 5. Security Check
    const securityCheck = this.checkSecurity()
    if (!securityCheck.ready) {
      issues.push(...securityCheck.issues)
      score -= securityCheck.penalty
    }

    // Generate final recommendations
    if (score < 80) {
      recommendations.push("Address critical issues before deployment")
    }
    if (issues.length > 0) {
      recommendations.push("Fix all identified issues")
    }
    if (dataQuality < 90) {
      recommendations.push("Improve data quality and validation")
    }

    const ready = score >= 80 && issues.length === 0

    console.log(`🎯 Deployment readiness: ${ready ? "✅ READY" : "❌ NOT READY"} (Score: ${score}/100)`)

    return {
      ready,
      score,
      issues,
      recommendations,
      dataQuality,
      performance: performanceGrade,
      monitoring: monitoringGrade,
    }
  }

  private static checkEnvironment(): { ready: boolean; issues: string[]; penalty: number } {
    const issues: string[] = []
    let penalty = 0

    // Check critical environment variables
    const requiredEnvVars = ["NODE_ENV", "NEXT_PUBLIC_APP_URL"]

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        issues.push(`Missing environment variable: ${envVar}`)
        penalty += 10
      }
    }

    // Check production settings
    if (process.env.NODE_ENV !== "production") {
      issues.push("Not running in production mode")
      penalty += 5
    }

    return {
      ready: issues.length === 0,
      issues,
      penalty,
    }
  }

  private static checkSecurity(): { ready: boolean; issues: string[]; penalty: number } {
    const issues: string[] = []
    let penalty = 0

    // Check HTTPS in production
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://")) {
      issues.push("HTTPS not configured for production")
      penalty += 15
    }

    // Check rate limiting
    if (!process.env.FEATURE_RATE_LIMIT || process.env.FEATURE_RATE_LIMIT !== "true") {
      issues.push("Rate limiting not enabled")
      penalty += 10
    }

    return {
      ready: issues.length === 0,
      issues,
      penalty,
    }
  }

  static generateDeploymentReport(status: DeploymentStatus): string {
    let report = "🚀 DEPLOYMENT READINESS REPORT\n"
    report += "===============================\n\n"

    report += `Status: ${status.ready ? "✅ READY FOR DEPLOYMENT" : "❌ NOT READY"}\n`
    report += `Overall Score: ${status.score}/100\n\n`

    report += "📊 Component Status:\n"
    report += `- Data Quality: ${status.dataQuality}/100\n`
    report += `- Performance: ${status.performance}\n`
    report += `- Monitoring: ${status.monitoring}\n\n`

    if (status.issues.length > 0) {
      report += "🚨 Issues to Address:\n"
      status.issues.forEach((issue, i) => {
        report += `${i + 1}. ${issue}\n`
      })
      report += "\n"
    }

    if (status.recommendations.length > 0) {
      report += "💡 Recommendations:\n"
      status.recommendations.forEach((rec, i) => {
        report += `${i + 1}. ${rec}\n`
      })
      report += "\n"
    }

    report += "📈 Performance Report:\n"
    report += PerformanceMonitor.generatePerformanceReport()

    return report
  }
}
