import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, ClipboardCheck, BarChart3, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 auditx-gradient rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AuditX</h1>
                <p className="text-xs text-gray-600">Transparent Business Auditing</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="auditx-gradient hover:opacity-90">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transparent Business Auditing
              <span className="block text-[#FC8019] mt-2">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect businesses, auditors, and suppliers in one comprehensive platform. Ensure quality, transparency,
              and efficiency in every audit.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild className="auditx-gradient hover:opacity-90 auditx-shadow">
                <Link href="/auth/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AuditX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform brings together all stakeholders in the auditing process for maximum transparency and
              efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="auditx-hover border-0 auditx-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 auditx-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Multi-Role Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Separate dashboards for admins, users, suppliers, and auditors with role-based access control.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="auditx-hover border-0 auditx-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Checklists</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  JSON-driven audit templates that adapt to different business categories and requirements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="auditx-hover border-0 auditx-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Monitor audit progress, supplier tasks, and payout information in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="auditx-hover border-0 auditx-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Built with security and transparency in mind, ensuring data integrity and user privacy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 auditx-gradient">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-orange-100">Businesses Audited</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-orange-100">Certified Auditors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-orange-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-orange-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of businesses and auditors using AuditX for their auditing needs.
            </p>
            <Button size="lg" asChild className="auditx-gradient hover:opacity-90 auditx-shadow">
              <Link href="/auth/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 auditx-gradient rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AuditX</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 AuditX. All rights reserved.</p>
            <p className="mt-2">Transparent Business Auditing Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
