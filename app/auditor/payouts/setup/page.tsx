"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AuditXDashboardLayout } from "@/components/layout/auditx-dashboard-layout"
import { StripeOnboarding } from "@/components/stripe/stripe-onboarding"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function PayoutSetupPage() {
  const searchParams = useSearchParams()
  const onboarding = searchParams.get("onboarding")

  useEffect(() => {
    if (onboarding === "success") {
      toast.success("Stripe account setup completed successfully!")
    } else if (onboarding === "refresh") {
      toast.info("Please complete the remaining setup steps")
    } else if (onboarding === "error") {
      toast.error("There was an issue with the setup process")
    }
  }, [onboarding])

  return (
    <AuditXDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Setup</h1>
          <p className="text-gray-600 mt-1">Set up your payment method to receive audit earnings</p>
        </div>

        {/* Status Alerts */}
        {onboarding === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Great! Your Stripe account has been set up successfully. You can now receive payments.
            </AlertDescription>
          </Alert>
        )}

        {onboarding === "refresh" && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <RefreshCw className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your setup process was interrupted. Please complete the remaining steps to start receiving payments.
            </AlertDescription>
          </Alert>
        )}

        {onboarding === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              There was an issue with your setup. Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        )}

        {/* Stripe Onboarding Component */}
        <StripeOnboarding />
      </div>
    </AuditXDashboardLayout>
  )
}
