import { type NextRequest, NextResponse } from "next/server"
import { RateLimiter } from "@/lib/production-cache"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.ip || "anonymous"
    if (!RateLimiter.isAllowed(clientId)) {
      return NextResponse.json({ error: "Too many error reports" }, { status: 429 })
    }

    const { errors } = await request.json()

    // Validate the request
    if (!Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json({ error: "Invalid error data" }, { status: 400 })
    }

    // Process errors
    for (const error of errors) {
      // Log to console for monitoring
      console.error("Error Report:", {
        message: error.message,
        severity: error.severity,
        url: error.url,
        timestamp: new Date(error.timestamp).toISOString(),
        userAgent: error.userAgent,
        context: error.context,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in error reporting endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Health check for the error reporting endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "error-reporting",
    timestamp: new Date().toISOString(),
  })
}
