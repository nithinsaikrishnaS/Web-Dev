"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { AuditXSidebar } from "./auditx-sidebar"
import { Loader2 } from "lucide-react"

interface AuditXDashboardLayoutProps {
  children: React.ReactNode
}

export function AuditXDashboardLayout({ children }: AuditXDashboardLayoutProps) {
  const { loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 auditx-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 auditx-shadow">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading AuditX...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-72 flex-shrink-0">
        <AuditXSidebar />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
