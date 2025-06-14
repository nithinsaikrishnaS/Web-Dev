import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const auditorId = searchParams.get("auditor_id")

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    // If not admin, only allow viewing own data
    let targetAuditorId = auditorId
    if (profile?.role !== "admin") {
      const { data: auditor } = await supabase.from("auditors").select("id").eq("user_id", user.id).single()
      if (!auditor) {
        return NextResponse.json({ error: "Auditor profile not found" }, { status: 404 })
      }
      targetAuditorId = auditor.id
    }

    // Get analytics data
    const { data, error } = await supabase.rpc("get_auditor_analytics", {
      p_auditor_id: targetAuditorId,
    })

    if (error) {
      console.error("Error fetching analytics:", error)
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in analytics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
