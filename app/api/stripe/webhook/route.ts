import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Store webhook event
    await supabase.from("stripe_webhook_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      event_data: event.data,
      processed: false,
    })

    // Process the event
    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account, supabase)
        break

      case "transfer.created":
      case "transfer.updated":
      case "transfer.paid":
      case "transfer.failed":
        await handleTransferEvent(event.data.object as Stripe.Transfer, event.type, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await supabase
      .from("stripe_webhook_events")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq("stripe_event_id", event.id)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleAccountUpdated(account: Stripe.Account, supabase: any) {
  try {
    // Find auditor by Stripe account ID
    const { data: auditor } = await supabase.from("auditors").select("id").eq("stripe_account_id", account.id).single()

    if (auditor) {
      await supabase.rpc("update_stripe_account_status", {
        p_auditor_id: auditor.id,
        p_stripe_account_id: account.id,
        p_charges_enabled: account.charges_enabled,
        p_payouts_enabled: account.payouts_enabled,
        p_details_submitted: account.details_submitted,
      })
    }
  } catch (error) {
    console.error("Error handling account update:", error)
  }
}

async function handleTransferEvent(transfer: Stripe.Transfer, eventType: string, supabase: any) {
  try {
    const status = getTransferStatus(transfer.status, eventType)

    // Update transaction record
    const { error } = await supabase
      .from("stripe_transactions")
      .update({
        status: status,
        stripe_response: transfer,
        processed_at: new Date().toISOString(),
        failure_code: transfer.failure_code,
        failure_message: transfer.failure_message,
      })
      .eq("stripe_transfer_id", transfer.id)

    if (error) {
      console.error("Error updating transaction:", error)
      return
    }

    // Update payout status based on transfer status
    const payoutStatus = getPayoutStatus(status)
    if (payoutStatus) {
      await supabase
        .from("payouts")
        .update({
          status: payoutStatus,
          completed_at: status === "paid" ? new Date().toISOString() : null,
          failure_reason: transfer.failure_message || null,
        })
        .eq("transaction_id", transfer.id)
    }
  } catch (error) {
    console.error("Error handling transfer event:", error)
  }
}

function getTransferStatus(stripeStatus: string, eventType: string): string {
  switch (eventType) {
    case "transfer.paid":
      return "paid"
    case "transfer.failed":
      return "failed"
    case "transfer.created":
      return "pending"
    default:
      return stripeStatus
  }
}

function getPayoutStatus(transferStatus: string): string | null {
  switch (transferStatus) {
    case "paid":
      return "completed"
    case "failed":
      return "failed"
    case "pending":
      return "processing"
    default:
      return null
  }
}
