"use client"

import { useEffect } from "react"

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
    })
  }, [error])

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-red-900 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>

        <div className="text-left bg-gray-100 p-4 rounded mb-4 text-sm">
          <strong>Error:</strong> {error.message}
          <br />
          {error.digest && (
            <>
              <strong>Digest:</strong> {error.digest}
              <br />
            </>
          )}
          <strong>Location:</strong> Global Error Handler
          {process.env.NODE_ENV === "development" && (
            <>
              <br />
              <strong>Stack:</strong>
              <pre className="text-xs mt-2 overflow-auto max-h-32">{error.stack}</pre>
            </>
          )}
        </div>

        <div className="space-y-2">
          <button onClick={reset} className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}
