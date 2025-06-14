import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createTransfer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { payout_id } = await request.json()

    // Get current user (must be admin)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get payout details with auditor info
    const { data: payout } = await supabase
      .from("payouts")
      .select(`
        *,
        auditors (
          id,
          stripe_account_id,
          stripe_payouts_enabled,
          users (full_name, email)
        )
      `)
      .eq("id", payout_id)
      .single()

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 })
    }

    if (payout.status !== "pending") {
      return NextResponse.json({ error: "Payout already processed" }, { status: 400 })
    }

    if (!payout.auditors?.stripe_account_id) {
      return NextResponse.json({ error: "Auditor has no Stripe account" }, { status: 400 })
    }

    if (!payout.auditors?.stripe_payouts_enabled) {
      return NextResponse.json({ error: "Auditor account not ready for payouts" }, { status: 400 })
    }

    // Process the payout through database function
    const { data: processResult } = await supabase.rpc("process_stripe_payout", {
      p_payout_id: payout_id,
      p_stripe_account_id: payout.auditors.stripe_account_id,
    })

    if (!processResult?.success) {
      return NextResponse.json({ error: processResult?.error || "Failed to process payout" }, { status: 500 })
    }

    // Create Stripe transfer
    const transfer = await createTransfer(payout.amount, payout.auditors.stripe_account_id, `payout_${payout_id}`, {
      payout_id: payout_id,
      auditor_name: payout.auditors.users?.full_name || "Unknown",
      auditor_email: payout.auditors.users?.email || "Unknown",
    })

    // Update transaction record with Stripe transfer ID
    await supabase
      .from("stripe_transactions")
      .update({
        stripe_transfer_id: transfer.id,
        status: transfer.status,
        stripe_response: transfer,
        processed_at: new Date().toISOString(),
      })
      .eq("payout_id", payout_id)

    // Update payout status
    await supabase
      .from("payouts")
      .update({
        status: "processing",
        transaction_id: transfer.id,
        processed_at: new Date().toISOString(),
      })
      .eq("id", payout_id)

    return NextResponse.json({
      success: true,
      transfer_id: transfer.id,
      amount: payout.amount,
      status: transfer.status,
    })
  } catch (error) {
    console.error("Error processing payout:", error)
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 })
  }
}
