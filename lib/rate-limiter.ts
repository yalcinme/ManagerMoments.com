// Production-ready rate limiting
interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

export class RateLimiter {
  private static instance: RateLimiter
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly WINDOW_SIZE = 60 * 1000 // 1 minute
  private readonly MAX_REQUESTS = 30 // Increased for production
  private readonly BLOCK_DURATION = 5 * 60 * 1000 // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  constructor() {
    this.startCleanup()
  }

  checkLimit(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    // If blocked, check if block period has expired
    if (entry?.blocked && now < entry.resetTime) {
      return { allowed: false, resetTime: entry.resetTime }
    }

    // Reset or create new entry
    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_SIZE,
        blocked: false,
      })
      return { allowed: true, remaining: this.MAX_REQUESTS - 1 }
    }

    // Check if limit exceeded
    if (entry.count >= this.MAX_REQUESTS) {
      // Block the identifier
      entry.blocked = true
      entry.resetTime = now + this.BLOCK_DURATION
      return { allowed: false, resetTime: entry.resetTime }
    }

    // Increment counter
    entry.count++
    return {
      allowed: true,
      remaining: this.MAX_REQUESTS - entry.count,
      resetTime: entry.resetTime,
    }
  }

  // Get current stats
  getStats() {
    const now = Date.now()
    let activeEntries = 0
    let blockedEntries = 0

    for (const entry of this.limits.values()) {
      if (now < entry.resetTime) {
        activeEntries++
        if (entry.blocked) {
          blockedEntries++
        }
      }
    }

    return {
      activeEntries,
      blockedEntries,
      totalEntries: this.limits.size,
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const toDelete: string[] = []

      for (const [key, entry] of this.limits.entries()) {
        if (now > entry.resetTime && !entry.blocked) {
          toDelete.push(key)
        }
      }

      toDelete.forEach((key) => this.limits.delete(key))
    }, 60 * 1000) // Cleanup every minute
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.limits.clear()
  }
}
