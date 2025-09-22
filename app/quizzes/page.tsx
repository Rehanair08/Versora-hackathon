import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { QuizzesContent } from "@/components/quizzes-content"

interface QuizzesPageProps {
  searchParams: Promise<{ guest?: string }>
}

export default async function QuizzesPage({ searchParams }: QuizzesPageProps) {
  const params = await searchParams
  const isGuest = params.guest === "true"

  let user = null
  let recentQuizzes = []
  let userCourses = []

  if (!isGuest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }

    user = data.user

    // Fetch recent quizzes
    const { data: quizzesData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    recentQuizzes = quizzesData || []

    // Fetch user courses for course-based quizzes
    const { data: coursesData } = await supabase
      .from("user_courses")
      .select(
        `
        *,
        courses (
          id,
          title,
          category
        )
      `,
      )
      .eq("user_id", user.id)
      .gte("progress_percentage", 25) // Only courses with some progress

    userCourses = coursesData || []
  }

  return (
    <DashboardLayout>
      <QuizzesContent recentQuizzes={recentQuizzes} userCourses={userCourses} isGuest={isGuest} userId={user?.id} />
    </DashboardLayout>
  )
}
