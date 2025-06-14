"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, Shield, Calendar, DollarSign, Edit, Plus, CheckCircle, AlertCircle } from "lucide-react"
import type { BankAccount, PayoutSettings } from "@/lib/supabase/payouts"

interface MobilePaymentSettingsProps {
  bankAccount: BankAccount | null
  settings: PayoutSettings | null
  onUpdateSettings: (settings: Partial<PayoutSettings>) => Promise<boolean>
  loading?: boolean
}

export function MobilePaymentSettings({
  bankAccount,
  settings,
  onUpdateSettings,
  loading,
}: MobilePaymentSettingsProps) {
  const [editingGoal, setEditingGoal] = useState(false)
  const [monthlyGoal, setMonthlyGoal] = useState(settings?.monthly_goal?.toString() || "")
  const [saving, setSaving] = useState(false)

  const handleSaveGoal = async () => {
    setSaving(true)
    try {
      const success = await onUpdateSettings({
        monthly_goal: Number.parseFloat(monthlyGoal) || 0,
      })
      if (success) {
        setEditingGoal(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAutoPayout = async (enabled: boolean) => {
    setSaving(true)
    try {
      await onUpdateSettings({
        auto_payout_enabled: enabled,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateFrequency = async (frequency: string) => {
    setSaving(true)
    try {
      await onUpdateSettings({
        payout_frequency: frequency,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateMinAmount = async (amount: string) => {
    setSaving(true)
    try {
      await onUpdateSettings({
        minimum_payout_amount: Number.parseFloat(amount) || 100,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Bank Account Card */}
      <Card className="border-0 auditx-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#FC8019]" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bankAccount ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">{bankAccount.bank_name}</p>
                  <p className="text-xs text-gray-500">••••{bankAccount.account_last_four}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={bankAccount.is_verified ? "success" : "warning"} className="text-xs">
                  {bankAccount.is_verified ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
                <Button variant="ghost" size="sm" className="p-1">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-3">No payment method added</p>
              <Button size="sm" className="auditx-gradient hover:opacity-90">
                <Plus className="h-3 w-3 mr-1" />
                Add Bank Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Schedule */}
      <Card className="border-0 auditx-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#FC8019]" />
            Payout Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Automatic Payouts</p>
              <p className="text-xs text-gray-500">Process payouts automatically</p>
            </div>
            <Switch
              checked={settings?.auto_payout_enabled || false}
              onCheckedChange={handleToggleAutoPayout}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Frequency</Label>
            <Select
              value={settings?.payout_frequency || "weekly"}
              onValueChange={handleUpdateFrequency}
              disabled={saving}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Minimum Amount</Label>
            <Select
              value={settings?.minimum_payout_amount?.toString() || "100"}
              onValueChange={handleUpdateMinAmount}
              disabled={saving}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">$50</SelectItem>
                <SelectItem value="100">$100</SelectItem>
                <SelectItem value="200">$200</SelectItem>
                <SelectItem value="500">$500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Goal */}
      <Card className="border-0 auditx-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#FC8019]" />
            Monthly Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingGoal ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Target Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveGoal}
                  disabled={saving}
                  className="flex-1 auditx-gradient hover:opacity-90"
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingGoal(false)
                    setMonthlyGoal(settings?.monthly_goal?.toString() || "")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">${settings?.monthly_goal?.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-gray-500">Monthly earning target</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditingGoal(true)} className="gap-1">
                <Edit className="h-3 w-3" />
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="border-0 auditx-shadow bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payments</p>
              <p className="text-xs text-blue-700 mt-1">
                All payments are processed securely through Stripe. Your banking information is encrypted and protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
