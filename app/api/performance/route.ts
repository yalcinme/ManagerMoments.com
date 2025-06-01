import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { metrics } = await request.json()

    if (!metrics || typeof metrics !== "object") {
      return NextResponse.json({ error: "Invalid metrics data" }, { status: 400 })
    }

    // Log performance metrics in development
    if (process.env.NODE_ENV === "development") {
      console.log("Performance Metrics:", {
        timestamp: new Date().toISOString(),
        metrics,
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
          body: JSON.stringify({ metrics }),
        })
      } catch (error) {
        console.error("Failed to send to performance service:", error)
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
