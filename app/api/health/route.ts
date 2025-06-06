import { NextResponse } from "next/server"
import { ProductionMonitor } from "@/lib/production-monitoring"
import { ProductionCache, RateLimiter } from "@/lib/production-cache"

export async function GET() {
  try {
    const healthStatus = ProductionMonitor.getHealthStatus()
    const cacheStats = ProductionCache.getStats()
    const metrics = ProductionMonitor.getMetrics()

    // Cleanup rate limiter periodically
    RateLimiter.cleanup()

    const health = {
      status: healthStatus.status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime() * 1000, // Convert to milliseconds

      api: {
        status: healthStatus.status,
        totalRequests: metrics.totalRequests,
        successRate: Math.round((metrics.successfulRequests / Math.max(metrics.totalRequests, 1)) * 100),
        averageResponseTime: Math.round(healthStatus.averageResponseTime),
        errorsByType: metrics.errorsByType,
      },

      cache: {
        size: cacheStats.total,
        validEntries: cacheStats.valid,
        expiredEntries: cacheStats.expired,
        memoryUsage: Math.round(cacheStats.memoryUsage / 1024), // KB
      },

      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
        external: Math.round(process.memoryUsage().external / 1024 / 1024), // MB
      },

      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    }

    const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Health check error:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 },
    )
  }
}
