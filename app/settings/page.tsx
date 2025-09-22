import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsContent } from "@/components/settings-content"

interface SettingsPageProps {
  searchParams: Promise<{ guest?: string }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams
  const isGuest = params.guest === "true"

  let user = null
  let profile = null
  let personalization = null

  if (!isGuest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }

    user = data.user

    // Fetch user profile
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    profile = profileData

    // Fetch personalization data
    const { data: personalData } = await supabase.from("personalization").select("*").eq("user_id", user.id).single()

    personalization = personalData
  }

  return (
    <DashboardLayout>
      <SettingsContent user={user} profile={profile} personalization={personalization} isGuest={isGuest} />
    </DashboardLayout>
  )
}
