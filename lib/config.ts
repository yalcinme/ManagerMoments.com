export const config = {
  // API Configuration
  fpl: {
    baseUrl: process.env.FPL_API_BASE_URL || "https://fantasy.premierleague.com/api",
    timeout: Number(process.env.FPL_API_TIMEOUT) || 30000,
    retries: Number(process.env.FPL_API_RETRIES) || 3,
    retryDelay: Number(process.env.FPL_API_RETRY_DELAY) || 1000,
  },

  // Cache Configuration
  cache: {
    defaultTTL: Number(process.env.CACHE_DEFAULT_TTL) || 5 * 60 * 1000, // 5 minutes
    maxEntries: Number(process.env.CACHE_MAX_ENTRIES) || 1000,
    cleanupInterval: Number(process.env.CACHE_CLEANUP_INTERVAL) || 60 * 1000, // 1 minute
  },

  // Rate Limiting
  rateLimit: {
    windowSize: Number(process.env.RATE_LIMIT_WINDOW) || 60 * 1000, // 1 minute
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  },

  // Monitoring
  monitoring: {
    enabled: process.env.MONITORING_ENABLED !== "false",
    logLevel: process.env.LOG_LEVEL || "info",
    maxLogs: Number(process.env.MAX_PERFORMANCE_LOGS) || 1000,
  },

  // Environment
  environment: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  // Feature Flags
  features: {
    caching: process.env.FEATURE_CACHING !== "false",
    rateLimit: process.env.FEATURE_RATE_LIMIT !== "false",
    monitoring: process.env.FEATURE_MONITORING !== "false",
    dataValidation: process.env.FEATURE_DATA_VALIDATION !== "false",
  },
}

export default config
