import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createStripeExpressAccount, createAccountLink } from "@/lib/stripe"

export async function POST(request: NextRequest) {
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

    // Get user profile
    const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (!profile || profile.role !== "auditor") {
      return NextResponse.json({ error: "Only auditors can create Stripe accounts" }, { status: 403 })
    }

    // Get auditor record
    const { data: auditor } = await supabase.from("auditors").select("*").eq("user_id", user.id).single()

    if (!auditor) {
      return NextResponse.json({ error: "Auditor profile not found" }, { status: 404 })
    }

    // Check if already has Stripe account
    if (auditor.stripe_account_id) {
      return NextResponse.json({ error: "Stripe account already exists" }, { status: 400 })
    }

    // Create Stripe Express account
    const account = await createStripeExpressAccount({
      email: profile.email,
      full_name: profile.full_name,
      country: "US", // You might want to make this dynamic
    })

    // Update auditor with Stripe account ID
    await supabase
      .from("auditors")
      .update({
        stripe_account_id: account.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auditor.id)

    // Create account link for onboarding
    const accountLink = await createAccountLink(account.id)

    return NextResponse.json({
      success: true,
      account_id: account.id,
      onboarding_url: accountLink.url,
    })
  } catch (error) {
    console.error("Error creating Stripe account:", error)
    return NextResponse.json({ error: "Failed to create Stripe account" }, { status: 500 })
  }
}
