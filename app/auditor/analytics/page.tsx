"use client"

import { useState, useEffect } from "react"
import { AuditXDashboardLayout } from "@/components/layout/auditx-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EarningsChart } from "@/components/analytics/earnings-chart"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { CategoryPerformance } from "@/components/analytics/category-performance"
import { RefreshCw, Download, BarChart3, TrendingUp, Award } from "lucide-react"
import { toast } from "sonner"

interface AnalyticsData {
  performance: any
  monthly_trend: any[]
  category_performance: any[]
}

export default function AuditorAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/analytics/auditor")

      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const analyticsData = await response.json()
      setData(analyticsData)
      setError(null)
    } catch (err) {
      console.error("Error fetching analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to load analytics")
      toast.error("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleExport = () => {
    if (!data) return

    const exportData = {
      performance: data.performance,
      monthly_trend: data.monthly_trend,
      category_performance: data.category_performance,
      exported_at: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `auditor-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Analytics data exported successfully")
  }

  if (error) {
    return (
      <AuditXDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </AuditXDashboardLayout>
    )
  }

  return (
    <AuditXDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your audit performance and earnings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={fetchAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExport} disabled={!data}>
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#FC8019]" />
            Performance Overview
          </h2>
          <PerformanceMetrics data={data?.performance} loading={loading} />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Award className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <EarningsChart data={data?.monthly_trend || []} loading={loading} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryPerformance data={data?.category_performance || []} loading={loading} />
          </TabsContent>
        </Tabs>

        {/* Insights Card */}
        <Card className="border-0 auditx-shadow bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle className="text-[#FC8019]">Performance Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on your analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">💡 Optimization Tip</h4>
                <p className="text-sm text-gray-600">
                  {data?.performance?.approval_rate > 90
                    ? "Excellent approval rate! Consider taking on more complex audits for higher payouts."
                    : data?.performance?.approval_rate > 75
                      ? "Good performance! Focus on improving audit quality to increase your approval rate."
                      : "Work on improving audit thoroughness to boost your approval rate and earnings."}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">📈 Growth Opportunity</h4>
                <p className="text-sm text-gray-600">
                  {data?.category_performance?.length > 0
                    ? `Your strongest category is ${data.category_performance[0]?.category}. Consider specializing further in this area.`
                    : "Complete more audits across different categories to identify your strengths."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuditXDashboardLayout>
  )
}
