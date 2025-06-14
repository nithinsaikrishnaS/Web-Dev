"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import {
  getAllPendingPayouts,
  getAllPayouts,
  getPayoutStats,
  updatePayoutStatus,
  bulkProcessPayouts,
  type PayoutData,
} from "@/lib/supabase/payouts"

export function useAdminPayouts() {
  const { profile } = useAuth()
  const [pendingPayouts, setPendingPayouts] = useState<PayoutData[]>([])
  const [allPayouts, setAllPayouts] = useState<PayoutData[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAdminData() {
      if (!profile || profile.role !== "admin") {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [pendingData, allData, statsData] = await Promise.all([
          getAllPendingPayouts(),
          getAllPayouts(),
          getPayoutStats(),
        ])

        setPendingPayouts(pendingData)
        setAllPayouts(allData)
        setStats(statsData)
      } catch (err) {
        console.error("Error fetching admin payout data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [profile])

  const processPayout = async (
    payoutId: string,
    status: PayoutData["status"],
    transactionId?: string,
    adminNotes?: string,
  ) => {
    try {
      const success = await updatePayoutStatus(payoutId, status, transactionId, adminNotes)

      if (success) {
        // Refresh data
        const [pendingData, allData, statsData] = await Promise.all([
          getAllPendingPayouts(),
          getAllPayouts(),
          getPayoutStats(),
        ])

        setPendingPayouts(pendingData)
        setAllPayouts(allData)
        setStats(statsData)
      }

      return success
    } catch (err) {
      console.error("Error processing payout:", err)
      return false
    }
  }

  const processBulkPayouts = async (payoutIds: string[]) => {
    try {
      const success = await bulkProcessPayouts(payoutIds)

      if (success) {
        // Refresh data
        const [pendingData, allData, statsData] = await Promise.all([
          getAllPendingPayouts(),
          getAllPayouts(),
          getPayoutStats(),
        ])

        setPendingPayouts(pendingData)
        setAllPayouts(allData)
        setStats(statsData)
      }

      return success
    } catch (err) {
      console.error("Error processing bulk payouts:", err)
      return false
    }
  }

  const refreshData = async () => {
    if (!profile || profile.role !== "admin") return

    try {
      const [pendingData, allData, statsData] = await Promise.all([
        getAllPendingPayouts(),
        getAllPayouts(),
        getPayoutStats(),
      ])

      setPendingPayouts(pendingData)
      setAllPayouts(allData)
      setStats(statsData)
    } catch (err) {
      console.error("Error refreshing data:", err)
    }
  }

  return {
    pendingPayouts,
    allPayouts,
    stats,
    loading,
    error,
    processPayout,
    processBulkPayouts,
    refreshData,
  }
}
