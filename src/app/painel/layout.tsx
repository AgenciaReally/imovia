"use client"

import { ReactNode } from "react"
import { SidebarProvider } from "@/contexts/sidebar-context"

interface PainelLayoutProps {
  children: ReactNode
}

export default function PainelLayout({ children }: PainelLayoutProps) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
