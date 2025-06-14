"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, DollarSign, ChevronRight, Wallet, Clock, CheckCircle, XCircle } from "lucide-react"
import type { PayoutData } from "@/lib/supabase/payouts"

interface MobilePayoutHistoryProps {
  payouts: PayoutData[]
  loading?: boolean
}

export function MobilePayoutHistory({ payouts, loading }: MobilePayoutHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "processing":
        return "pending"
      case "pending":
        return "warning"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      searchTerm === "" ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.amount.toString().includes(searchTerm)

    const matchesStatus = selectedStatus === "all" || payout.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "pending", "processing", "completed", "failed"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className={`whitespace-nowrap ${selectedStatus === status ? "auditx-gradient" : ""}`}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Payout List */}
      <div className="px-4 space-y-3">
        {filteredPayouts.length === 0 ? (
          <Card className="border-0 auditx-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No payouts found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? "Try adjusting your search" : "Complete audits to earn payouts"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPayouts.map((payout) => (
            <Card key={payout.id} className="border-0 auditx-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(payout.status)}
                      <Badge variant={getStatusColor(payout.status)} className="text-xs">
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">#{payout.id.slice(0, 8)}</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-gray-900">${payout.amount.toFixed(2)}</div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(payout.submitted_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {payout.audits_count} audits
                      </div>
                    </div>

                    {payout.method && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Wallet className="h-3 w-3" />
                        {payout.method.replace("_", " ")}
                        {payout.bank_account_last_four && ` ••••${payout.bank_account_last_four}`}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
