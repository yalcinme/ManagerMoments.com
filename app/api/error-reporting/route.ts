import { type NextRequest, NextResponse } from "next/server"
import { RateLimiter } from "@/lib/rate-limiter"

// Rate limiter for error reporting
const rateLimiter = RateLimiter.getInstance()

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.ip || "anonymous"
    if (!rateLimiter.checkLimit(clientId, 10, 60)) {
      return NextResponse.json({ error: "Too many error reports" }, { status: 429 })
    }

    const { errors } = await request.json()

    // Validate the request
    if (!Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json({ error: "Invalid error data" }, { status: 400 })
    }

    // Process errors (you can add your own logic here)
    for (const error of errors) {
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error Report:", {
          message: error.message,
          severity: error.severity,
          url: error.url,
          timestamp: new Date(error.timestamp).toISOString(),
          userAgent: error.userAgent,
          context: error.context,
        })
      }

      // Send to external error reporting service (server-side only)
      if (process.env.ERROR_REPORTING_ENDPOINT && process.env.ERROR_REPORTING_TOKEN) {
        try {
          await fetch(process.env.ERROR_REPORTING_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.ERROR_REPORTING_TOKEN}`,
            },
            body: JSON.stringify({ error }),
          })
        } catch (externalError) {
          console.error("Failed to send to external service:", externalError)
        }
      }

      // You can also send to other services like:
      // - Sentry
      // - Bugsnag
      // - LogRocket
      // - Custom logging service
      // - Database for storage
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
