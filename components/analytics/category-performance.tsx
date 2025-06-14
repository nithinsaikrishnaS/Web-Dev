"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building2, Star, DollarSign, CheckCircle } from "lucide-react"

interface CategoryData {
  category: string
  earnings: number
  completed_audits: number
  approval_rate: number
  avg_rating: number
}

interface CategoryPerformanceProps {
  data: CategoryData[]
  loading?: boolean
}

export function CategoryPerformance({ data, loading }: CategoryPerformanceProps) {
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
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const sortedData = [...data].sort((a, b) => b.earnings - a.earnings)
  const totalEarnings = sortedData.reduce((sum, cat) => sum + cat.earnings, 0)

  return (
    <Card className="border-0 auditx-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#FC8019]" />
          Category Performance
        </CardTitle>
        <CardDescription>Earnings and performance breakdown by business category</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No category data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedData.map((category, index) => {
              const percentage = totalEarnings > 0 ? (category.earnings / totalEarnings) * 100 : 0

              return (
                <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 auditx-gradient rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.category}</h3>
                        <p className="text-sm text-gray-500">{category.completed_audits} audits completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#FC8019]">${category.earnings.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Avg/Audit</span>
                      </div>
                      <div className="font-semibold text-sm">
                        $
                        {category.completed_audits > 0
                          ? (category.earnings / category.completed_audits).toFixed(2)
                          : "0.00"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Approval</span>
                      </div>
                      <div className="font-semibold text-sm">{category.approval_rate.toFixed(1)}%</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Rating</span>
                      </div>
                      <div className="font-semibold text-sm">{category.avg_rating.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Performance</span>
                      <span>{category.approval_rate.toFixed(1)}%</span>
                    </div>
                    <Progress value={category.approval_rate} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
