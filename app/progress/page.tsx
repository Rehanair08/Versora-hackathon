import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProgressContent } from "@/components/progress-content"

interface ProgressPageProps {
  searchParams: Promise<{ guest?: string }>
}

export default async function ProgressPage({ searchParams }: ProgressPageProps) {
  const params = await searchParams
  const isGuest = params.guest === "true"

  let user = null
  let streakData = null
  let userCourses = []
  let quizzes = []
  let achievements = []
  let personalization = null

  if (!isGuest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }

    user = data.user

    // Fetch streak data
    const { data: streak } = await supabase.from("streaks").select("*").eq("user_id", user.id).single()

    streakData = streak

    // Fetch user courses with progress
    const { data: coursesData } = await supabase
      .from("user_courses")
      .select(
        `
        *,
        courses (
          title,
          category,
          difficulty_level,
          duration_hours
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    userCourses = coursesData || []

    // Fetch quiz history
    const { data: quizzesData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    quizzes = quizzesData || []

    // Fetch achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })

    achievements = achievementsData || []

    // Fetch personalization data
    const { data: personalData } = await supabase.from("personalization").select("*").eq("user_id", user.id).single()

    personalization = personalData
  }

  return (
    <DashboardLayout>
      <ProgressContent
        streakData={streakData}
        userCourses={userCourses}
        quizzes={quizzes}
        achievements={achievements}
        personalization={personalization}
        isGuest={isGuest}
      />
    </DashboardLayout>
  )
}
