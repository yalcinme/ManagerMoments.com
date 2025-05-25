// Simplified error reporting for deployment
interface ErrorReport {
  message: string
  stack?: string
  url: string
  userAgent: string
  timestamp: number
  userId?: string
  sessionId: string
  severity: "low" | "medium" | "high" | "critical"
  context?: Record<string, any>
}

class ErrorReporter {
  private static instance: ErrorReporter
  private sessionId: string
  private userId?: string
  private errorQueue: ErrorReport[] = []

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter()
    }
    return ErrorReporter.instance
  }

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalHandlers()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalHandlers() {
    if (typeof window === "undefined") return

    // Global error handler
    window.addEventListener("error", (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        severity: "high",
      })
    })

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: "high",
        context: { type: "unhandledrejection", reason: event.reason },
      })
    })
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  captureError(error: {
    message: string
    stack?: string
    severity: "low" | "medium" | "high" | "critical"
    context?: Record<string, any>
  }) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      severity: error.severity,
      context: error.context,
    }

    this.errorQueue.push(errorReport)

    // Send to Google Analytics as exceptions
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "exception", {
        description: error.message,
        fatal: error.severity === "critical",
      })
    }

    // Console logging for development
    if (process.env.NODE_ENV === "development") {
      console.error("Error captured:", errorReport)
    }
  }

  captureException(
    error: Error,
    severity: "low" | "medium" | "high" | "critical" = "medium",
    context?: Record<string, any>,
  ) {
    this.captureError({
      message: error.message,
      stack: error.stack,
      severity,
      context,
    })
  }

  captureMessage(
    message: string,
    severity: "low" | "medium" | "high" | "critical" = "low",
    context?: Record<string, any>,
  ) {
    this.captureError({
      message,
      severity,
      context,
    })
  }
}

// Export singleton instance
export const errorReporter = ErrorReporter.getInstance()

// Convenience functions
export const captureError = (
  error: Error,
  severity?: "low" | "medium" | "high" | "critical",
  context?: Record<string, any>,
) => {
  errorReporter.captureException(error, severity, context)
}

export const captureMessage = (
  message: string,
  severity?: "low" | "medium" | "high" | "critical",
  context?: Record<string, any>,
) => {
  errorReporter.captureMessage(message, severity, context)
}

export const setErrorUserId = (userId: string) => {
  errorReporter.setUserId(userId)
}
