"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Monitor, Eye, Code, Palette, Zap } from "lucide-react"
import Link from "next/link"

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AuditX Preview Center</h1>
          <p className="text-xl text-gray-600 mb-6">Interactive previews of all mobile and desktop components</p>
          <Badge variant="outline" className="text-[#FC8019] border-[#FC8019] text-lg px-4 py-2">
            Live Preview Environment
          </Badge>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-0 auditx-shadow auditx-hover">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 auditx-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-sm text-gray-600">Touch-friendly interfaces designed for mobile devices</p>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Responsive Design</h3>
              <p className="text-sm text-gray-600">Seamlessly adapts to any screen size</p>
            </CardContent>
          </Card>

          <Card className="border-0 auditx-shadow auditx-hover">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-gray-600">Fully functional components with real interactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Cards */}
        <div className="space-y-6">
          <Card className="border-0 auditx-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-[#FC8019]" />
                    Mobile Payout Views
                  </CardTitle>
                  <CardDescription>Complete mobile experience for auditor earnings and payouts</CardDescription>
                </div>
                <Badge className="auditx-gradient text-white">New</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Features Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Earnings overview with visual progress</li>
                    <li>• Payout history with search & filters</li>
                    <li>• Payment settings management</li>
                    <li>• Detailed earnings breakdown</li>
                    <li>• Touch-optimized interactions</li>
                    <li>• Bottom navigation tabs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mobile Optimizations:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 44px minimum touch targets</li>
                    <li>• Swipe gestures support</li>
                    <li>• Pull-to-refresh functionality</li>
                    <li>• Optimized loading states</li>
                    <li>• Native app-like experience</li>
                    <li>• Accessibility compliant</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Link href="/preview/mobile-payouts">
                  <Button className="auditx-gradient hover:opacity-90 gap-2">
                    <Eye className="h-4 w-4" />
                    View Mobile Preview
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Code className="h-4 w-4" />
                  View Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 auditx-shadow opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Payout Analytics
                </CardTitle>
                <CardDescription>Advanced dashboards and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Interactive charts, trend analysis, and comparative analytics for auditor performance tracking.
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 auditx-shadow opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-600" />
                  Audit Checklist UI
                </CardTitle>
                <CardDescription>Interactive checklist components for mobile audits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Touch-optimized checklists with photo upload, progress tracking, and offline capabilities.
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="border-0 auditx-shadow mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How to Use Previews</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Click "View Mobile Preview" to see interactive mobile components</p>
                  <p>• Use the navigation panel to switch between different views</p>
                  <p>• Toggle between mobile and desktop modes to see responsive behavior</p>
                  <p>• All interactions are functional with mock data for demonstration</p>
                  <p>• Test touch gestures, scrolling, and form interactions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
