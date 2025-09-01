"use client"

import { ReactNode } from "react"
import { DashboardLayout } from "./dashboard-layout"

interface FullWidthLayoutProps {
  children: ReactNode
  userRole?: "admin" | "construtora" | "cliente"
  userName?: string
}

export function FullWidthLayout({ children, userRole = "admin", userName }: FullWidthLayoutProps) {
  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName} 
      fullWidth={true}
    >
      {children}
    </DashboardLayout>
  )
}
