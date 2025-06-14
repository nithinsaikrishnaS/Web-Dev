import { supabase } from "@/lib/supabase"

export interface PayoutData {
  id: string
  auditor_id: string
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  method: "bank_transfer" | "paypal" | "stripe" | "check"
  audit_submissions: string[]
  audits_count: number
  period_start: string
  period_end: string
  transaction_id?: string
  bank_account_last_four?: string
  submitted_at: string
  processed_at?: string
  completed_at?: string
  admin_notes?: string
  failure_reason?: string

  // Joined data
  auditor?: {
    user_id: string
    users: {
      full_name: string
      email: string
      city: string
    }
    rating: number
  }
}

export interface EarningsSummary {
  auditor_id: string
  user_id: string
  full_name: string
  email: string
  city: string
  current_month_earnings: number
  total_earnings: number
  pending_earnings: number
  current_month_audits: number
  total_audits: number
  average_rating: number
  last_payout_date?: string
}

export interface AuditEarning {
  id: string
  task_id: string
  auditor_id: string
  submitted_at: string
  is_approved: boolean
  submission_data: any
  audit_tasks: {
    id: string
    title: string
    payout_amount: number
    businesses: {
      name: string
      categories: {
        name: string
      }
    }
  }
}

export interface BankAccount {
  id: string
  auditor_id: string
  bank_name: string
  account_holder_name: string
  account_last_four: string
  account_type: string
  is_verified: boolean
  is_primary: boolean
  is_active: boolean
}

export interface PayoutSettings {
  id: string
  auditor_id: string
  minimum_payout_amount: number
  payout_frequency: string
  preferred_method: string
  auto_payout_enabled: boolean
  monthly_goal: number
}

// Auditor functions
export async function getAuditorEarningsSummary(auditorId: string): Promise<EarningsSummary | null> {
  const { data, error } = await supabase
    .from("auditor_earnings_summary")
    .select("*")
    .eq("auditor_id", auditorId)
    .single()

  if (error) {
    console.error("Error fetching earnings summary:", error)
    return null
  }

  return data
}

export async function getAuditorPayouts(auditorId: string): Promise<PayoutData[]> {
  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("auditor_id", auditorId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching auditor payouts:", error)
    return []
  }

  return data || []
}

export async function getAuditorEarnings(auditorId: string): Promise<AuditEarning[]> {
  const { data, error } = await supabase
    .from("audit_submissions")
    .select(`
      *,
      audit_tasks (
        id,
        title,
        payout_amount,
        businesses (
          name,
          categories (name)
        )
      )
    `)
    .eq("auditor_id", auditorId)
    .eq("is_approved", true)
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching audit earnings:", error)
    return []
  }

  return data || []
}

export async function getAuditorBankAccount(auditorId: string): Promise<BankAccount | null> {
  const { data, error } = await supabase
    .from("auditor_bank_accounts")
    .select("*")
    .eq("auditor_id", auditorId)
    .eq("is_primary", true)
    .eq("is_active", true)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching bank account:", error)
  }

  return data
}

export async function getAuditorPayoutSettings(auditorId: string): Promise<PayoutSettings | null> {
  const { data, error } = await supabase
    .from("auditor_payout_settings")
    .select("*")
    .eq("auditor_id", auditorId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching payout settings:", error)
  }

  return data
}

export async function updatePayoutSettings(auditorId: string, settings: Partial<PayoutSettings>): Promise<boolean> {
  const { error } = await supabase.from("auditor_payout_settings").upsert({
    auditor_id: auditorId,
    ...settings,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error updating payout settings:", error)
    return false
  }

  return true
}

// Admin functions
export async function getAllPendingPayouts(): Promise<PayoutData[]> {
  const { data, error } = await supabase
    .from("payouts")
    .select(`
      *,
      auditors (
        user_id,
        rating,
        users (
          full_name,
          email,
          city
        )
      )
    `)
    .eq("status", "pending")
    .order("submitted_at", { ascending: true })

  if (error) {
    console.error("Error fetching pending payouts:", error)
    return []
  }

  return data || []
}

export async function getAllPayouts(status?: string): Promise<PayoutData[]> {
  let query = supabase.from("payouts").select(`
      *,
      auditors (
        user_id,
        rating,
        users (
          full_name,
          email,
          city
        )
      )
    `)

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payouts:", error)
    return []
  }

  return data || []
}

export async function getPayoutStats() {
  // Get pending payouts total
  const { data: pendingData } = await supabase.from("payouts").select("amount").eq("status", "pending")

  // Get completed payouts this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: completedData } = await supabase
    .from("payouts")
    .select("amount")
    .eq("status", "completed")
    .gte("completed_at", startOfMonth.toISOString())

  // Get top earners
  const { data: topEarners } = await supabase
    .from("auditor_earnings_summary")
    .select("*")
    .order("current_month_earnings", { ascending: false })
    .limit(5)

  const totalPending = pendingData?.reduce((sum, p) => sum + p.amount, 0) || 0
  const totalCompleted = completedData?.reduce((sum, p) => sum + p.amount, 0) || 0
  const pendingCount = pendingData?.length || 0
  const completedCount = completedData?.length || 0
  const averagePayout = completedCount > 0 ? totalCompleted / completedCount : 0

  return {
    totalPending,
    totalCompleted,
    pendingCount,
    completedCount,
    averagePayout,
    topEarners: topEarners || [],
  }
}

export async function updatePayoutStatus(
  payoutId: string,
  status: PayoutData["status"],
  transactionId?: string,
  adminNotes?: string,
  failureReason?: string,
): Promise<boolean> {
  const { error } = await supabase.rpc("update_payout_status", {
    p_payout_id: payoutId,
    p_status: status,
    p_transaction_id: transactionId,
    p_admin_notes: adminNotes,
    p_failure_reason: failureReason,
  })

  if (error) {
    console.error("Error updating payout status:", error)
    return false
  }

  return true
}

export async function createAutomaticPayout(auditorId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("create_automatic_payout", {
    p_auditor_id: auditorId,
  })

  if (error) {
    console.error("Error creating automatic payout:", error)
    return null
  }

  return data
}

export async function bulkProcessPayouts(payoutIds: string[]): Promise<boolean> {
  const updates = payoutIds.map((id) => updatePayoutStatus(id, "processing"))

  try {
    await Promise.all(updates)
    return true
  } catch (error) {
    console.error("Error bulk processing payouts:", error)
    return false
  }
}
