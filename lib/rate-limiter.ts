// Simple in-memory rate limiter for development
export class RateLimiter {
  private static instance: RateLimiter
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  checkLimit(key: string, limit: number, windowSeconds: number): boolean {
    const now = Date.now()
    const windowMs = windowSeconds * 1000

    const record = this.requests.get(key)

    if (!record || now > record.resetTime) {
      // New window or expired window
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}
