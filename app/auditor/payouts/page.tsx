"use client"

import { AuditXDashboardLayout } from "@/components/layout/auditx-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Download,
  Eye,
  CreditCard,
  Wallet,
  Target,
  Award,
  RefreshCw,
} from "lucide-react"
import { useAuditorEarnings } from "@/lib/hooks/use-auditor-data"
import { MobileDetector } from "@/components/mobile/mobile-detector"
import MobilePayoutsPage from "./mobile/page"

export default function AuditorPayoutsPage() {
  return <MobileDetector mobileComponent={MobilePayoutsPage} desktopComponent={DesktopPayoutsPage} />
}

// Rename the existing component to DesktopPayoutsPage
function DesktopPayoutsPage() {
  const { summary, payouts, earnings, bankAccount, settings, loading, error, refreshData } = useAuditorEarnings()

  // ... rest of the existing desktop component code
  if (loading) {
    return (
      <AuditXDashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 auditx-shadow">
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AuditXDashboardLayout>
    )
  }

  if (error) {
    return (
      <AuditXDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading earnings data: {error}</p>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </AuditXDashboardLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "success"
      case "pending":
      case "processing":
        return "warning"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const goalProgress = settings?.monthly_goal
    ? ((summary?.current_month_earnings || 0) / settings.monthly_goal) * 100
    : 0

  return (
    <AuditXDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings & Payouts</h1>
            <p className="text-gray-600 mt-1">Track your audit earnings and payout history</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="auditx-gradient hover:opacity-90 gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Settings
            </Button>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
              <div className="w-8 h-8 auditx-gradient rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${summary?.total_earnings?.toFixed(2) || "0.00"}</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Payouts</CardTitle>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${summary?.pending_earnings?.toFixed(2) || "0.00"}</div>
              <p className="text-sm text-gray-500 mt-1">Processing in 2-3 days</p>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Audits</CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{summary?.current_month_audits || 0}</div>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg per Audit</CardTitle>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                $
                {summary?.current_month_audits && summary.current_month_audits > 0
                  ? (summary.current_month_earnings / summary.current_month_audits).toFixed(2)
                  : "0.00"}
              </div>
              <p className="text-sm text-gray-500 mt-1">Above average</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Goal Progress */}
        {settings?.monthly_goal && settings.monthly_goal > 0 && (
          <Card className="border-0 auditx-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#FC8019]" />
                    Monthly Goal Progress
                  </CardTitle>
                  <CardDescription>Track your progress towards your monthly earning goal</CardDescription>
                </div>
                <Badge variant="outline" className="text-[#FC8019] border-[#FC8019]">
                  {goalProgress.toFixed(1)}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Current: ${summary?.current_month_earnings?.toFixed(2) || "0.00"}
                  </span>
                  <span className="text-gray-600">Goal: ${settings.monthly_goal.toFixed(2)}</span>
                </div>
                <Progress value={Math.min(goalProgress, 100)} className="h-3" />
                <p className="text-sm text-gray-500">
                  ${Math.max(0, settings.monthly_goal - (summary?.current_month_earnings || 0)).toFixed(2)} remaining to
                  reach your goal
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Tables */}
        <Tabs defaultValue="payouts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
            <TabsTrigger value="audits">Audit Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="payouts" className="space-y-6">
            <Card className="border-0 auditx-shadow">
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Your payment history and transaction details</CardDescription>
              </CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payouts yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payout ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Audits</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium">{payout.id.slice(0, 8)}...</TableCell>
                          <TableCell>{new Date(payout.submitted_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                          <TableCell>{payout.audits_count} audits</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-gray-400" />
                              {payout.method.replace("_", " ")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(payout.status)} className="capitalize">
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card className="border-0 auditx-shadow">
              <CardHeader>
                <CardTitle>Audit Earnings</CardTitle>
                <CardDescription>Individual audit payments and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                {earnings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No completed audits yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earnings.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {audit.audit_tasks?.businesses?.name || "Unknown Business"}
                              </div>
                              <div className="text-sm text-gray-500">{audit.audit_tasks?.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {audit.audit_tasks?.businesses?.categories?.name || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(audit.submitted_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold">
                            ${audit.audit_tasks?.payout_amount?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-medium">{audit.submission_data?.overall_rating || "N/A"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusColor(audit.is_approved ? "paid" : "pending")}
                              className="capitalize"
                            >
                              {audit.is_approved ? "Paid" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Settings Card */}
        <Card className="border-0 auditx-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#FC8019]" />
              Payment Information
            </CardTitle>
            <CardDescription>Manage your payout preferences and bank details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Bank Account</h3>
                    <p className="text-sm text-gray-500">Primary payout method</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{bankAccount?.bank_name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-medium">
                      {bankAccount?.account_last_four ? `****${bankAccount.account_last_four}` : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={bankAccount?.is_verified ? "success" : "secondary"} className="text-xs">
                      {bankAccount?.is_verified ? "Verified" : "Not verified"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Payout Schedule</h3>
                    <p className="text-sm text-gray-500">Automatic payments</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium capitalize">{settings?.payout_frequency || "Weekly"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Payout:</span>
                    <span className="font-medium">Feb 5, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-medium">${settings?.minimum_payout_amount?.toFixed(2) || "100.00"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline">Update Bank Details</Button>
              <Button variant="outline">Change Schedule</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuditXDashboardLayout>
  )
}
