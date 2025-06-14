"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Users, ClipboardList, Settings, BarChart3, Package, UserCheck, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()

  const getMenuItems = () => {
    const baseItems = [{ href: "/dashboard", label: "Dashboard", icon: BarChart3 }]

    switch (profile?.role) {
      case "admin":
        return [
          ...baseItems,
          { href: "/admin/businesses", label: "Businesses", icon: Building2 },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/categories", label: "Categories", icon: Package },
          { href: "/admin/templates", label: "Templates", icon: ClipboardList },
          { href: "/admin/auditors", label: "Auditors", icon: UserCheck },
          { href: "/admin/suppliers", label: "Suppliers", icon: Package },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ]
      case "user":
        return [...baseItems, { href: "/user/businesses", label: "Businesses", icon: Building2 }]
      case "supplier":
        return [...baseItems, { href: "/supplier/tasks", label: "Tasks", icon: ClipboardList }]
      case "auditor":
        return [
          ...baseItems,
          { href: "/auditor/tasks", label: "Audit Tasks", icon: ClipboardList },
          { href: "/auditor/submissions", label: "Submissions", icon: Package },
        ]
      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 border-r", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">AuditPro</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)} Portal
        </p>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium">{profile?.full_name}</p>
          <p className="text-xs text-gray-600">{profile?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
