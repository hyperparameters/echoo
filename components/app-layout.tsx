"use client"

import { BottomNavigation } from "@/components/bottom-navigation"
import { usePathname } from "next/navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  // Determine current tab based on pathname
  const getCurrentTab = (): "home" | "events" | "collections" | "agent" | "settings" => {
    switch (pathname) {
      case "/home":
        return "home"
      case "/events":
        return "events"
      case "/collections":
        return "collections"
      case "/agent":
        return "agent"
      case "/settings":
        return "settings"
      default:
        return "home"
    }
  }

  return (
    <div className="min-h-screen">
      {/* Page Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentTab={getCurrentTab()} />
    </div>
  )
}