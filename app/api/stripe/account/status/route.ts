import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getAccountDetails } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get auditor record
    const { data: auditor } = await supabase.from("auditors").select("*").eq("user_id", user.id).single()

    if (!auditor || !auditor.stripe_account_id) {
      return NextResponse.json({ error: "No Stripe account found" }, { status: 404 })
    }

    // Get account details from Stripe
    const account = await getAccountDetails(auditor.stripe_account_id)

    // Update local database with current status
    await supabase.rpc("update_stripe_account_status", {
      p_auditor_id: auditor.id,
      p_stripe_account_id: account.id,
      p_charges_enabled: account.charges_enabled,
      p_payouts_enabled: account.payouts_enabled,
      p_details_submitted: account.details_submitted,
    })

    return NextResponse.json({
      account_id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      onboarding_completed: account.charges_enabled && account.payouts_enabled && account.details_submitted,
      requirements: account.requirements,
      country: account.country,
      default_currency: account.default_currency,
    })
  } catch (error) {
    console.error("Error getting account status:", error)
    return NextResponse.json({ error: "Failed to get account status" }, { status: 500 })
  }
}
