"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Star, Building2, CheckCircle, Camera, FileText } from "lucide-react"
import type { AuditEarning } from "@/lib/supabase/payouts"

interface MobileEarningsDetailProps {
  earnings: AuditEarning[]
  onBack: () => void
  loading?: boolean
}

export function MobileEarningsDetail({ earnings, onBack, loading }: MobileEarningsDetailProps) {
  const [selectedTab, setSelectedTab] = useState("recent")

  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? "success" : "warning"
  }

  const groupEarningsByMonth = (earnings: AuditEarning[]) => {
    const grouped = earnings.reduce(
      (acc, earning) => {
        const month = new Date(earning.submitted_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
        if (!acc[month]) acc[month] = []
        acc[month].push(earning)
        return acc
      },
      {} as Record<string, AuditEarning[]>,
    )

    return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const groupedEarnings = groupEarningsByMonth(earnings)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold">Earnings Detail</h1>
            <p className="text-sm text-gray-500">{earnings.length} completed audits</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="monthly">By Month</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-3">
            {earnings.slice(0, 20).map((earning) => (
              <Card key={earning.id} className="border-0 auditx-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {earning.audit_tasks?.businesses?.name || "Unknown Business"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{earning.audit_tasks?.title}</p>
                      </div>
                      <Badge variant={getStatusColor(earning.is_approved)} className="text-xs">
                        {earning.is_approved ? "Paid" : "Pending"}
                      </Badge>
                    </div>

                    {/* Amount and Rating */}
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-[#FC8019]">
                        ${earning.audit_tasks?.payout_amount?.toFixed(2) || "0.00"}
                      </div>
                      {earning.submission_data?.overall_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{earning.submission_data.overall_rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(earning.submitted_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {earning.audit_tasks?.businesses?.categories?.name || "Unknown"}
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-2">
                      {earning.submission_data?.photos && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Camera className="h-3 w-3" />
                          {Array.isArray(earning.submission_data.photos) ? earning.submission_data.photos.length : 0}{" "}
                          photos
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FileText className="h-3 w-3" />
                        Submitted
                      </div>
                      {earning.is_approved && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            {groupedEarnings.map(([month, monthEarnings]) => {
              const monthTotal = monthEarnings.reduce(
                (sum, earning) => sum + (earning.audit_tasks?.payout_amount || 0),
                0,
              )

              return (
                <div key={month} className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <h3 className="font-medium">{month}</h3>
                      <p className="text-sm text-gray-500">{monthEarnings.length} audits</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#FC8019]">${monthTotal.toFixed(2)}</div>
                    </div>
                  </div>

                  {monthEarnings.map((earning) => (
                    <Card key={earning.id} className="border-0 auditx-shadow ml-4">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{earning.audit_tasks?.businesses?.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(earning.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${earning.audit_tasks?.payout_amount?.toFixed(2)}</div>
                            <Badge variant={getStatusColor(earning.is_approved)} className="text-xs">
                              {earning.is_approved ? "Paid" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
