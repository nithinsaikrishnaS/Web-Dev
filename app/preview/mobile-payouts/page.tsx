"use client"

import { useState } from "react"
import { MobileEarningsOverview } from "@/components/mobile/mobile-earnings-overview"
import { MobilePayoutHistory } from "@/components/mobile/mobile-payout-history"
import { MobilePaymentSettings } from "@/components/mobile/mobile-payment-settings"
import { MobileEarningsDetail } from "@/components/mobile/mobile-earnings-detail"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Smartphone, Monitor } from "lucide-react"

// Mock data for preview
const mockSummary = {
  auditor_id: "preview-auditor",
  total_earnings: 2847.5,
  pending_earnings: 425.0,
  current_month_earnings: 1250.75,
  current_month_audits: 15,
  last_payout_date: "2024-01-15",
  next_payout_date: "2024-02-01",
}

const mockPayouts = [
  {
    id: "payout-001",
    auditor_id: "preview-auditor",
    amount: 850.0,
    audits_count: 12,
    method: "bank_transfer",
    status: "completed",
    submitted_at: "2024-01-15T10:00:00Z",
    processed_at: "2024-01-17T14:30:00Z",
    bank_account_last_four: "4532",
  },
  {
    id: "payout-002",
    auditor_id: "preview-auditor",
    amount: 675.25,
    audits_count: 9,
    method: "bank_transfer",
    status: "processing",
    submitted_at: "2024-01-28T09:15:00Z",
    bank_account_last_four: "4532",
  },
  {
    id: "payout-003",
    auditor_id: "preview-auditor",
    amount: 425.0,
    audits_count: 6,
    method: "bank_transfer",
    status: "pending",
    submitted_at: "2024-02-01T11:20:00Z",
    bank_account_last_four: "4532",
  },
]

const mockEarnings = [
  {
    id: "audit-001",
    auditor_id: "preview-auditor",
    task_id: "task-001",
    submitted_at: "2024-01-28T14:30:00Z",
    is_approved: true,
    submission_data: {
      overall_rating: 4.8,
      photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
    },
    audit_tasks: {
      title: "Restaurant Cleanliness Audit",
      payout_amount: 85.0,
      businesses: {
        name: "Mario's Italian Kitchen",
        categories: {
          name: "Restaurant",
        },
      },
    },
  },
  {
    id: "audit-002",
    auditor_id: "preview-auditor",
    task_id: "task-002",
    submitted_at: "2024-01-26T16:45:00Z",
    is_approved: true,
    submission_data: {
      overall_rating: 4.5,
      photos: ["photo4.jpg", "photo5.jpg"],
    },
    audit_tasks: {
      title: "Store Safety Compliance",
      payout_amount: 95.0,
      businesses: {
        name: "TechMart Electronics",
        categories: {
          name: "Retail",
        },
      },
    },
  },
  {
    id: "audit-003",
    auditor_id: "preview-auditor",
    task_id: "task-003",
    submitted_at: "2024-01-24T12:20:00Z",
    is_approved: false,
    submission_data: {
      overall_rating: 4.2,
      photos: ["photo6.jpg"],
    },
    audit_tasks: {
      title: "Customer Service Evaluation",
      payout_amount: 75.0,
      businesses: {
        name: "Downtown Coffee Co.",
        categories: {
          name: "Cafe",
        },
      },
    },
  },
]

const mockBankAccount = {
  id: "bank-001",
  auditor_id: "preview-auditor",
  bank_name: "Chase Bank",
  account_last_four: "4532",
  routing_number: "021000021",
  account_type: "checking",
  is_verified: true,
  created_at: "2024-01-01T00:00:00Z",
}

const mockSettings = {
  id: "settings-001",
  auditor_id: "preview-auditor",
  auto_payout_enabled: true,
  payout_frequency: "weekly",
  minimum_payout_amount: 100.0,
  monthly_goal: 2000.0,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T10:30:00Z",
}

export default function MobilePayoutsPreview() {
  const [currentView, setCurrentView] = useState<"overview" | "history" | "settings" | "detail">("overview")
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile")

  const handleUpdateSettings = async (newSettings: any) => {
    console.log("Updating settings:", newSettings)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "overview":
        return <MobileEarningsOverview summary={mockSummary} monthlyGoal={mockSettings.monthly_goal} loading={false} />
      case "history":
        return <MobilePayoutHistory payouts={mockPayouts} loading={false} />
      case "settings":
        return (
          <MobilePaymentSettings
            bankAccount={mockBankAccount}
            settings={mockSettings}
            onUpdateSettings={handleUpdateSettings}
            loading={false}
          />
        )
      case "detail":
        return (
          <MobileEarningsDetail earnings={mockEarnings} onBack={() => setCurrentView("overview")} loading={false} />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Mobile Payouts Preview</h1>
                <p className="text-sm text-gray-500">Interactive preview of mobile payout views</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[#FC8019] border-[#FC8019]">
                Preview Mode
              </Badge>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("mobile")}
                  className={viewMode === "mobile" ? "auditx-gradient text-white" : ""}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("desktop")}
                  className={viewMode === "desktop" ? "auditx-gradient text-white" : ""}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Navigation Panel */}
          <div className="w-64 bg-white rounded-lg border p-4 h-fit sticky top-24">
            <h3 className="font-semibold mb-4">Preview Navigation</h3>
            <div className="space-y-2">
              <Button
                variant={currentView === "overview" ? "default" : "ghost"}
                className={`w-full justify-start ${currentView === "overview" ? "auditx-gradient text-white" : ""}`}
                onClick={() => setCurrentView("overview")}
              >
                Earnings Overview
              </Button>
              <Button
                variant={currentView === "history" ? "default" : "ghost"}
                className={`w-full justify-start ${currentView === "history" ? "auditx-gradient text-white" : ""}`}
                onClick={() => setCurrentView("history")}
              >
                Payout History
              </Button>
              <Button
                variant={currentView === "settings" ? "default" : "ghost"}
                className={`w-full justify-start ${currentView === "settings" ? "auditx-gradient text-white" : ""}`}
                onClick={() => setCurrentView("settings")}
              >
                Payment Settings
              </Button>
              <Button
                variant={currentView === "detail" ? "default" : "ghost"}
                className={`w-full justify-start ${currentView === "detail" ? "auditx-gradient text-white" : ""}`}
                onClick={() => setCurrentView("detail")}
              >
                Earnings Detail
              </Button>
            </div>

            <div className="mt-6 p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-sm text-[#FC8019] mb-2">Preview Features</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Touch-optimized interface</li>
                <li>• Responsive design</li>
                <li>• Interactive components</li>
                <li>• Real-time updates</li>
                <li>• Mobile gestures</li>
              </ul>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="flex-1">
            <div
              className={`mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden ${
                viewMode === "mobile" ? "max-w-sm" : "max-w-4xl"
              }`}
            >
              {/* Phone Frame (Mobile Mode) */}
              {viewMode === "mobile" && (
                <div className="bg-gray-900 px-6 py-2 flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="w-20 h-1 bg-white rounded-full mx-auto"></div>
                  </div>
                  <div className="text-white text-xs">100%</div>
                </div>
              )}

              {/* Content */}
              <div className={`${viewMode === "mobile" ? "h-[600px]" : "min-h-[600px]"} overflow-y-auto`}>
                {renderCurrentView()}
              </div>

              {/* Home Indicator (Mobile Mode) */}
              {viewMode === "mobile" && (
                <div className="bg-white px-6 py-2 flex justify-center">
                  <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-2">How to Use This Preview</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Use the navigation panel on the left to switch between different mobile views</p>
                <p>• Toggle between mobile and desktop modes using the buttons in the header</p>
                <p>• All interactions are functional - try tapping buttons, scrolling, and using form controls</p>
                <p>• The preview uses mock data to demonstrate the full functionality</p>
                <p>• Mobile view simulates a phone interface with proper touch targets and gestures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
