"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TestResult {
  endpoint: string
  success: boolean
  responseTime: number
  statusCode?: number
  error?: string
}

interface TestReport {
  managerId: string
  overallSuccess: boolean
  totalTests: number
  passedTests: number
  failedTests: number
  results: TestResult[]
  recommendations: string[]
  summary: string
}

export default function APITestPage() {
  const [testing, setTesting] = useState(false)
  const [managerId, setManagerId] = useState("457099")
  const [reports, setReports] = useState<TestReport[]>([])
  const [comprehensiveReport, setComprehensiveReport] = useState<string>("")

  const runSingleTest = async () => {
    if (!managerId.trim()) return

    setTesting(true)
    try {
      const response = await fetch(`/api/test-fpl?id=${managerId}`)
      const data = await response.json()

      if (data.success) {
        setReports([data.report])
        setComprehensiveReport("")
      } else {
        console.error("Test failed:", data.error)
      }
    } catch (error) {
      console.error("Failed to run test:", error)
    } finally {
      setTesting(false)
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/test-fpl?all=true")
      const data = await response.json()

      if (data.success) {
        setReports(data.reports)
        setComprehensiveReport(data.comprehensiveReport)
      } else {
        console.error("Test failed:", data.error)
      }
    } catch (error) {
      console.error("Failed to run tests:", error)
    } finally {
      setTesting(false)
    }
  }

  const getStatusColor = (success: boolean) => {
    return success ? "bg-green-500" : "bg-red-500"
  }

  const getStatusText = (success: boolean) => {
    return success ? "PASS" : "FAIL"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FPL API Testing Dashboard</h1>
          <p className="text-gray-600">Comprehensive testing of FPL API endpoints and data accuracy</p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager ID</label>
                <Input
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  placeholder="Enter FPL Manager ID"
                  disabled={testing}
                />
              </div>
              <Button onClick={runSingleTest} disabled={testing || !managerId.trim()} className="px-6">
                {testing ? "Testing..." : "Test Single ID"}
              </Button>
            </div>

            <div className="pt-2 border-t">
              <Button onClick={runAllTests} disabled={testing} variant="outline" className="w-full">
                {testing ? "Running All Tests..." : "Test All Sample IDs (457099, 423121, 1991174)"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {reports.length > 0 && (
          <div className="space-y-6">
            {reports.map((report, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Manager ID: {report.managerId}</CardTitle>
                    <Badge className={getStatusColor(report.overallSuccess)}>
                      {getStatusText(report.overallSuccess)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{report.summary}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{report.totalTests}</div>
                      <div className="text-sm text-gray-500">Total Tests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{report.passedTests}</div>
                      <div className="text-sm text-gray-500">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{report.failedTests}</div>
                      <div className="text-sm text-gray-500">Failed</div>
                    </div>
                  </div>

                  {/* Test Results Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Endpoint</th>
                          <th className="text-center py-2">Status</th>
                          <th className="text-center py-2">Response Time</th>
                          <th className="text-left py-2">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.results.map((result, resultIndex) => (
                          <tr key={resultIndex} className="border-b">
                            <td className="py-2 font-mono text-xs">{result.endpoint}</td>
                            <td className="text-center py-2">
                              <Badge className={`${getStatusColor(result.success)} text-white text-xs`}>
                                {getStatusText(result.success)}
                              </Badge>
                            </td>
                            <td className="text-center py-2">{result.responseTime}ms</td>
                            <td className="py-2 text-xs text-red-600">{result.error || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Recommendations */}
                  {report.recommendations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {report.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-sm text-gray-700 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Comprehensive Report */}
        {comprehensiveReport && (
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Test Report</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-4 rounded overflow-x-auto">
                {comprehensiveReport}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
