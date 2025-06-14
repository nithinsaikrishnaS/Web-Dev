"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase" // Declare the supabase variable
import {
  getAuditorEarningsSummary,
  getAuditorPayouts,
  getAuditorEarnings,
  getAuditorBankAccount,
  getAuditorPayoutSettings,
  type EarningsSummary,
  type PayoutData,
  type AuditEarning,
  type BankAccount,
  type PayoutSettings,
} from "@/lib/supabase/payouts"

export function useAuditorEarnings() {
  const { profile } = useAuth()
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [payouts, setPayouts] = useState<PayoutData[]>([])
  const [earnings, setEarnings] = useState<AuditEarning[]>([])
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null)
  const [settings, setSettings] = useState<PayoutSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAuditorData() {
      if (!profile || profile.role !== "auditor") {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Get auditor ID from profile
        const { data: auditorData } = await supabase.from("auditors").select("id").eq("user_id", profile.id).single()

        if (!auditorData) {
          throw new Error("Auditor profile not found")
        }

        const auditorId = auditorData.id

        // Fetch all data in parallel
        const [summaryData, payoutsData, earningsData, bankAccountData, settingsData] = await Promise.all([
          getAuditorEarningsSummary(auditorId),
          getAuditorPayouts(auditorId),
          getAuditorEarnings(auditorId),
          getAuditorBankAccount(auditorId),
          getAuditorPayoutSettings(auditorId),
        ])

        setSummary(summaryData)
        setPayouts(payoutsData)
        setEarnings(earningsData)
        setBankAccount(bankAccountData)
        setSettings(settingsData)
      } catch (err) {
        console.error("Error fetching auditor data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchAuditorData()
  }, [profile])

  const refreshData = async () => {
    if (!profile || profile.role !== "auditor") return

    try {
      const { data: auditorData } = await supabase.from("auditors").select("id").eq("user_id", profile.id).single()

      if (auditorData) {
        const [summaryData, payoutsData, earningsData] = await Promise.all([
          getAuditorEarningsSummary(auditorData.id),
          getAuditorPayouts(auditorData.id),
          getAuditorEarnings(auditorData.id),
        ])

        setSummary(summaryData)
        setPayouts(payoutsData)
        setEarnings(earningsData)
      }
    } catch (err) {
      console.error("Error refreshing data:", err)
    }
  }

  return {
    summary,
    payouts,
    earnings,
    bankAccount,
    settings,
    loading,
    error,
    refreshData,
  }
}
