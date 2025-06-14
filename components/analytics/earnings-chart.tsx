"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface MonthlyData {
  month: string
  earnings: number
  completed_audits: number
  approval_rate: number
}

interface EarningsChartProps {
  data: MonthlyData[]
  loading?: boolean
}

export function EarningsChart({ data, loading }: EarningsChartProps) {
  if (loading) {
    return (
      <Card className="border-0 auditx-shadow">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const sortedData = [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  const maxEarnings = Math.max(...sortedData.map((d) => d.earnings))
  const totalEarnings = sortedData.reduce((sum, d) => sum + d.earnings, 0)
  const avgEarnings = totalEarnings / sortedData.length

  // Calculate trend
  const recentMonths = sortedData.slice(-2)
  const trend =
    recentMonths.length === 2
      ? recentMonths[1].earnings > recentMonths[0].earnings
        ? "up"
        : recentMonths[1].earnings < recentMonths[0].earnings
          ? "down"
          : "stable"
      : "stable"

  const trendPercentage =
    recentMonths.length === 2 && recentMonths[0].earnings > 0
      ? Math.abs(((recentMonths[1].earnings - recentMonths[0].earnings) / recentMonths[0].earnings) * 100)
      : 0

  return (
    <Card className="border-0 auditx-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#FC8019]" />
              Earnings Trend
            </CardTitle>
            <CardDescription>Monthly earnings performance over time</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-sm">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : trend === "down" ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : null}
              <span className={trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}>
                {trend === "stable" ? "Stable" : `${trendPercentage.toFixed(1)}%`}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Bars */}
          <div className="flex items-end justify-between h-48 gap-2">
            {sortedData.map((month, index) => {
              const height = maxEarnings > 0 ? (month.earnings / maxEarnings) * 100 : 0
              const isCurrentMonth = index === sortedData.length - 1

              return (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <div className="text-xs text-gray-600 mb-1">${month.earnings.toFixed(0)}</div>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isCurrentMonth ? "auditx-gradient" : "bg-gray-200"
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {new Date(month.month).toLocaleDateString("en-US", { month: "short" })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-600">Average</div>
              <div className="font-semibold">${avgEarnings.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Best Month</div>
              <div className="font-semibold">${maxEarnings.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Months</div>
              <div className="font-semibold">{sortedData.length}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
