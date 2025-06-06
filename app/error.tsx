"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RotateCcw, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error("Global Error Handler:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
      timestamp: new Date().toISOString(),
    })

    // Simple error logging without external calls
    if (typeof window !== "undefined") {
      console.error("Error Context:", {
        url: window.location.href,
        userAgent: window.navigator.userAgent,
      })
    }
  }, [error])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-red-200">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600 text-sm">
            We encountered an unexpected error. Don't worry, we're working to fix it!
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm">
            <div className="font-semibold text-red-800 mb-2">Development Error Details:</div>
            <div className="text-red-700 space-y-1">
              <div>
                <strong>Error:</strong> {error.message}
              </div>
              {error.digest && (
                <div>
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              <div>
                <strong>Component:</strong> Global Error Handler
              </div>
            </div>
            {error.stack && (
              <details className="mt-3">
                <summary className="cursor-pointer text-red-600 hover:text-red-800">View Stack Trace</summary>
                <pre className="text-xs mt-2 overflow-auto max-h-32 bg-red-100 p-2 rounded border text-red-800">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={reset} className="w-full bg-red-500 hover:bg-red-600 text-white font-medium">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            className="w-full text-gray-600 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Error ID: {error.digest || "N/A"} • {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
