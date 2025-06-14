import { LayoutDashboard, Users, FileText, Wallet, Settings, BarChart3, TrendingUp } from "lucide-react"

import type { MainNavItem, SidebarNavItem } from "@/types"

interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["admin"],
    },
    {
      title: "Auditors",
      href: "/admin/auditors",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Clients",
      href: "/admin/clients",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Payouts",
      href: "/admin/payouts",
      icon: Wallet,
      roles: ["admin"],
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: TrendingUp,
      roles: ["admin"],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["admin"],
    },
    {
      title: "Dashboard",
      href: "/auditor",
      icon: LayoutDashboard,
      roles: ["auditor"],
    },
    {
      title: "Assignments",
      href: "/auditor/assignments",
      icon: FileText,
      roles: ["auditor"],
    },
    {
      title: "Payouts",
      href: "/auditor/payouts",
      icon: Wallet,
      roles: ["auditor"],
    },
    {
      title: "Analytics",
      href: "/auditor/analytics",
      icon: BarChart3,
      roles: ["auditor"],
    },
    {
      title: "Settings",
      href: "/auditor/settings",
      icon: Settings,
      roles: ["auditor"],
    },
  ],
}
