interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  version: string
}

interface CacheStats {
  hits: number
  misses: number
  size: number
  memoryUsage: number
}

class OptimizedCacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number
  private maxSize: number
  private version: string
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, memoryUsage: 0 }
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(defaultTTL = 300000, maxSize = 1000) {
    // 5 minutes default, max 1000 entries
    this.defaultTTL = defaultTTL
    this.maxSize = maxSize
    this.version = process.env.NEXT_PUBLIC_APP_VERSION || Date.now().toString()

    // Start cleanup interval
    this.startCleanup()
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Evict old entries if at max size
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      version: this.version,
    }

    this.cache.set(key, entry)
    this.updateStats()
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    const now = Date.now()

    // Check if expired or version mismatch
    if (now - entry.timestamp > entry.ttl || entry.version !== this.version) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    this.stats.hits++
    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl || entry.version !== this.version) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) this.updateStats()
    return deleted
  }

  clear(): void {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0, size: 0, memoryUsage: 0 }
  }

  // Force clear cache when version changes
  invalidateVersion(): void {
    const oldVersion = this.version
    this.version = Date.now().toString()

    // Remove all entries with old version
    for (const [key, entry] of this.cache.entries()) {
      if (entry.version === oldVersion) {
        this.cache.delete(key)
      }
    }

    this.updateStats()
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000) // Cleanup every minute
  }

  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl || entry.version !== this.version) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key))
    this.updateStats()
  }

  private updateStats(): void {
    this.stats.size = this.cache.size
    this.stats.memoryUsage = this.estimateMemoryUsage()
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage
    let size = 0
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2 // UTF-16
      size += JSON.stringify(entry).length * 2
    }
    return size
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses
    return total > 0 ? this.stats.hits / total : 0
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

// Singleton instance with proper cleanup
let cacheInstance: OptimizedCacheManager | null = null

export function getCacheManager(): OptimizedCacheManager {
  if (!cacheInstance) {
    cacheInstance = new OptimizedCacheManager()

    // Cleanup on process exit
    if (typeof process !== "undefined") {
      process.on("exit", () => {
        cacheInstance?.destroy()
      })
    }
  }
  return cacheInstance
}

export const CacheManager = OptimizedCacheManager
export default OptimizedCacheManager
