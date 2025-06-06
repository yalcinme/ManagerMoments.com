interface PerformanceMetrics {
  apiResponseTime: number
  dataProcessingTime: number
  renderTime: number
  totalLoadTime: number
  memoryUsage: number
  cacheHitRate: number
  errorRate: number
}

interface PerformanceBenchmark {
  excellent: number
  good: number
  acceptable: number
  poor: number
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = []
  private static readonly MAX_METRICS = 100

  // Performance benchmarks (in milliseconds)
  private static readonly BENCHMARKS: Record<
    keyof Omit<PerformanceMetrics, "memoryUsage" | "cacheHitRate" | "errorRate">,
    PerformanceBenchmark
  > = {
    apiResponseTime: { excellent: 1000, good: 2000, acceptable: 5000, poor: 10000 },
    dataProcessingTime: { excellent: 500, good: 1000, acceptable: 2000, poor: 5000 },
    renderTime: { excellent: 100, good: 300, acceptable: 500, poor: 1000 },
    totalLoadTime: { excellent: 2000, good: 4000, acceptable: 8000, poor: 15000 },
  }

  static recordMetrics(metrics: PerformanceMetrics) {
    this.metrics.push({
      ...metrics,
      timestamp: Date.now(),
    } as any)

    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift()
    }

    console.log("📊 Performance Metrics:", {
      apiResponseTime: `${metrics.apiResponseTime}ms`,
      dataProcessingTime: `${metrics.dataProcessingTime}ms`,
      renderTime: `${metrics.renderTime}ms`,
      totalLoadTime: `${metrics.totalLoadTime}ms`,
      memoryUsage: `${metrics.memoryUsage}MB`,
      cacheHitRate: `${metrics.cacheHitRate}%`,
      errorRate: `${metrics.errorRate}%`,
    })
  }

  static getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        apiResponseTime: 0,
        dataProcessingTime: 0,
        renderTime: 0,
        totalLoadTime: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        errorRate: 0,
      }
    }

    const totals = this.metrics.reduce(
      (acc, metric) => ({
        apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
        dataProcessingTime: acc.dataProcessingTime + metric.dataProcessingTime,
        renderTime: acc.renderTime + metric.renderTime,
        totalLoadTime: acc.totalLoadTime + metric.totalLoadTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
        errorRate: acc.errorRate + metric.errorRate,
      }),
      {
        apiResponseTime: 0,
        dataProcessingTime: 0,
        renderTime: 0,
        totalLoadTime: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        errorRate: 0,
      },
    )

    const count = this.metrics.length
    return {
      apiResponseTime: Math.round(totals.apiResponseTime / count),
      dataProcessingTime: Math.round(totals.dataProcessingTime / count),
      renderTime: Math.round(totals.renderTime / count),
      totalLoadTime: Math.round(totals.totalLoadTime / count),
      memoryUsage: Math.round(totals.memoryUsage / count),
      cacheHitRate: Math.round(totals.cacheHitRate / count),
      errorRate: Math.round(totals.errorRate / count),
    }
  }

  static getPerformanceGrade(metric: keyof PerformanceMetrics, value: number): string {
    if (metric === "memoryUsage") {
      if (value < 50) return "A+"
      if (value < 100) return "A"
      if (value < 200) return "B"
      if (value < 500) return "C"
      return "D"
    }

    if (metric === "cacheHitRate") {
      if (value >= 90) return "A+"
      if (value >= 80) return "A"
      if (value >= 70) return "B"
      if (value >= 60) return "C"
      return "D"
    }

    if (metric === "errorRate") {
      if (value <= 1) return "A+"
      if (value <= 3) return "A"
      if (value <= 5) return "B"
      if (value <= 10) return "C"
      return "D"
    }

    const benchmark = this.BENCHMARKS[metric as keyof typeof this.BENCHMARKS]
    if (!benchmark) return "N/A"

    if (value <= benchmark.excellent) return "A+"
    if (value <= benchmark.good) return "A"
    if (value <= benchmark.acceptable) return "B"
    if (value <= benchmark.poor) return "C"
    return "D"
  }

  static generatePerformanceReport(): string {
    const avgMetrics = this.getAverageMetrics()

    let report = "⚡ PERFORMANCE REPORT\n"
    report += "====================\n\n"

    report += "📊 Average Metrics:\n"
    report += `- API Response Time: ${avgMetrics.apiResponseTime}ms (${this.getPerformanceGrade("apiResponseTime", avgMetrics.apiResponseTime)})\n`
    report += `- Data Processing: ${avgMetrics.dataProcessingTime}ms (${this.getPerformanceGrade("dataProcessingTime", avgMetrics.dataProcessingTime)})\n`
    report += `- Render Time: ${avgMetrics.renderTime}ms (${this.getPerformanceGrade("renderTime", avgMetrics.renderTime)})\n`
    report += `- Total Load Time: ${avgMetrics.totalLoadTime}ms (${this.getPerformanceGrade("totalLoadTime", avgMetrics.totalLoadTime)})\n`
    report += `- Memory Usage: ${avgMetrics.memoryUsage}MB (${this.getPerformanceGrade("memoryUsage", avgMetrics.memoryUsage)})\n`
    report += `- Cache Hit Rate: ${avgMetrics.cacheHitRate}% (${this.getPerformanceGrade("cacheHitRate", avgMetrics.cacheHitRate)})\n`
    report += `- Error Rate: ${avgMetrics.errorRate}% (${this.getPerformanceGrade("errorRate", avgMetrics.errorRate)})\n\n`

    // Overall grade
    const grades = [
      this.getPerformanceGrade("apiResponseTime", avgMetrics.apiResponseTime),
      this.getPerformanceGrade("dataProcessingTime", avgMetrics.dataProcessingTime),
      this.getPerformanceGrade("renderTime", avgMetrics.renderTime),
      this.getPerformanceGrade("totalLoadTime", avgMetrics.totalLoadTime),
      this.getPerformanceGrade("memoryUsage", avgMetrics.memoryUsage),
      this.getPerformanceGrade("cacheHitRate", avgMetrics.cacheHitRate),
      this.getPerformanceGrade("errorRate", avgMetrics.errorRate),
    ]

    const gradePoints = grades.map((grade) => {
      switch (grade) {
        case "A+":
          return 4.0
        case "A":
          return 3.7
        case "B":
          return 3.0
        case "C":
          return 2.0
        case "D":
          return 1.0
        default:
          return 0
      }
    })

    const avgGrade = gradePoints.reduce((sum, points) => sum + points, 0) / gradePoints.length
    let overallGrade = "D"
    if (avgGrade >= 3.8) overallGrade = "A+"
    else if (avgGrade >= 3.5) overallGrade = "A"
    else if (avgGrade >= 2.8) overallGrade = "B"
    else if (avgGrade >= 2.0) overallGrade = "C"

    report += `🎯 Overall Performance Grade: ${overallGrade}\n\n`

    // Recommendations
    report += "💡 Recommendations:\n"
    if (avgMetrics.apiResponseTime > 5000) {
      report += "- Optimize API response times with better caching\n"
    }
    if (avgMetrics.cacheHitRate < 80) {
      report += "- Improve cache hit rate with longer TTL\n"
    }
    if (avgMetrics.errorRate > 5) {
      report += "- Reduce error rate with better error handling\n"
    }
    if (avgMetrics.memoryUsage > 200) {
      report += "- Optimize memory usage\n"
    }

    return report
  }

  static isDeploymentReady(): boolean {
    const avgMetrics = this.getAverageMetrics()

    return (
      avgMetrics.apiResponseTime < 10000 &&
      avgMetrics.totalLoadTime < 15000 &&
      avgMetrics.errorRate < 10 &&
      avgMetrics.memoryUsage < 500
    )
  }
}
