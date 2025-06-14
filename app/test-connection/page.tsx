"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { testConnection, testAuth } from "@/lib/supabase-test"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [authStatus, setAuthStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleTestConnection = async () => {
    setConnectionStatus("testing")
    setErrorMessage("")

    try {
      const success = await testConnection()
      setConnectionStatus(success ? "success" : "error")
    } catch (err) {
      setConnectionStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Unknown error")
    }
  }

  const handleTestAuth = async () => {
    setAuthStatus("testing")

    try {
      const success = await testAuth()
      setAuthStatus(success ? "success" : "error")
    } catch (err) {
      setAuthStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Unknown error")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "testing":
        return <Loader2 className="h-5 w-5 animate-spin" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Database Connection Test</h1>
          <p className="text-muted-foreground mt-2">Test your Supabase connection and authentication setup</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Database Connection
              {getStatusIcon(connectionStatus)}
            </CardTitle>
            <CardDescription>Test if your app can connect to Supabase database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestConnection} disabled={connectionStatus === "testing"} className="w-full">
              {connectionStatus === "testing" ? "Testing..." : "Test Database Connection"}
            </Button>

            {connectionStatus === "success" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">✅ Database connection successful!</p>
              </div>
            )}

            {connectionStatus === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">❌ Database connection failed</p>
                {errorMessage && <p className="text-sm text-red-600 mt-1">{errorMessage}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Authentication System
              {getStatusIcon(authStatus)}
            </CardTitle>
            <CardDescription>Test if Supabase authentication is working</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestAuth} disabled={authStatus === "testing"} variant="outline" className="w-full">
              {authStatus === "testing" ? "Testing..." : "Test Authentication"}
            </Button>

            {authStatus === "success" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">✅ Authentication system working!</p>
              </div>
            )}

            {authStatus === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">❌ Authentication test failed</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Check</CardTitle>
            <CardDescription>Verify your environment variables are set correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            If tests fail, check the DATABASE_CONNECTION_GUIDE.md for troubleshooting steps
          </p>
        </div>
      </div>
    </div>
  )
}
