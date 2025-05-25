// Production-ready cache management
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

export class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, CacheEntry<any>> = new Map()
  private readonly MAX_CACHE_SIZE = 10000
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  constructor() {
    // Start cleanup interval
    this.startCleanup()
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      // Remove expired entries if cache is getting full
      if (this.cache.size >= this.MAX_CACHE_SIZE) {
        this.cleanup()
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
        hits: 0,
      })
    } catch (error) {
      console.error("Cache set error:", error)
    }
  }

  get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key)

      if (!entry) {
        return null
      }

      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        return null
      }

      // Increment hit counter
      entry.hits++

      return entry.data as T
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get cache statistics
  getStats() {
    const now = Date.now()
    let expired = 0
    let totalHits = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++
      }
      totalHits += entry.hits
    }

    return {
      size: this.cache.size,
      expired,
      totalHits,
      hitRate: totalHits / Math.max(this.cache.size, 1),
    }
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key)
      }
    }

    // If still too many entries, remove least recently used
    if (this.cache.size - toDelete.length >= this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].hits - b[1].hits)
        .slice(0, Math.floor(this.MAX_CACHE_SIZE * 0.2))

      entries.forEach(([key]) => toDelete.push(key))
    }

    toDelete.forEach((key) => this.cache.delete(key))
  }

  private startCleanup(): void {
    // Cleanup every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup()
      },
      5 * 60 * 1000,
    )
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.clear()
  }
}
