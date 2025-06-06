interface APITestResult {
  endpoint: string
  success: boolean
  responseTime: number
  statusCode?: number
  error?: string
  data?: any
  headers?: Record<string, string>
}

interface TestReport {
  timestamp: string
  managerId: string
  overallSuccess: boolean
  totalTests: number
  passedTests: number
  failedTests: number
  results: APITestResult[]
  recommendations: string[]
  summary: string
}

export class FPLAPITester {
  private baseUrl = "https://fantasy.premierleague.com/api"
  private testResults: APITestResult[] = []
  private managerId = ""

  constructor(managerId: string) {
    this.managerId = managerId
  }

  async runComprehensiveTest(): Promise<TestReport> {
    console.log(`🧪 Starting comprehensive FPL API test for manager ID: ${this.managerId}`)

    this.testResults = []
    const startTime = Date.now()

    // Test all critical endpoints
    await this.testBootstrapStatic()
    await this.testManagerEntry()
    await this.testManagerHistory()
    await this.testManagerTransfers()

    // Test gameweek-specific endpoints (sample a few gameweeks)
    const testGameweeks = [1, 15, 25, 38]
    for (const gw of testGameweeks) {
      await this.testGameweekPicks(gw)
      await this.testGameweekLive(gw)
    }

    const totalTime = Date.now() - startTime
    const report = this.generateReport(totalTime)

    console.log(`✅ Test completed in ${totalTime}ms`)
    console.log(`📊 Results: ${report.passedTests}/${report.totalTests} tests passed`)

    return report
  }

  private async testBootstrapStatic(): Promise<void> {
    const endpoint = "/bootstrap-static/"
    console.log(`🔍 Testing: ${endpoint}`)

    try {
      const result = await this.makeRequest(endpoint)

      // Validate bootstrap data structure
      if (result.success && result.data) {
        const requiredFields = ["elements", "teams", "events", "element_types"]
        const missingFields = requiredFields.filter((field) => !result.data[field])

        if (missingFields.length > 0) {
          result.success = false
          result.error = `Missing required fields: ${missingFields.join(", ")}`
        } else {
          console.log(
            `✅ Bootstrap data valid: ${result.data.elements?.length} players, ${result.data.teams?.length} teams`,
          )
        }
      }

      this.testResults.push(result)
    } catch (error) {
      console.error(`❌ Bootstrap test failed:`, error)
      this.testResults.push({
        endpoint,
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  private async testManagerEntry(): Promise<void> {
    const endpoint = `/entry/${this.managerId}/`
    console.log(`🔍 Testing: ${endpoint}`)

    try {
      const result = await this.makeRequest(endpoint)

      // Validate manager data structure
      if (result.success && result.data) {
        const requiredFields = ["id", "player_first_name", "name", "summary_overall_points"]
        const missingFields = requiredFields.filter((field) => result.data[field] === undefined)

        if (missingFields.length > 0) {
          result.success = false
          result.error = `Missing required manager fields: ${missingFields.join(", ")}`
        } else {
          console.log(`✅ Manager data valid: ${result.data.player_first_name} ${result.data.player_last_name}`)
        }
      }

      this.testResults.push(result)
    } catch (error) {
      console.error(`❌ Manager entry test failed:`, error)
      this.testResults.push({
        endpoint,
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  private async testManagerHistory(): Promise<void> {
    const endpoint = `/entry/${this.managerId}/history/`
    console.log(`🔍 Testing: ${endpoint}`)

    try {
      const result = await this.makeRequest(endpoint)

      // Validate history data structure
      if (result.success && result.data) {
        const requiredFields = ["current", "past", "chips"]
        const missingFields = requiredFields.filter((field) => !Array.isArray(result.data[field]))

        if (missingFields.length > 0) {
          result.success = false
          result.error = `Missing or invalid history fields: ${missingFields.join(", ")}`
        } else {
          console.log(
            `✅ History data valid: ${result.data.current?.length} gameweeks, ${result.data.chips?.length} chips`,
          )
        }
      }

      this.testResults.push(result)
    } catch (error) {
      console.error(`❌ Manager history test failed:`, error)
      this.testResults.push({
        endpoint,
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  private async testManagerTransfers(): Promise<void> {
    const endpoint = `/entry/${this.managerId}/transfers/`
    console.log(`🔍 Testing: ${endpoint}`)

    try {
      const result = await this.makeRequest(endpoint)

      // Validate transfers data structure
      if (result.success && result.data) {
        if (!Array.isArray(result.data)) {
          result.success = false
          result.error = "Transfers data should be an array"
        } else {
          console.log(`✅ Transfers data valid: ${result.data.length} transfers`)
        }
      }

      this.testResults.push(result)
    } catch (error) {
      console.error(`❌ Manager transfers test failed:`, error)
      this.testResults.push({
        endpoint,
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  private async testGameweekPicks(gameweek: number): Promise<void> {
    const endpoint = `/entry/${this.managerId}/event/${gameweek}/picks/`
    console.log(`🔍 Testing: ${endpoint}`)

    try {
      const result = await this.makeRequest(endpoint)

      // Validate picks data structure
      if (result.success && result.data) {
        const requiredFields = ["picks", "entry_history"]
        const missingFields = requiredFields.filter((field) => !result.data[field])

        if (missingFields.length > 0) {
          result.success = false
          result.error = `Missing picks fields: ${missingFields.join(", ")}`
        } else if (!Array.isArray(result.data.picks) || result.data.picks.length !== 15) {
          result.success = false
          result.error = `Invalid picks array: expected 15 picks, got ${result.data.picks?.length}`
        } else {
          console.log(`✅ GW${gameweek} picks valid: ${result.data.picks.length} players`)
        }
      }

      this.testResults.push(result)
    } catch (error) {
      console.error(`❌ GW${gameweek} picks test failed:`, error)
      this.testResults.push({
        endpoint,
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  private async testGameweekLive(gameweek: number): Promise<void> {
    const endpoint = `/event/${gameweek}/live/`
    console.log(`🔍 Testing: ${endpoint}`)

    try {
      const result = await this.makeRequest(endpoint)

      // Validate live data structure
      if (result.success && result.data) {
        const requiredFields = ["elements"]
        const missingFields = requiredFields.filter((field) => !result.data[field])

        if (missingFields.length > 0) {
          result.success = false
          result.error = `Missing live data fields: ${missingFields.join(", ")}`
        } else if (!Array.isArray(result.data.elements)) {
          result.success = false
          result.error = "Live elements should be an array"
        } else {
          console.log(`✅ GW${gameweek} live data valid: ${result.data.elements.length} player stats`)
        }
      }

      this.testResults.push(result)
    } catch (error) {
      console.error(`❌ GW${gameweek} live test failed:`, error)
      this.testResults.push({
        endpoint,
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  private async makeRequest(endpoint: string): Promise<APITestResult> {
    const url = `${this.baseUrl}${endpoint}`
    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FPL-API-Tester/1.0)",
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        },
        keepalive: true,
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      // Extract response headers
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      if (!response.ok) {
        return {
          endpoint,
          success: false,
          responseTime,
          statusCode: response.status,
          error: `HTTP ${response.status}: ${response.statusText}`,
          headers,
        }
      }

      const text = await response.text()

      if (!text || text.trim() === "") {
        return {
          endpoint,
          success: false,
          responseTime,
          statusCode: response.status,
          error: "Empty response body",
          headers,
        }
      }

      if (text.trim().startsWith("<")) {
        return {
          endpoint,
          success: false,
          responseTime,
          statusCode: response.status,
          error: "Received HTML instead of JSON (API may be down)",
          headers,
        }
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        return {
          endpoint,
          success: false,
          responseTime,
          statusCode: response.status,
          error: `JSON parse error: ${parseError instanceof Error ? parseError.message : "Unknown parse error"}`,
          headers,
        }
      }

      return {
        endpoint,
        success: true,
        responseTime,
        statusCode: response.status,
        data,
        headers,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            endpoint,
            success: false,
            responseTime,
            error: "Request timeout (15s)",
          }
        }

        return {
          endpoint,
          success: false,
          responseTime,
          error: `Network error: ${error.message}`,
        }
      }

      return {
        endpoint,
        success: false,
        responseTime,
        error: "Unknown network error",
      }
    }
  }

  private generateReport(totalTime: number): TestReport {
    const passedTests = this.testResults.filter((r) => r.success).length
    const failedTests = this.testResults.length - passedTests
    const overallSuccess = failedTests === 0

    const recommendations: string[] = []

    // Analyze failures and generate recommendations
    const failedResults = this.testResults.filter((r) => !r.success)

    if (failedResults.length > 0) {
      const networkErrors = failedResults.filter((r) => r.error?.includes("Network error"))
      const timeoutErrors = failedResults.filter((r) => r.error?.includes("timeout"))
      const httpErrors = failedResults.filter((r) => r.statusCode && r.statusCode >= 400)
      const parseErrors = failedResults.filter((r) => r.error?.includes("parse"))

      if (networkErrors.length > 0) {
        recommendations.push(
          "🌐 Network connectivity issues detected. Check internet connection and firewall settings.",
        )
      }

      if (timeoutErrors.length > 0) {
        recommendations.push(
          "⏱️ Request timeouts detected. Consider increasing timeout values or implementing retry logic.",
        )
      }

      if (httpErrors.length > 0) {
        const statusCodes = [...new Set(httpErrors.map((r) => r.statusCode))]
        recommendations.push(
          `🚫 HTTP errors detected (${statusCodes.join(", ")}). Check API endpoints and manager ID validity.`,
        )
      }

      if (parseErrors.length > 0) {
        recommendations.push("📝 JSON parsing errors detected. API may be returning HTML error pages instead of JSON.")
      }

      // Specific recommendations based on failed endpoints
      const failedEndpoints = failedResults.map((r) => r.endpoint)

      if (failedEndpoints.some((e) => e.includes("/entry/"))) {
        recommendations.push("👤 Manager-specific endpoints failing. Verify manager ID exists and is valid.")
      }

      if (failedEndpoints.some((e) => e.includes("/bootstrap-static"))) {
        recommendations.push("🏗️ Bootstrap endpoint failing. FPL API may be experiencing issues.")
      }

      if (failedEndpoints.some((e) => e.includes("/event/"))) {
        recommendations.push("📅 Gameweek endpoints failing. Check if gameweek data is available.")
      }
    }

    // Performance recommendations
    const avgResponseTime = this.testResults.reduce((sum, r) => sum + r.responseTime, 0) / this.testResults.length

    if (avgResponseTime > 5000) {
      recommendations.push(
        "🐌 High average response times detected. Consider implementing caching and request optimization.",
      )
    }

    if (avgResponseTime > 10000) {
      recommendations.push("🚨 Very high response times. API may be under heavy load or experiencing issues.")
    }

    // Generate summary
    let summary = `Tested ${this.testResults.length} endpoints in ${totalTime}ms. `

    if (overallSuccess) {
      summary += "✅ All tests passed successfully."
    } else {
      summary += `❌ ${failedTests} test(s) failed. ${passedTests} test(s) passed.`
    }

    return {
      timestamp: new Date().toISOString(),
      managerId: this.managerId,
      overallSuccess,
      totalTests: this.testResults.length,
      passedTests,
      failedTests,
      results: this.testResults,
      recommendations,
      summary,
    }
  }
}

// Utility function to test multiple manager IDs
export async function testMultipleManagers(managerIds: string[]): Promise<TestReport[]> {
  const reports: TestReport[] = []

  for (const managerId of managerIds) {
    console.log(`\n🧪 Testing manager ID: ${managerId}`)
    const tester = new FPLAPITester(managerId)
    const report = await tester.runComprehensiveTest()
    reports.push(report)

    // Add delay between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  return reports
}

// Generate comprehensive report
export function generateComprehensiveReport(reports: TestReport[]): string {
  let report = `# FPL API Testing Report\n\n`
  report += `**Generated:** ${new Date().toISOString()}\n`
  report += `**Tested Manager IDs:** ${reports.map((r) => r.managerId).join(", ")}\n\n`

  // Executive Summary
  report += `## Executive Summary\n\n`
  const totalTests = reports.reduce((sum, r) => sum + r.totalTests, 0)
  const totalPassed = reports.reduce((sum, r) => sum + r.passedTests, 0)
  const totalFailed = reports.reduce((sum, r) => sum + r.failedTests, 0)
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : "0"

  report += `- **Total Tests:** ${totalTests}\n`
  report += `- **Passed:** ${totalPassed}\n`
  report += `- **Failed:** ${totalFailed}\n`
  report += `- **Success Rate:** ${successRate}%\n\n`

  // Individual Manager Results
  report += `## Individual Manager Results\n\n`

  for (const testReport of reports) {
    report += `### Manager ID: ${testReport.managerId}\n\n`
    report += `**Summary:** ${testReport.summary}\n\n`

    if (testReport.failedTests > 0) {
      report += `**Failed Tests:**\n`
      const failedResults = testReport.results.filter((r) => !r.success)
      for (const result of failedResults) {
        report += `- ${result.endpoint}: ${result.error}\n`
      }
      report += `\n`
    }

    if (testReport.recommendations.length > 0) {
      report += `**Recommendations:**\n`
      for (const rec of testReport.recommendations) {
        report += `- ${rec}\n`
      }
      report += `\n`
    }
  }

  // Performance Analysis
  report += `## Performance Analysis\n\n`
  const allResults = reports.flatMap((r) => r.results)
  const avgResponseTime = allResults.reduce((sum, r) => sum + r.responseTime, 0) / allResults.length
  const maxResponseTime = Math.max(...allResults.map((r) => r.responseTime))
  const minResponseTime = Math.min(...allResults.map((r) => r.responseTime))

  report += `- **Average Response Time:** ${avgResponseTime.toFixed(0)}ms\n`
  report += `- **Max Response Time:** ${maxResponseTime}ms\n`
  report += `- **Min Response Time:** ${minResponseTime}ms\n\n`

  // Error Analysis
  const errors = allResults.filter((r) => !r.success)
  if (errors.length > 0) {
    report += `## Error Analysis\n\n`
    const errorTypes = new Map<string, number>()

    for (const error of errors) {
      const errorType = error.error?.split(":")[0] || "Unknown"
      errorTypes.set(errorType, (errorTypes.get(errorType) || 0) + 1)
    }

    for (const [errorType, count] of errorTypes.entries()) {
      report += `- **${errorType}:** ${count} occurrence(s)\n`
    }
    report += `\n`
  }

  // Overall Recommendations
  const allRecommendations = [...new Set(reports.flatMap((r) => r.recommendations))]
  if (allRecommendations.length > 0) {
    report += `## Overall Recommendations\n\n`
    for (const rec of allRecommendations) {
      report += `- ${rec}\n`
    }
  }

  return report
}
