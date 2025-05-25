import { NextResponse } from "next/server"
import { CacheManager } from "@/lib/cache-manager"
import { RateLimiter } from "@/lib/rate-limiter"
import { ProductionMonitor } from "@/lib/monitoring"

export async function GET() {
  try {
    const cache = CacheManager.getInstance()
    const rateLimiter = RateLimiter.getInstance()
    const monitor = ProductionMonitor.getInstance()

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cache: cache.getStats(),
      rateLimiter: rateLimiter.getStats(),
      monitor: monitor.getHealthStatus(),
      version: "1.0.0",
    }

    return NextResponse.json(health, {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
