import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

    // Check if user is admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get comparative analytics data
    const { data, error } = await supabase.rpc("get_comparative_analytics")

    if (error) {
      console.error("Error fetching comparative analytics:", error)
      return NextResponse.json({ error: "Failed to fetch comparative analytics" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in comparative analytics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
