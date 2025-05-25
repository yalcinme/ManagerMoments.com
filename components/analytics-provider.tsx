"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { ga4, trackPageView, trackError } from "@/lib/ga4-analytics"

interface AnalyticsContextType {
  trackEvent: (action: string, category: string, label?: string, value?: number) => void
  trackFPLEvent: (event: any) => void
  setUserId: (userId: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Track initial page view
    trackPageView(window.location.pathname)

    // Set up error tracking
    const handleError = (event: ErrorEvent) => {
      trackError(`${event.message} at ${event.filename}:${event.lineno}`)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(`Unhandled promise rejection: ${event.reason}`)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  const contextValue: AnalyticsContextType = {
    trackEvent: (action, category, label, value) => {
      ga4.trackFPLEvent({ action, category, label, value })
    },
    trackFPLEvent: (event) => {
      ga4.trackFPLEvent(event)
    },
    setUserId: (userId) => {
      ga4.setUserProperties(userId, {})
    },
  }

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
