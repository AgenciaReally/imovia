"use client"

import { ReactNode } from "react"
import { Topbar } from "./topbar"
import { LeftBar } from "./leftbar"
import { useSidebar } from "@/contexts/sidebar-context"

interface DashboardLayoutProps {
  children: ReactNode
  userRole?: "admin" | "construtora" | "cliente"
  userName?: string
  fullWidth?: boolean
}

export function DashboardLayout({ children, userRole = "admin", userName, fullWidth = true }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="min-h-screen bg-background">
      <Topbar 
        userRole={userRole}
        userName={userName}
      />
      
      <LeftBar 
        userRole={userRole}
        userName={userName}
      />
      
      <main className={`pt-20 pb-8 transition-all duration-300 ${isCollapsed ? 'pl-[70px]' : 'pl-[70px] md:pl-[260px]'}`}>
        <div className={fullWidth ? 'w-full px-4' : 'px-4 md:px-6 max-w-7xl mx-auto'}>
          {children}
        </div>
      </main>
    </div>
  )
}
