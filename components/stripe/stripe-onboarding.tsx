"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, CheckCircle, Clock, AlertCircle, ExternalLink, RefreshCw, Shield } from "lucide-react"
import { toast } from "sonner"

interface StripeAccountStatus {
  account_id?: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  onboarding_completed: boolean
  requirements?: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
  }
  country?: string
  default_currency?: string
}

export function StripeOnboarding() {
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    checkAccountStatus()
  }, [])

  const checkAccountStatus = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/stripe/account/status")

      if (response.ok) {
        const data = await response.json()
        setAccountStatus(data)
      } else if (response.status === 404) {
        // No account exists yet
        setAccountStatus(null)
      } else {
        throw new Error("Failed to check account status")
      }
    } catch (error) {
      console.error("Error checking account status:", error)
      toast.error("Failed to check Stripe account status")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const createStripeAccount = async () => {
    try {
      setCreating(true)
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboarding_url
      } else {
        throw new Error(data.error || "Failed to create Stripe account")
      }
    } catch (error) {
      console.error("Error creating Stripe account:", error)
      toast.error("Failed to create Stripe account")
    } finally {
      setCreating(false)
    }
  }

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-yellow-500" />
  }

  const getStatusBadge = (enabled: boolean) => {
    return <Badge variant={enabled ? "success" : "warning"}>{enabled ? "Complete" : "Pending"}</Badge>
  }

  if (loading) {
    return (
      <Card className="border-0 auditx-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Checking Stripe account status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No Stripe account exists
  if (!accountStatus) {
    return (
      <Card className="border-0 auditx-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#FC8019]" />
            Set Up Payments with Stripe
          </CardTitle>
          <CardDescription>Connect your bank account to receive audit payments securely through Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Secure & Trusted</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Stripe is used by millions of businesses worldwide. Your banking information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">What you'll need:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Bank account information for direct deposits
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Government-issued ID for verification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Tax information (SSN or EIN)
              </li>
            </ul>
          </div>

          <Button onClick={createStripeAccount} disabled={creating} className="w-full auditx-gradient hover:opacity-90">
            {creating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Setting up account...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Set Up Stripe Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Account exists - show status
  return (
    <div className="space-y-6">
      <Card className="border-0 auditx-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#FC8019]" />
                Stripe Account Status
              </CardTitle>
              <CardDescription>Account ID: {accountStatus.account_id}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={checkAccountStatus} disabled={refreshing}>
              {refreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {accountStatus.onboarding_completed ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your Stripe account is fully set up and ready to receive payments!
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Your account setup is incomplete. Complete the remaining steps to receive payments.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(accountStatus.charges_enabled)}
                <span className="text-sm font-medium">Charges</span>
              </div>
              {getStatusBadge(accountStatus.charges_enabled)}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(accountStatus.payouts_enabled)}
                <span className="text-sm font-medium">Payouts</span>
              </div>
              {getStatusBadge(accountStatus.payouts_enabled)}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(accountStatus.details_submitted)}
                <span className="text-sm font-medium">Details</span>
              </div>
              {getStatusBadge(accountStatus.details_submitted)}
            </div>
          </div>

          {accountStatus.requirements && (
            <div className="space-y-3">
              {accountStatus.requirements.currently_due.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Action Required:</h4>
                  <ul className="space-y-1 text-sm text-red-600">
                    {accountStatus.requirements.currently_due.map((requirement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        {requirement.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {accountStatus.requirements.eventually_due.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-600 mb-2">Eventually Required:</h4>
                  <ul className="space-y-1 text-sm text-yellow-600">
                    {accountStatus.requirements.eventually_due.map((requirement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {requirement.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!accountStatus.onboarding_completed && (
            <Button
              onClick={createStripeAccount}
              disabled={creating}
              className="w-full auditx-gradient hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Complete Stripe Setup
            </Button>
          )}
        </CardContent>
      </Card>

      {accountStatus.onboarding_completed && (
        <Card className="border-0 auditx-shadow">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">Country</label>
                <p className="text-sm">{accountStatus.country?.toUpperCase() || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Default Currency</label>
                <p className="text-sm">{accountStatus.default_currency?.toUpperCase() || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
