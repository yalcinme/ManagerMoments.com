interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number
}

class SimpleCacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 100
  private defaultTTL = 300000 // 5 minutes
  private hits = 0
  private misses = 0

  set<T>(key: string, data: T, ttl?: number): void {
    // Clean expired items if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    // If still full after cleanup, remove oldest item
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      this.misses++
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      this.misses++
      return null
    }

    this.hits++
    return item.data as T
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  getStats(): CacheStats {
    this.cleanup() // Clean before getting stats
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
    }
  }

  getHitRate(): number {
    const total = this.hits + this.misses
    return total > 0 ? (this.hits / total) * 100 : 0
  }

  size(): number {
    this.cleanup()
    return this.cache.size
  }

  keys(): string[] {
    this.cleanup()
    return Array.from(this.cache.keys())
  }
}

// Export singleton instance
let cacheInstance: SimpleCacheManager | null = null

export function getCacheManager(): SimpleCacheManager {
  if (!cacheInstance) {
    cacheInstance = new SimpleCacheManager()
  }
  return cacheInstance
}

// Export the class as CacheManager (named export)
export const CacheManager = SimpleCacheManager

// Export as default
export default SimpleCacheManager

// Export types
export type { CacheStats, CacheItem }
