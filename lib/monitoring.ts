// Production monitoring and analytics utilities
export class ProductionMonitor {
  private static instance: ProductionMonitor
  private metrics: Map<string, number> = new Map()
  private errors: Array<{ timestamp: number; error: string; context?: any }> = []
  private readonly MAX_ERRORS = 1000
  private readonly MAX_METRICS = 500

  static getInstance(): ProductionMonitor {
    if (!ProductionMonitor.instance) {
      ProductionMonitor.instance = new ProductionMonitor()
    }
    return ProductionMonitor.instance
  }

  // Track API performance
  trackApiCall(endpoint: string, duration: number, success: boolean) {
    const key = `api_${endpoint}_${success ? "success" : "error"}`
    this.incrementMetric(key)
    this.incrementMetric(`api_${endpoint}_duration`, duration)

    // Log slow requests
    if (duration > 5000) {
      console.warn(`Slow API call: ${endpoint} took ${duration}ms`)
    }
  }

  // Track user interactions
  trackUserAction(action: string, metadata?: any) {
    this.incrementMetric(`user_${action}`)
    if (metadata) {
      console.log(`User action: ${action}`, metadata)
    }
  }

  // Track errors with context
  trackError(error: Error | string, context?: any) {
    const errorEntry = {
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : error,
      context,
    }

    this.errors.push(errorEntry)

    // Keep errors array manageable
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.splice(0, this.errors.length - this.MAX_ERRORS)
    }

    console.error("Tracked error:", errorEntry)
  }

  // Increment metric counter
  private incrementMetric(key: string, value = 1) {
    const current = this.metrics.get(key) || 0
    this.metrics.set(key, current + value)

    // Keep metrics map manageable
    if (this.metrics.size > this.MAX_METRICS) {
      const oldestKey = this.metrics.keys().next().value
      if (oldestKey) this.metrics.delete(oldestKey)
    }
  }

  // Get current metrics
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // Get recent errors
  getRecentErrors(limit = 50) {
    return this.errors.slice(-limit)
  }

  // Health check
  getHealthStatus() {
    const recentErrors = this.errors.filter((e) => Date.now() - e.timestamp < 300000) // 5 minutes
    const errorRate = recentErrors.length

    return {
      status: errorRate < 10 ? "healthy" : errorRate < 50 ? "degraded" : "unhealthy",
      errorCount: errorRate,
      uptime: Date.now(),
      metrics: this.getMetrics(),
    }
  }
}

// Global error handler
export function setupGlobalErrorHandling() {
  if (typeof window !== "undefined") {
    const monitor = ProductionMonitor.getInstance()

    window.addEventListener("error", (event) => {
      monitor.trackError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    window.addEventListener("unhandledrejection", (event) => {
      monitor.trackError(`Unhandled Promise Rejection: ${event.reason}`, {
        type: "unhandledrejection",
      })
    })
  }
}
