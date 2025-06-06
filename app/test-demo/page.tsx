"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestDemo() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDemo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/fpl-data/demo")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      console.log("Demo data received:", data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Demo test error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Demo Data Test</h1>

        <Button onClick={testDemo} disabled={loading} className="mb-4">
          {loading ? "Testing..." : "Test Demo Data"}
        </Button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong>Success!</strong> Demo data loaded successfully.
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">View Data</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-2 rounded border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
