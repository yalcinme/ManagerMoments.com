// Service Worker for production caching and offline support
const CACHE_NAME = "fpl-manager-moments-v1.0.0"
const STATIC_CACHE = "static-v1.0.0"
const DYNAMIC_CACHE = "dynamic-v1.0.0"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/images/stadium-background.jpg",
  "/sounds/champions-league-8-bit.wav",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets...")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("Static assets cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Failed to cache static assets:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache for API requests
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline response for API failures
            return new Response(
              JSON.stringify({
                error: "Offline - please check your connection",
                offline: true,
              }),
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "application/json" },
              },
            )
          })
        }),
    )
    return
  }

  // Static assets - cache first with network fallback
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/sounds/") ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      }),
    )
    return
  }

  // HTML pages - network first with cache fallback
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline page
            return caches.match("/")
          })
        }),
    )
    return
  }

  // Default: network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request)
    }),
  )
})

// Background sync for analytics
self.addEventListener("sync", (event) => {
  if (event.tag === "analytics-sync") {
    event.waitUntil(
      // Sync analytics data when back online
      syncAnalytics(),
    )
  }
})

// Push notifications (if needed in future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icon-192x192.png",
        badge: "/favicon.png",
        tag: "fpl-notification",
        requireInteraction: false,
        actions: data.actions || [],
      }),
    )
  }
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(clients.openWindow("/"))
})

// Helper function to sync analytics
async function syncAnalytics() {
  try {
    // Get queued analytics data from IndexedDB
    const queuedData = await getQueuedAnalytics()

    if (queuedData.length > 0) {
      // Send to analytics endpoint
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: queuedData }),
      })

      // Clear queue after successful sync
      await clearAnalyticsQueue()
    }
  } catch (error) {
    console.error("Failed to sync analytics:", error)
  }
}

// IndexedDB helpers (simplified)
async function getQueuedAnalytics() {
  // Implementation would use IndexedDB to retrieve queued analytics
  return []
}

async function clearAnalyticsQueue() {
  // Implementation would clear the IndexedDB queue
}

// Cache size management
async function manageCacheSize() {
  const cache = await caches.open(DYNAMIC_CACHE)
  const requests = await cache.keys()

  // Keep only the 50 most recent dynamic cache entries
  if (requests.length > 50) {
    const oldRequests = requests.slice(0, requests.length - 50)
    await Promise.all(oldRequests.map((request) => cache.delete(request)))
  }
}

// Run cache management periodically
setInterval(manageCacheSize, 60000) // Every minute
