const CACHE_NAME = "fpl-wrapped-v2.0.0"
const STATIC_CACHE = "fpl-static-v2.0.0"

// Files to cache immediately
const STATIC_FILES = ["/", "/manifest.json", "/favicon.ico", "/icon-192x192.png", "/icon-512x512.png"]

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static files")
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        // Force activation of new service worker
        return self.skipWaiting()
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
            // Delete old caches
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim()
      }),
  )
})

// Fetch event - implement caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache error responses
          if (!response.ok) {
            return response
          }

          // Clone response for caching
          const responseClone = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }

            // Return offline page or error response
            return new Response(JSON.stringify({ error: "Network unavailable" }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            })
          })
        }),
    )
    return
  }

  // Static files - cache first with network fallback
  if (STATIC_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request).then((response) => {
          const responseClone = response.clone()

          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
      }),
    )
    return
  }

  // All other requests - network first
  event.respondWith(
    fetch(request).catch(() => {
      // Fallback to cache
      return caches.match(request)
    }),
  )
})

// Message event - handle cache updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      })
      .then(() => {
        event.ports[0].postMessage({ success: true })
      })
  }
})
