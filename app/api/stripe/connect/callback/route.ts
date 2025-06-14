import type { NextRequest } from "next/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const success = searchParams.get("success")
  const refresh = searchParams.get("refresh")

  if (success === "true") {
    // Successful onboarding
    redirect("/auditor/payouts/setup?onboarding=success")
  } else if (refresh === "true") {
    // User needs to refresh onboarding
    redirect("/auditor/payouts/setup?onboarding=refresh")
  } else {
    // Something went wrong
    redirect("/auditor/payouts/setup?onboarding=error")
  }
}
