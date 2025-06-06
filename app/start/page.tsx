"use client"

import type React from "react"

import { useState } from "react"

export default function Start() {
  const [managerId, setManagerId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!managerId.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Simple validation
      if (isNaN(Number(managerId))) {
        throw new Error("Manager ID must be a number")
      }

      // Redirect to results page
      window.location.href = `/results/${managerId}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Enter Your FPL ID</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              placeholder="e.g. 1991174"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !managerId.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 text-center">Try ID: 1991174 for a demo experience</p>
      </div>
    </div>
  )
}
