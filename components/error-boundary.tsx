"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Simple error logging without fetch
    if (typeof window !== "undefined") {
      console.error("Component Error Details:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-red-200">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />

            <h1 className="text-2xl font-bold text-red-600 mb-4">Component Error</h1>

            <p className="text-gray-600 mb-6">
              {this.state.error?.message || "A component error occurred. Please try refreshing the page."}
            </p>

            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <div className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm">
                <div className="font-semibold text-red-800 mb-2">Development Error Details:</div>
                <div className="text-red-700 space-y-1">
                  <div>
                    <strong>Error:</strong> {this.state.error?.message}
                  </div>
                  <div>
                    <strong>Component:</strong> Error Boundary
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-red-600 hover:text-red-800">View Component Stack</summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-32 bg-red-100 p-2 rounded border text-red-800">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>

              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Error occurred at {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
