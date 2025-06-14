// Test file to verify Supabase connection
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function - you can call this to verify connection
export async function testConnection() {
  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from("users").select("count")

    if (error) {
      console.error("Connection test failed:", error.message)
      return false
    }

    console.log("✅ Supabase connection successful!")
    return true
  } catch (err) {
    console.error("❌ Connection error:", err)
    return false
  }
}

// Test function for authentication
export async function testAuth() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Auth test failed:", error.message)
      return false
    }

    console.log("✅ Auth system working!", session ? "User logged in" : "No user session")
    return true
  } catch (err) {
    console.error("❌ Auth error:", err)
    return false
  }
}
