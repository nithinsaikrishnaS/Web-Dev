"use client"

import { useState, useEffect } from "react"
import { AuditXDashboardLayout } from "@/components/layout/auditx-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Download, Users, Trophy, TrendingUp, Calendar } from "lucide-react"
import { toast } from "sonner"

interface ComparativeData {
  top_performers: any[]
  category_leaders: any[]
  monthly_comparison: any[]
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<ComparativeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComparativeAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/analytics/comparative")

      if (!response.ok) {
        throw new Error("Failed to fetch comparative analytics")
      }

      const analyticsData = await response.json()
      setData(analyticsData)
      setError(null)
    } catch (err) {
      console.error("Error fetching comparative analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to load analytics")
      toast.error("Failed to load comparative analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComparativeAnalytics()
  }, [])

  if (error) {
    return (
      <AuditXDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
            <Button onClick={fetchComparativeAnalytics} variant="outline">
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
            <h1 className="text-3xl font-bold text-gray-900">Comparative Analytics</h1>
            <p className="text-gray-600 mt-1">Platform-wide performance insights and auditor comparisons</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={fetchComparativeAnalytics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Top Performers */}
        <Card className="border-0 auditx-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#FC8019]" />
              Top Performers
            </CardTitle>
            <CardDescription>Highest earning auditors on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Completed Audits</TableHead>
                    <TableHead>Approval Rate</TableHead>
                    <TableHead>Avg Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.top_performers?.slice(0, 10).map((performer, index) => (
                    <TableRow key={performer.auditor_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                    ? "bg-amber-600"
                                    : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{performer.full_name}</div>
                          <div className="text-sm text-gray-500">ID: {performer.auditor_id.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-[#FC8019]">
                        ${performer.total_earnings.toFixed(2)}
                      </TableCell>
                      <TableCell>{performer.completed_audits}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            performer.approval_rate >= 90
                              ? "success"
                              : performer.approval_rate >= 75
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {performer.approval_rate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{performer.avg_rating.toFixed(1)}</span>
                          <span className="text-yellow-500">⭐</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Category Leaders */}
        <Card className="border-0 auditx-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#FC8019]" />
              Category Leaders
            </CardTitle>
            <CardDescription>Top performers in each business category</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse grid gap-4 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.category_leaders?.map((leader) => (
                  <div key={leader.category} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-[#FC8019]" />
                      <h3 className="font-medium">{leader.category}</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{leader.leader}</p>
                      <p className="text-sm text-[#FC8019] font-medium">${leader.earnings.toFixed(2)}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{leader.completed_audits} audits</span>
                        <span>{leader.approval_rate.toFixed(1)}% approval</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="border-0 auditx-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#FC8019]" />
              Platform Trends
            </CardTitle>
            <CardDescription>Monthly platform performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Total Audits</TableHead>
                    <TableHead>Active Auditors</TableHead>
                    <TableHead>Avg Approval Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.monthly_comparison?.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(month.month).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-[#FC8019]">${month.total_earnings.toFixed(2)}</TableCell>
                      <TableCell>{month.total_audits}</TableCell>
                      <TableCell>{month.active_auditors}</TableCell>
                      <TableCell>
                        <Badge variant={month.avg_approval_rate >= 80 ? "success" : "warning"}>
                          {month.avg_approval_rate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuditXDashboardLayout>
  )
}
