interface ErrorContext {
  endpoint?: string
  managerId?: string
  gameweek?: number
  timestamp: string
  userAgent?: string
  requestId?: string
}

interface ErrorLog {
  id: string
  type: "API_ERROR" | "VALIDATION_ERROR" | "NETWORK_ERROR" | "TIMEOUT_ERROR" | "PARSE_ERROR"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  message: string
  context: ErrorContext
  stackTrace?: string
  resolved: boolean
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLogs: ErrorLog[] = []
  private maxLogs = 1000

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  logError(
    type: ErrorLog["type"],
    severity: ErrorLog["severity"],
    message: string,
    context: Partial<ErrorContext> = {},
    error?: Error,
  ): string {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const errorLog: ErrorLog = {
      id: errorId,
      type,
      severity,
      message,
      context: {
        timestamp: new Date().toISOString(),
        ...context,
      },
      stackTrace: error?.stack,
      resolved: false,
    }

    this.errorLogs.push(errorLog)

    // Keep logs manageable
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.splice(0, this.errorLogs.length - this.maxLogs)
    }

    // Log to console based on severity
    const logMessage = `[${severity}] ${type}: ${message}`

    switch (severity) {
      case "CRITICAL":
        console.error("🚨", logMessage, context, error)
        break
      case "HIGH":
        console.error("❌", logMessage, context)
        break
      case "MEDIUM":
        console.warn("⚠️", logMessage, context)
        break
      case "LOW":
        console.log("ℹ️", logMessage, context)
        break
    }

    return errorId
  }

  handleFetchError(error: any, endpoint: string, managerId?: string): never {
    let errorType: ErrorLog["type"] = "NETWORK_ERROR"
    let severity: ErrorLog["severity"] = "HIGH"
    let message = "Unknown fetch error"

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorType = "TIMEOUT_ERROR"
        severity = "MEDIUM"
        message = "Request timeout"
      } else if (error.message.includes("fetch")) {
        errorType = "NETWORK_ERROR"
        severity = "HIGH"
        message = `Network error: ${error.message}`
      } else {
        message = error.message
      }
    }

    const errorId = this.logError(
      errorType,
      severity,
      message,
      {
        endpoint,
        managerId,
      },
      error instanceof Error ? error : undefined,
    )

    throw new Error(`${message} (Error ID: ${errorId})`)
  }

  handleAPIError(statusCode: number, statusText: string, endpoint: string, managerId?: string): never {
    let severity: ErrorLog["severity"] = "HIGH"
    let message = `HTTP ${statusCode}: ${statusText}`

    // Determine severity based on status code
    if (statusCode === 404) {
      severity = "MEDIUM"
      message = "Manager not found. Please check your FPL Manager ID."
    } else if (statusCode === 429) {
      severity = "MEDIUM"
      message = "Rate limited. Please try again in a moment."
    } else if (statusCode >= 500) {
      severity = "HIGH"
      message = "FPL servers are currently unavailable. Please try again later."
    }

    const errorId = this.logError("API_ERROR", severity, message, {
      endpoint,
      managerId,
    })

    throw new Error(`${message} (Error ID: ${errorId})`)
  }

  handleParseError(error: any, endpoint: string, responseText: string, managerId?: string): never {
    const message = `JSON parse error: ${error instanceof Error ? error.message : "Unknown parse error"}`

    const errorId = this.logError(
      "PARSE_ERROR",
      "HIGH",
      message,
      {
        endpoint,
        managerId,
      },
      error instanceof Error ? error : undefined,
    )

    // Log response text for debugging (truncated)
    console.error("📝 Response text (first 500 chars):", responseText.substring(0, 500))

    throw new Error(`${message} (Error ID: ${errorId})`)
  }

  handleValidationError(message: string, data: any, context: Partial<ErrorContext> = {}): string {
    const errorId = this.logError("VALIDATION_ERROR", "MEDIUM", message, context)

    console.warn("🔍 Validation failed for data:", data)

    return errorId
  }

  getErrorStats(): {
    total: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
    recent: ErrorLog[]
  } {
    const byType: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}

    for (const log of this.errorLogs) {
      byType[log.type] = (byType[log.type] || 0) + 1
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1
    }

    const recent = this.errorLogs
      .slice(-20)
      .sort((a, b) => new Date(b.context.timestamp).getTime() - new Date(a.context.timestamp).getTime())

    return {
      total: this.errorLogs.length,
      byType,
      bySeverity,
      recent,
    }
  }

  getErrorsForManager(managerId: string): ErrorLog[] {
    return this.errorLogs.filter((log) => log.context.managerId === managerId)
  }

  clearErrors(): void {
    this.errorLogs = []
  }

  markErrorResolved(errorId: string): boolean {
    const error = this.errorLogs.find((log) => log.id === errorId)
    if (error) {
      error.resolved = true
      return true
    }
    return false
  }
}

// Rate limiter to prevent API abuse
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs = 60000 // 1 minute
  private readonly maxRequests = 30 // 30 requests per minute

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || []

    // Filter out old requests
    const recentRequests = requests.filter((time) => time > windowStart)

    // Check if under limit
    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const requests = this.requests.get(identifier) || []
    const recentRequests = requests.filter((time) => time > windowStart)

    return Math.max(0, this.maxRequests - recentRequests.length)
  }

  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || []
    if (requests.length === 0) return 0

    const oldestRequest = Math.min(...requests)
    return oldestRequest + this.windowMs
  }
}

// Export singleton instances
export const errorHandler = ErrorHandler.getInstance()
export const rateLimiter = new RateLimiter()
