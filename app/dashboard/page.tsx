"use client"

import { useAuth } from "@/lib/auth"
import { AuditXDashboardLayout } from "@/components/layout/auditx-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
} from "lucide-react"

export default function AuditXDashboardPage() {
  const { profile } = useAuth()

  const getDashboardContent = () => {
    switch (profile?.role) {
      case "admin":
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 auditx-shadow auditx-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Businesses</CardTitle>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">1,234</div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">+20.1%</span>
                    <span className="text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 auditx-shadow auditx-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">2,350</div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">+180.1%</span>
                    <span className="text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 auditx-shadow auditx-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Audits</CardTitle>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">573</div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">+19%</span>
                    <span className="text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 auditx-shadow auditx-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Payouts</CardTitle>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">$45,231.89</div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">+20.1%</span>
                    <span className="text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Audits
                    <Button size="sm" variant="outline">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { business: "Pizza Palace", auditor: "John Doe", status: "completed", time: "2 hours ago" },
                    { business: "Tech Store", auditor: "Jane Smith", status: "in_progress", time: "4 hours ago" },
                    { business: "Coffee Shop", auditor: "Mike Johnson", status: "pending", time: "6 hours ago" },
                  ].map((audit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{audit.business}</p>
                        <p className="text-sm text-gray-600">Auditor: {audit.auditor}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            audit.status === "completed"
                              ? "success"
                              : audit.status === "in_progress"
                                ? "pending"
                                : "secondary"
                          }
                        >
                          {audit.status.replace("_", " ")}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{audit.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your platform efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start auditx-gradient hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Business
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Auditors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Create Audit Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payouts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "user":
        return (
          <div className="space-y-8">
            <Card className="border-0 auditx-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to AuditX</CardTitle>
                <CardDescription>Discover and track businesses in {profile.city}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Local Businesses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-gray-600">Audited This Month</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">23</div>
                    <div className="text-sm text-gray-600">Pending Audits</div>
                  </div>
                </div>
                <Button className="mt-6 auditx-gradient hover:opacity-90">
                  Explore Local Businesses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "supplier":
        return (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Active Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <Badge variant="pending" className="mt-2">
                    In Progress
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <Badge variant="success" className="mt-2">
                    Delivered
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">94%</div>
                  <Badge variant="success" className="mt-2">
                    Excellent
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "auditor":
        return (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <Badge variant="warning" className="mt-2">
                    Due Soon
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">45</div>
                  <Badge variant="success" className="mt-2">
                    This Month
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">$2,450</div>
                  <Badge variant="success" className="mt-2">
                    +15%
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-0 auditx-shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <Badge variant="default" className="mt-2">
                    ⭐ Excellent
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return <div>Loading...</div>
    }
  }

  return (
    <AuditXDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, {profile?.full_name?.split(" ")[0]}! 👋</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your {profile?.role} account today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {profile?.role} Account
            </Badge>
          </div>
        </div>

        {/* Dashboard Content */}
        {getDashboardContent()}
      </div>
    </AuditXDashboardLayout>
  )
}
