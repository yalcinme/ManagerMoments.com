// Enhanced Google Analytics 4 integration for FPL Manager Moments

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const GA_ID = "G-BYQH406K1J"

// Custom event types for FPL app
export interface FPLEvent {
  action: string
  category: string
  label?: string
  value?: number
  managerId?: string
  seasonProgress?: number
  gameLevel?: number
}

class GA4Analytics {
  private isInitialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.waitForGtag()
    }
  }

  private waitForGtag() {
    const checkGtag = () => {
      if (typeof window.gtag === "function") {
        this.isInitialized = true
      } else {
        setTimeout(checkGtag, 100)
      }
    }
    checkGtag()
  }

  private gtag(...args: any[]) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag(...args)
    }
  }

  // Page tracking
  trackPageView(page: string, title?: string) {
    if (!this.isInitialized) return

    this.gtag("config", GA_ID, {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: page,
    })
  }

  // FPL-specific events
  trackFPLEvent(event: FPLEvent) {
    if (!this.isInitialized) return

    this.gtag("event", event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_parameter_1: event.managerId,
      custom_parameter_2: event.seasonProgress,
      custom_parameter_3: event.gameLevel,
    })
  }

  // Game progression events
  trackGameStart(managerId: string) {
    this.trackFPLEvent({
      action: "game_start",
      category: "engagement",
      label: "FPL Manager Moments Started",
      managerId,
      seasonProgress: 0,
      gameLevel: 1,
    })
  }

  trackLevelComplete(level: number, managerId: string, timeSpent: number) {
    this.trackFPLEvent({
      action: "level_complete",
      category: "progression",
      label: `Level ${level} Complete`,
      value: timeSpent,
      managerId,
      gameLevel: level,
    })
  }

  trackInsightViewed(insightType: string, managerId: string) {
    this.trackFPLEvent({
      action: "insight_viewed",
      category: "content",
      label: insightType,
      managerId,
    })
  }

  trackShareAction(platform: string, content: string, managerId: string) {
    this.trackFPLEvent({
      action: "share",
      category: "social",
      label: `${platform} - ${content}`,
      managerId,
    })
  }

  trackAudioToggle(enabled: boolean, managerId: string) {
    this.trackFPLEvent({
      action: "audio_toggle",
      category: "settings",
      label: enabled ? "Audio Enabled" : "Audio Disabled",
      value: enabled ? 1 : 0,
      managerId,
    })
  }

  trackGameComplete(managerId: string, totalTime: number, finalScore: number) {
    this.trackFPLEvent({
      action: "game_complete",
      category: "completion",
      label: "FPL Manager Moments Completed",
      value: totalTime,
      managerId,
      seasonProgress: 100,
    })

    // Also track as conversion
    this.gtag("event", "conversion", {
      send_to: GA_ID,
      value: finalScore,
      currency: "USD",
      transaction_id: `fpl_${managerId}_${Date.now()}`,
    })
  }

  trackError(error: string, fatal = false) {
    if (!this.isInitialized) return

    this.gtag("event", "exception", {
      description: error,
      fatal,
    })
  }

  trackPerformance(metric: string, value: number) {
    if (!this.isInitialized) return

    this.gtag("event", "timing_complete", {
      name: metric,
      value: Math.round(value),
      event_category: "Performance",
    })
  }

  // User engagement
  trackEngagement(action: string, element: string, managerId?: string) {
    this.trackFPLEvent({
      action,
      category: "engagement",
      label: element,
      managerId,
    })
  }

  // Custom dimensions
  setUserProperties(managerId: string, properties: Record<string, any>) {
    if (!this.isInitialized) return

    this.gtag("config", GA_ID, {
      user_id: managerId,
      custom_map: {
        fpl_manager_id: managerId,
        ...properties,
      },
    })
  }

  // Enhanced ecommerce (for future premium features)
  trackPurchase(transactionId: string, value: number, items: any[]) {
    if (!this.isInitialized) return

    this.gtag("event", "purchase", {
      transaction_id: transactionId,
      value,
      currency: "USD",
      items,
    })
  }

  // Consent management
  updateConsent(granted: boolean) {
    if (!this.isInitialized) return

    this.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied", // Always deny ad storage for privacy
    })
  }
}

// Export singleton instance
export const ga4 = new GA4Analytics()

// Convenience functions
export const trackPageView = (page: string, title?: string) => ga4.trackPageView(page, title)
export const trackFPLEvent = (event: FPLEvent) => ga4.trackFPLEvent(event)
export const trackGameStart = (managerId: string) => ga4.trackGameStart(managerId)
export const trackLevelComplete = (level: number, managerId: string, timeSpent: number) =>
  ga4.trackLevelComplete(level, managerId, timeSpent)
export const trackInsightViewed = (insightType: string, managerId: string) =>
  ga4.trackInsightViewed(insightType, managerId)
export const trackShareAction = (platform: string, content: string, managerId: string) =>
  ga4.trackShareAction(platform, content, managerId)
export const trackAudioToggle = (enabled: boolean, managerId: string) => ga4.trackAudioToggle(enabled, managerId)
export const trackGameComplete = (managerId: string, totalTime: number, finalScore: number) =>
  ga4.trackGameComplete(managerId, totalTime, finalScore)
export const trackError = (error: string, fatal?: boolean) => ga4.trackError(error, fatal)
export const trackPerformance = (metric: string, value: number) => ga4.trackPerformance(metric, value)
export const trackEngagement = (action: string, element: string, managerId?: string) =>
  ga4.trackEngagement(action, element, managerId)
export const setUserProperties = (managerId: string, properties: Record<string, any>) =>
  ga4.setUserProperties(managerId, properties)
