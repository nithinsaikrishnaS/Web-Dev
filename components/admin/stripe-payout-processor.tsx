"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Send, AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import type { PayoutData } from "@/lib/supabase/payouts"

interface StripePayoutProcessorProps {
  payout: PayoutData
  onPayoutProcessed: () => void
}

export function StripePayoutProcessor({ payout, onPayoutProcessed }: StripePayoutProcessorProps) {
  const [processing, setProcessing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const canProcessPayout = () => {
    return payout.status === "pending" && payout.auditor?.stripe_account_id && payout.auditor?.stripe_payouts_enabled
  }

  const getStripeStatusBadge = () => {
    if (!payout.auditor?.stripe_account_id) {
      return <Badge variant="destructive">No Stripe Account</Badge>
    }

    if (!payout.auditor?.stripe_payouts_enabled) {
      return <Badge variant="warning">Setup Incomplete</Badge>
    }

    return <Badge variant="success">Ready for Payout</Badge>
  }

  const processStripePayout = async () => {
    try {
      setProcessing(true)

      const response = await fetch("/api/stripe/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payout_id: payout.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Payout processed successfully! Transfer ID: ${data.transfer_id}`)
        setDialogOpen(false)
        onPayoutProcessed()
      } else {
        throw new Error(data.error || "Failed to process payout")
      }
    } catch (error) {
      console.error("Error processing payout:", error)
      toast.error(error instanceof Error ? error.message : "Failed to process payout")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="auditx-gradient hover:opacity-90 gap-1" disabled={!canProcessPayout()}>
          <CreditCard className="h-3 w-3" />
          Process with Stripe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Stripe Payout</DialogTitle>
          <DialogDescription>Review the payout details and process payment through Stripe</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payout Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Auditor Information</h4>
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <p className="font-medium">{payout.auditor?.users?.full_name}</p>
                <p className="text-sm text-gray-600">{payout.auditor?.users?.email}</p>
                <p className="text-sm text-gray-600">{payout.auditor?.users?.city}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Stripe Status:</span>
                  {getStripeStatusBadge()}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Payout Details</h4>
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <p className="text-2xl font-bold text-[#FC8019]">${payout.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{payout.audits_count} completed audits</p>
                <p className="text-sm text-gray-600">
                  Period: {new Date(payout.period_start).toLocaleDateString()} -{" "}
                  {new Date(payout.period_end).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Submitted: {new Date(payout.submitted_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Stripe Account Status */}
          <div className="space-y-3">
            <h4 className="font-medium">Stripe Account Verification</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Account Created</span>
                {payout.auditor?.stripe_account_id ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Details Submitted</span>
                {payout.auditor?.stripe_details_submitted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Payouts Enabled</span>
                {payout.auditor?.stripe_payouts_enabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>

          {/* Warnings */}
          {!canProcessPayout() && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {!payout.auditor?.stripe_account_id && "Auditor has not set up their Stripe account yet."}
                {payout.auditor?.stripe_account_id &&
                  !payout.auditor?.stripe_payouts_enabled &&
                  "Auditor's Stripe account setup is incomplete. They need to complete verification."}
                {payout.status !== "pending" && "This payout has already been processed."}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              onClick={processStripePayout}
              disabled={!canProcessPayout() || processing}
              className="auditx-gradient hover:opacity-90"
            >
              {processing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Process Payout (${payout.amount.toFixed(2)})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
