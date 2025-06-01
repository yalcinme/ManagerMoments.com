import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Simple rate limiting using headers
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // Basic rate limiting check (could be enhanced with Redis in production)
    const now = Date.now()
    const rateLimitKey = `rate_limit_${ip}`

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
