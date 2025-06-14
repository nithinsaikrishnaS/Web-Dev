import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
})

// Stripe Connect configuration for marketplace payments
export const STRIPE_CONNECT_CONFIG = {
  client_id: process.env.STRIPE_CONNECT_CLIENT_ID,
  redirect_uri:
    process.env.NODE_ENV === "production"
      ? "https://your-domain.com/api/stripe/connect/callback"
      : "http://localhost:3000/api/stripe/connect/callback",
  scope: "read_write",
}

// Helper function to create Express account for auditors
export async function createStripeExpressAccount(auditorData: {
  email: string
  full_name: string
  country?: string
}) {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: auditorData.country || "US",
      email: auditorData.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      individual: {
        email: auditorData.email,
        first_name: auditorData.full_name.split(" ")[0],
        last_name: auditorData.full_name.split(" ").slice(1).join(" ") || auditorData.full_name.split(" ")[0],
      },
    })

    return account
  } catch (error) {
    console.error("Error creating Stripe Express account:", error)
    throw error
  }
}

// Create account link for onboarding
export async function createAccountLink(accountId: string, refreshUrl?: string, returnUrl?: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl || `${process.env.NEXTAUTH_URL}/auditor/payouts/setup?refresh=true`,
      return_url: returnUrl || `${process.env.NEXTAUTH_URL}/auditor/payouts/setup?success=true`,
      type: "account_onboarding",
    })

    return accountLink
  } catch (error) {
    console.error("Error creating account link:", error)
    throw error
  }
}

// Create transfer to auditor
export async function createTransfer(
  amount: number,
  destinationAccount: string,
  transferGroup?: string,
  metadata?: Record<string, string>,
) {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      destination: destinationAccount,
      transfer_group: transferGroup,
      metadata: metadata || {},
    })

    return transfer
  } catch (error) {
    console.error("Error creating transfer:", error)
    throw error
  }
}

// Get account details
export async function getAccountDetails(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    return account
  } catch (error) {
    console.error("Error retrieving account details:", error)
    throw error
  }
}

// Check if account can receive payouts
export function canReceivePayouts(account: Stripe.Account): boolean {
  return account.charges_enabled && account.payouts_enabled && account.details_submitted
}
