"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { BookOpen, HelpCircle, TrendingUp, Settings, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

function VLogo({ className }: { className?: string }) {
  return <div className={`flex items-center justify-center font-bold text-blue-600 ${className}`}>V</div>
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Quizzes", href: "/quizzes", icon: HelpCircle },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  isGuest?: boolean
}

export function Sidebar({ isGuest = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    if (isGuest) {
      router.push("/")
      return
    }

    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <VLogo className="h-8 w-8 text-2xl" />
        <span className="text-xl font-bold text-gray-900">Versora</span>
        {isGuest && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Guest</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={`${item.href}${isGuest ? "?guest=true" : ""}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-gray-700">
          <LogOut className="h-5 w-5 mr-3" />
          {isGuest ? "Exit Guest Mode" : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
