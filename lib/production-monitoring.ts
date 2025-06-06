interface APIMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  errorsByType: Record<string, number>
  lastUpdated: Date
}

interface PerformanceLog {
  timestamp: Date
  managerId: string
  responseTime: number
  success: boolean
  errorType?: string
  dataQualityScore?: number
  cacheHit: boolean
}

export class ProductionMonitor {
  private static metrics: APIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    errorsByType: {},
    lastUpdated: new Date(),
  }

  private static performanceLogs: PerformanceLog[] = []
  private static readonly MAX_LOGS = 1000

  static recordRequest(log: PerformanceLog) {
    // Update metrics
    this.metrics.totalRequests++
    this.metrics.lastUpdated = new Date()

    if (log.success) {
      this.metrics.successfulRequests++
    } else {
      this.metrics.failedRequests++
      if (log.errorType) {
        this.metrics.errorsByType[log.errorType] = (this.metrics.errorsByType[log.errorType] || 0) + 1
      }
    }

    // Update average response time
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + log.responseTime) /
      this.metrics.totalRequests

    // Store performance log
    this.performanceLogs.push(log)
    if (this.performanceLogs.length > this.MAX_LOGS) {
      this.performanceLogs.shift()
    }

    // Log critical issues
    if (!log.success) {
      console.error(`🚨 API Error for manager ${log.managerId}:`, {
        errorType: log.errorType,
        responseTime: log.responseTime,
        timestamp: log.timestamp,
      })
    }

    if (log.responseTime > 10000) {
      console.warn(`⚠️ Slow response for manager ${log.managerId}: ${log.responseTime}ms`)
    }

    if (log.dataQualityScore && log.dataQualityScore < 70) {
      console.warn(`⚠️ Low data quality for manager ${log.managerId}: ${log.dataQualityScore}%`)
    }
  }

  static getMetrics(): APIMetrics {
    return { ...this.metrics }
  }

  static getRecentLogs(limit = 100): PerformanceLog[] {
    return this.performanceLogs.slice(-limit)
  }

  static getHealthStatus() {
    const recentLogs = this.getRecentLogs(50)
    const recentSuccessRate =
      recentLogs.length > 0 ? (recentLogs.filter((log) => log.success).length / recentLogs.length) * 100 : 100

    const avgResponseTime =
      recentLogs.length > 0 ? recentLogs.reduce((sum, log) => sum + log.responseTime, 0) / recentLogs.length : 0

    return {
      status:
        recentSuccessRate >= 95 && avgResponseTime < 5000
          ? "healthy"
          : recentSuccessRate >= 80 && avgResponseTime < 10000
            ? "degraded"
            : "unhealthy",
      successRate: recentSuccessRate,
      averageResponseTime: avgResponseTime,
      totalRequests: this.metrics.totalRequests,
      uptime: Date.now() - this.metrics.lastUpdated.getTime(),
    }
  }

  static reset() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      errorsByType: {},
      lastUpdated: new Date(),
    }
    this.performanceLogs = []
  }
}

export class ErrorHandler {
  static handleFPLAPIError(error: any, managerId: string): { status: number; message: string; type: string } {
    console.error(`FPL API Error for manager ${managerId}:`, error)

    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return {
        status: 404,
        message: "Manager not found. Please check your FPL Manager ID and try again.",
        type: "MANAGER_NOT_FOUND",
      }
    }

    if (error.message?.includes("429") || error.message?.includes("rate limit")) {
      return {
        status: 429,
        message: "Too many requests. Please wait a moment and try again.",
        type: "RATE_LIMITED",
      }
    }

    if (error.message?.includes("timeout")) {
      return {
        status: 504,
        message: "Request timeout. The FPL API is responding slowly. Please try again.",
        type: "TIMEOUT",
      }
    }

    if (error.message?.includes("network") || error.message?.includes("fetch")) {
      return {
        status: 503,
        message: "Network error. Please check your connection and try again.",
        type: "NETWORK_ERROR",
      }
    }

    return {
      status: 503,
      message: "Unable to fetch FPL data. Please try again later.",
      type: "UNKNOWN_ERROR",
    }
  }

  static handleProcessingError(error: any, managerId: string): { status: number; message: string; type: string } {
    console.error(`Data Processing Error for manager ${managerId}:`, error)

    if (error.message?.includes("validation")) {
      return {
        status: 422,
        message: "Data validation failed. The FPL data appears to be incomplete.",
        type: "VALIDATION_ERROR",
      }
    }

    if (error.message?.includes("calculation")) {
      return {
        status: 422,
        message: "Data calculation error. Some statistics may be incorrect.",
        type: "CALCULATION_ERROR",
      }
    }

    return {
      status: 500,
      message: "Data processing failed. Please try again later.",
      type: "PROCESSING_ERROR",
    }
  }
}
