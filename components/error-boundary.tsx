"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  onError?: () => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen gradient-red flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="pixel-card p-6 text-center bg-white">
              <div className="mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="font-display text-lg text-contrast-dark tracking-wide mb-2">SOMETHING WENT WRONG</h1>
                <p className="font-body text-sm text-contrast-dark leading-relaxed">
                  We encountered an unexpected error. Please refresh the page.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="pixel-button w-full py-3 font-display text-xs tracking-wide"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  REFRESH PAGE
                </Button>

                <Button
                  onClick={() => (window.location.href = "/")}
                  className="pixel-button w-full py-3 font-display text-xs tracking-wide bg-gray-100"
                >
                  GO HOME
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
