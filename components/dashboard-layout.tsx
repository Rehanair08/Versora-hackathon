"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { useSearchParams } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const searchParams = useSearchParams()
  const isGuest = searchParams.get("guest") === "true"

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isGuest={isGuest} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
