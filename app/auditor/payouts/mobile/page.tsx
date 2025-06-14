"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileEarningsOverview } from "@/components/mobile/mobile-earnings-overview"
import { MobilePayoutHistory } from "@/components/mobile/mobile-payout-history"
import { MobilePaymentSettings } from "@/components/mobile/mobile-payment-settings"
import { MobileEarningsDetail } from "@/components/mobile/mobile-earnings-detail"
import { useAuditorEarnings } from "@/lib/hooks/use-auditor-data"
import { updatePayoutSettings } from "@/lib/supabase/payouts"
import { Home, History, Settings, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function MobilePayoutsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showEarningsDetail, setShowEarningsDetail] = useState(false)
  const { summary, payouts, earnings, bankAccount, settings, loading, error, refreshData } = useAuditorEarnings()

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      if (!summary?.auditor_id) return false

      const success = await updatePayoutSettings(summary.auditor_id, newSettings)
      if (success) {
        toast.success("Settings updated successfully")
        refreshData()
      }
      return success
    } catch (error) {
      toast.error("Failed to update settings")
      return false
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading earnings data</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (showEarningsDetail) {
    return <MobileEarningsDetail earnings={earnings} onBack={() => setShowEarningsDetail(false)} loading={loading} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Earnings</h1>
            <p className="text-sm text-gray-500">Track your audit payments</p>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsContent value="overview" className="flex-1 mt-0">
          <MobileEarningsOverview summary={summary} monthlyGoal={settings?.monthly_goal} loading={loading} />

          {/* Quick Actions */}
          <div className="p-4 space-y-3">
            <Button
              onClick={() => setShowEarningsDetail(true)}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">View All Earnings</p>
                <p className="text-xs text-gray-500">{earnings.length} completed audits</p>
              </div>
            </Button>

            <Button
              onClick={() => setActiveTab("history")}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <History className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Payout History</p>
                <p className="text-xs text-gray-500">{payouts.length} transactions</p>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 mt-0">
          <MobilePayoutHistory payouts={payouts} loading={loading} />
        </TabsContent>

        <TabsContent value="settings" className="flex-1 mt-0">
          <MobilePaymentSettings
            bankAccount={bankAccount}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            loading={loading}
          />
        </TabsContent>

        {/* Bottom Navigation */}
        <div className="sticky bottom-0 bg-white border-t">
          <TabsList className="grid w-full grid-cols-3 h-16 bg-transparent">
            <TabsTrigger
              value="overview"
              className="flex-col gap-1 data-[state=active]:bg-orange-50 data-[state=active]:text-[#FC8019]"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-col gap-1 data-[state=active]:bg-orange-50 data-[state=active]:text-[#FC8019]"
            >
              <History className="h-4 w-4" />
              <span className="text-xs">History</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-col gap-1 data-[state=active]:bg-orange-50 data-[state=active]:text-[#FC8019]"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}
