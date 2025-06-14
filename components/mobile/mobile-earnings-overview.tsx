"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Target, Eye, Download, Clock, CheckCircle } from "lucide-react"
import type { EarningsSummary } from "@/lib/supabase/payouts"

interface MobileEarningsOverviewProps {
  summary: EarningsSummary | null
  monthlyGoal?: number
  loading?: boolean
}

export function MobileEarningsOverview({ summary, monthlyGoal = 0, loading }: MobileEarningsOverviewProps) {
  const goalProgress = monthlyGoal > 0 ? ((summary?.current_month_earnings || 0) / monthlyGoal) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Main Earnings Card */}
      <Card className="border-0 auditx-shadow bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 auditx-gradient rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Earnings</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">${summary?.total_earnings?.toFixed(2) || "0.00"}</div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500">this month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 auditx-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-lg font-bold text-gray-900">${summary?.pending_earnings?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 auditx-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">This Month</p>
                <p className="text-lg font-bold text-gray-900">{summary?.current_month_audits || 0} audits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      {monthlyGoal > 0 && (
        <Card className="border-0 auditx-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-[#FC8019]" />
                Monthly Goal
              </CardTitle>
              <Badge variant="outline" className="text-[#FC8019] border-[#FC8019]">
                {goalProgress.toFixed(0)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Progress value={Math.min(goalProgress, 100)} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">${summary?.current_month_earnings?.toFixed(2) || "0.00"}</span>
                <span className="text-gray-600">${monthlyGoal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                ${Math.max(0, monthlyGoal - (summary?.current_month_earnings || 0)).toFixed(2)} remaining
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 flex-col gap-1">
          <Eye className="h-4 w-4" />
          <span className="text-xs">View Details</span>
        </Button>
        <Button variant="outline" className="h-12 flex-col gap-1">
          <Download className="h-4 w-4" />
          <span className="text-xs">Export</span>
        </Button>
      </div>
    </div>
  )
}
