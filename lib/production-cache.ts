interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class ProductionCache {
  private static cache = new Map<string, CacheEntry<any>>()
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly MAX_ENTRIES = 1000
  private static lastCleanup = Date.now()
  private static readonly CLEANUP_INTERVAL = 10 * 60 * 1000 // 10 minutes

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // Cleanup old entries periodically
    this.periodicCleanup()

    // If cache is full, remove oldest entries
    if (this.cache.size >= this.MAX_ENTRIES) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    console.log(`📦 Cached data for key: ${key} (TTL: ${ttl}ms)`)
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      console.log(`⏰ Cache expired for key: ${key}`)
      return null
    }

    console.log(`✅ Cache hit for key: ${key}`)
    return entry.data
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  static delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      console.log(`🗑️ Deleted cache entry: ${key}`)
    }
    return deleted
  }

  static clear(): void {
    this.cache.clear()
    console.log("🧹 Cache cleared")
  }

  static size(): number {
    return this.cache.size
  }

  static getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++
      } else {
        valid++
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      memoryUsage: this.estimateMemoryUsage(),
    }
  }

  private static periodicCleanup(): void {
    const now = Date.now()
    if (now - this.lastCleanup > this.CLEANUP_INTERVAL) {
      this.cleanup()
      this.lastCleanup = now
    }
  }

  private static cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key)
    }

    if (keysToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${keysToDelete.length} expired cache entries`)
    }
  }

  private static evictOldest(): void {
    // Remove 10% of oldest entries
    const entriesToRemove = Math.floor(this.MAX_ENTRIES * 0.1)
    const entries = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)

    for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0])
    }

    console.log(`🗑️ Evicted ${entriesToRemove} oldest cache entries`)
  }

  private static estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let size = 0
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2 // UTF-16 characters
      size += JSON.stringify(entry.data).length * 2
      size += 24 // Overhead for timestamp, ttl, etc.
    }
    return size
  }
}

export class RateLimiter {
  private static requests = new Map<string, number[]>()
  private static readonly WINDOW_MS = 60000 // 1 minute
  private static readonly MAX_REQUESTS = 30 // 30 requests per minute

  static isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.WINDOW_MS

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || []

    // Filter out old requests
    const recentRequests = requests.filter((time) => time > windowStart)

    // Check if under limit
    if (recentRequests.length >= this.MAX_REQUESTS) {
      return false
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }

  static getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.WINDOW_MS
    const requests = this.requests.get(identifier) || []
    const recentRequests = requests.filter((time) => time > windowStart)

    return Math.max(0, this.MAX_REQUESTS - recentRequests.length)
  }

  static getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || []
    if (requests.length === 0) return 0

    const oldestRequest = Math.min(...requests)
    return oldestRequest + this.WINDOW_MS
  }

  static cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.WINDOW_MS

    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter((time) => time > windowStart)
      if (recentRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentRequests)
      }
    }
  }
}
