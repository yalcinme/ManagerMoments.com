import { type NextRequest, NextResponse } from "next/server"
import { RateLimiter } from "@/lib/rate-limiter"

const rateLimiter = RateLimiter.getInstance()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.ip || "anonymous"
    if (!rateLimiter.checkLimit(clientId, 30, 60)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { metrics } = await request.json()

    if (!Array.isArray(metrics)) {
      return NextResponse.json({ error: "Invalid metrics data" }, { status: 400 })
    }

    // Process performance metrics
    for (const metric of metrics) {
      // Log in development
      if (process.env.NODE_ENV === "development") {
        console.log("Performance Metric:", {
          name: metric.name,
          value: metric.value,
          timestamp: new Date(metric.timestamp).toISOString(),
          metadata: metric.metadata,
        })
      }

      // Send to performance monitoring service (server-side only)
      if (process.env.PERFORMANCE_ENDPOINT && process.env.PERFORMANCE_TOKEN) {
        try {
          await fetch(process.env.PERFORMANCE_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.PERFORMANCE_TOKEN}`,
            },
            body: JSON.stringify({ metric }),
          })
        } catch (error) {
          console.error("Failed to send to performance service:", error)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in performance endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "performance",
    timestamp: new Date().toISOString(),
  })
}
