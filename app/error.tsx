"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="h-screen w-screen gradient-red flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="pixel-card p-6 text-center bg-white">
          <div className="mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="font-display text-lg text-contrast-dark tracking-wide mb-2">OOPS! SOMETHING WENT WRONG</h1>
            <p className="font-body text-sm text-contrast-dark leading-relaxed">
              We encountered an unexpected error. Please try again.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={reset} className="pixel-button w-full py-3 font-display text-xs tracking-wide">
              <RefreshCw className="w-4 h-4 mr-2" />
              TRY AGAIN
            </Button>

            <Button
              onClick={() => (window.location.href = "/")}
              className="pixel-button w-full py-3 font-display text-xs tracking-wide bg-gray-100"
            >
              GO HOME
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left">
              <summary className="font-body text-xs text-gray-600 cursor-pointer">Error Details (Dev Mode)</summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-32">{error.message}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
