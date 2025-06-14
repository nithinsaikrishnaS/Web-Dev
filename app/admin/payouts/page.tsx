"use client"

import { useState } from "react"
import { AuditXDashboardLayout } from "@/components/layout/auditx-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  CreditCard,
  RefreshCw,
  UserCheck,
  Building2,
} from "lucide-react"
import { useAdminPayouts } from "@/lib/hooks/use-admin-payouts"
import { toast } from "sonner"

export default function AdminPayoutsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([])
  const [processingPayouts, setProcessingPayouts] = useState<string[]>([])

  const { pendingPayouts, allPayouts, stats, loading, error, processPayout, processBulkPayouts, refreshData } =
    useAdminPayouts()

  const handleSelectPayout = (payoutId: string) => {
    setSelectedPayouts((prev) => (prev.includes(payoutId) ? prev.filter((id) => id !== payoutId) : [...prev, payoutId]))
  }

  const handleBulkProcess = async () => {
    if (selectedPayouts.length === 0) return

    setProcessingPayouts(selectedPayouts)
    try {
      const success = await processBulkPayouts(selectedPayouts)
      if (success) {
        toast.success(`Successfully processed ${selectedPayouts.length} payouts`)
        setSelectedPayouts([])
      } else {
        toast.error("Failed to process some payouts")
      }
    } catch (error) {
      toast.error("Error processing payouts")
    } finally {
      setProcessingPayouts([])
    }
  }

  const handleProcessSingle = async (
    payoutId: string,
    status: "processing" | "completed" | "failed",
    transactionId?: string,
    adminNotes?: string,
  ) => {
    setProcessingPayouts([payoutId])
    try {
      const success = await processPayout(payoutId, status, transactionId, adminNotes)
      if (success) {
        toast.success(`Payout ${status} successfully`)
      } else {
        toast.error("Failed to update payout")
      }
    } catch (error) {
      toast.error("Error updating payout")
    } finally {
      setProcessingPayouts([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "processing":
        return "pending"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredPendingPayouts = pendingPayouts.filter((payout) => {
    const matchesSearch =
      searchTerm === "" ||
      payout.auditor?.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.auditor?.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payout.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
            <p className="text-red-600 mb-4">Error loading payout data: {error}</p>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </AuditXDashboardLayout>
    )
  }

  return (
    <AuditXDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
            <p className="text-gray-600 mt-1">Manage auditor payments and earnings</p>
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
            <Button
              className="auditx-gradient hover:opacity-90 gap-2"
              onClick={handleBulkProcess}
              disabled={selectedPayouts.length === 0 || processingPayouts.length > 0}
            >
              <Send className="h-4 w-4" />
              Process Selected ({selectedPayouts.length})
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Payouts</CardTitle>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats?.totalPending?.toFixed(2) || "0.00"}</div>
              <p className="text-sm text-gray-500 mt-1">{stats?.pendingCount || 0} auditors waiting</p>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Processed This Month</CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats?.totalCompleted?.toFixed(2) || "0.00"}</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600">+18.2%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Payout</CardTitle>
              <div className="w-8 h-8 auditx-gradient rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats?.averagePayout?.toFixed(2) || "0.00"}</div>
              <p className="text-sm text-gray-500 mt-1">Per auditor</p>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Earner</CardTitle>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">{stats?.topEarners?.[0]?.full_name || "N/A"}</div>
              <p className="text-sm text-gray-500 mt-1">
                ${stats?.topEarners?.[0]?.current_month_earnings?.toFixed(2) || "0"} this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
            <TabsTrigger value="history">Payout History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {/* Filters */}
            <Card className="border-0 auditx-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search auditors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payouts Table */}
            <Card className="border-0 auditx-shadow">
              <CardHeader>
                <CardTitle>Pending Payouts</CardTitle>
                <CardDescription>Review and process auditor payments</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPendingPayouts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No pending payouts found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPayouts(filteredPendingPayouts.map((p) => p.id))
                              } else {
                                setSelectedPayouts([])
                              }
                            }}
                            className="rounded"
                          />
                        </TableHead>
                        <TableHead>Auditor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Audits</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Bank Account</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingPayouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedPayouts.includes(payout.id)}
                              onChange={() => handleSelectPayout(payout.id)}
                              className="rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payout.auditor?.users?.full_name || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{payout.auditor?.users?.email}</div>
                              <div className="text-xs text-gray-400">{payout.auditor?.users?.city}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-lg">${payout.amount.toFixed(2)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payout.audits_count} audits</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-medium">{payout.auditor?.rating || "N/A"}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(payout.submitted_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              {payout.bank_account_last_four ? `****${payout.bank_account_last_four}` : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Eye className="h-3 w-3" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Payout Review - {payout.auditor?.users?.full_name}</DialogTitle>
                                    <DialogDescription>Review auditor details and approve payout</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Auditor Information</Label>
                                        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                                          <p className="font-medium">{payout.auditor?.users?.full_name}</p>
                                          <p className="text-sm text-gray-600">{payout.auditor?.users?.email}</p>
                                          <p className="text-sm text-gray-600">{payout.auditor?.users?.city}</p>
                                          <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="text-sm">{payout.auditor?.rating} rating</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Payout Details</Label>
                                        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                                          <p className="text-lg font-semibold">${payout.amount.toFixed(2)}</p>
                                          <p className="text-sm text-gray-600">
                                            {payout.audits_count} completed audits
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            Bank:{" "}
                                            {payout.bank_account_last_four
                                              ? `****${payout.bank_account_last_four}`
                                              : "N/A"}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            Submitted: {new Date(payout.submitted_at).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="notes">Admin Notes (Optional)</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Add any notes about this payout..."
                                        className="min-h-[80px]"
                                      />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handleProcessSingle(payout.id, "failed", undefined, "Rejected by admin")
                                        }
                                        disabled={processingPayouts.includes(payout.id)}
                                      >
                                        Reject
                                      </Button>
                                      <Button
                                        className="auditx-gradient hover:opacity-90"
                                        onClick={() => handleProcessSingle(payout.id, "processing")}
                                        disabled={processingPayouts.includes(payout.id)}
                                      >
                                        Approve & Process
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                className="auditx-gradient hover:opacity-90 gap-1"
                                onClick={() => handleProcessSingle(payout.id, "processing")}
                                disabled={processingPayouts.includes(payout.id)}
                              >
                                <Send className="h-3 w-3" />
                                {processingPayouts.includes(payout.id) ? "Processing..." : "Process"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-0 auditx-shadow">
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Previously processed payments and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {allPayouts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payout history found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payout ID</TableHead>
                        <TableHead>Auditor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Audits</TableHead>
                        <TableHead>Processed Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPayouts.slice(0, 20).map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium">{payout.id.slice(0, 8)}...</TableCell>
                          <TableCell>{payout.auditor?.users?.full_name || "Unknown"}</TableCell>
                          <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                          <TableCell>{payout.audits_count} audits</TableCell>
                          <TableCell>
                            {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(payout.status)} className="capitalize">
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{payout.transaction_id || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                              {payout.status === "failed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => handleProcessSingle(payout.id, "processing")}
                                  disabled={processingPayouts.includes(payout.id)}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Retry
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Performers */}
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-[#FC8019]" />
                    Top Performing Auditors
                  </CardTitle>
                  <CardDescription>Highest earning auditors this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topEarners?.slice(0, 4).map((performer, index) => (
                      <div
                        key={performer.auditor_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FC8019] text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{performer.full_name}</p>
                            <p className="text-sm text-gray-600">{performer.city}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${performer.current_month_earnings?.toFixed(2) || "0.00"}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{performer.current_month_audits} audits</span>
                            <span>⭐ {performer.average_rating?.toFixed(1) || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No performance data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payout Summary */}
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#FC8019]" />
                    Payout Summary
                  </CardTitle>
                  <CardDescription>Monthly payout breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Completed Payouts</p>
                        <p className="text-sm text-green-600">{stats?.completedCount || 0} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-800">
                          ${stats?.totalCompleted?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Pending Payouts</p>
                        <p className="text-sm text-yellow-600">{stats?.pendingCount || 0} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-800">
                          ${stats?.totalPending?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Average Payout</p>
                        <p className="text-sm text-blue-600">Per auditor</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-800">${stats?.averagePayout?.toFixed(2) || "0.00"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuditXDashboardLayout>
  )
}
