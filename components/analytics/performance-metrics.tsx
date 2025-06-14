"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Award, CheckCircle, Star, Calendar, DollarSign, BarChart3 } from "lucide-react"

interface PerformanceData {
  auditor_id: string
  full_name: string
  total_earnings: number
  completed_audits: number
  total_submissions: number
  current_month_earnings: number
  current_month_audits: number
  approval_rate: number
  avg_earning_per_audit: number
  avg_rating: number
  first_audit_date: string
  last_audit_date: string
  days_since_last_audit: number
}

interface PerformanceMetricsProps {
  data: PerformanceData
  loading?: boolean
}

export function PerformanceMetrics({ data, loading }: PerformanceMetricsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border-0 auditx-shadow">
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const getActivityStatus = (daysSince: number) => {
    if (daysSince <= 1) return { status: "Very Active", color: "success", icon: CheckCircle }
    if (daysSince <= 7) return { status: "Active", color: "success", icon: CheckCircle }
    if (daysSince <= 30) return { status: "Moderate", color: "warning", icon: Calendar }
    return { status: "Inactive", color: "destructive", icon: Calendar }
  }

  const activityStatus = getActivityStatus(data.days_since_last_audit || 0)
  const ActivityIcon = activityStatus.icon

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Earnings */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          <div className="w-8 h-8 auditx-gradient rounded-lg flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">${data.total_earnings?.toFixed(2) || "0.00"}</div>
          <p className="text-xs text-gray-500 mt-1">${data.current_month_earnings?.toFixed(2) || "0.00"} this month</p>
        </CardContent>
      </Card>

      {/* Completed Audits */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Completed Audits</CardTitle>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{data.completed_audits || 0}</div>
          <p className="text-xs text-gray-500 mt-1">{data.current_month_audits || 0} this month</p>
        </CardContent>
      </Card>

      {/* Approval Rate */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{data.approval_rate?.toFixed(1) || 0}%</div>
          <Progress value={data.approval_rate || 0} className="h-2 mt-2" />
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Star className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{data.avg_rating?.toFixed(1) || "0.0"}</div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(data.avg_rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avg per Audit */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Avg per Audit</CardTitle>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">${data.avg_earning_per_audit?.toFixed(2) || "0.00"}</div>
          <p className="text-xs text-gray-500 mt-1">Per completed audit</p>
        </CardContent>
      </Card>

      {/* Activity Status */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Activity Status</CardTitle>
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <ActivityIcon className="h-4 w-4 text-gray-600" />
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant={activityStatus.color} className="mb-2">
            {activityStatus.status}
          </Badge>
          <p className="text-xs text-gray-500">
            {data.days_since_last_audit === 0
              ? "Active today"
              : data.days_since_last_audit === 1
                ? "1 day ago"
                : `${data.days_since_last_audit} days ago`}
          </p>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Experience</CardTitle>
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Award className="h-4 w-4 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.first_audit_date
              ? Math.floor(
                  (new Date().getTime() - new Date(data.first_audit_date).getTime()) / (1000 * 60 * 60 * 24 * 30),
                )
              : 0}
            mo
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Since {data.first_audit_date ? new Date(data.first_audit_date).toLocaleDateString() : "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="border-0 auditx-shadow auditx-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.total_submissions > 0 ? ((data.completed_audits / data.total_submissions) * 100).toFixed(1) : "0.0"}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {data.completed_audits} of {data.total_submissions} submissions
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
