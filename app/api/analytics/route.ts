import { type NextRequest, NextResponse } from "next/server"
import { RateLimiter } from "@/lib/rate-limiter"

const rateLimiter = RateLimiter.getInstance()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.ip || "anonymous"
    if (!rateLimiter.checkLimit(clientId, 50, 60)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { events } = await request.json()

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid events data" }, { status: 400 })
    }

    // Process analytics events
    for (const event of events) {
      // Log in development
      if (process.env.NODE_ENV === "development") {
        console.log("Analytics Event:", {
          type: event.type,
          name: event.name,
          timestamp: new Date(event.timestamp).toISOString(),
          properties: event.properties,
        })
      }

      // Send to analytics service (server-side only)
      if (process.env.ANALYTICS_ENDPOINT && process.env.ANALYTICS_TOKEN) {
        try {
          await fetch(process.env.ANALYTICS_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.ANALYTICS_TOKEN}`,
            },
            body: JSON.stringify({ event }),
          })
        } catch (error) {
          console.error("Failed to send to analytics service:", error)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in analytics endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "analytics",
    timestamp: new Date().toISOString(),
  })
}
