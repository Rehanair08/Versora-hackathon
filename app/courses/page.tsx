import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CoursesContent } from "@/components/courses-content"

interface CoursesPageProps {
  searchParams: Promise<{ guest?: string }>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams
  const isGuest = params.guest === "true"

  let user = null
  let courses = []
  let userCourses = []
  let personalization = null

  if (!isGuest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }

    user = data.user

    // Fetch user courses for bookmarking status
    const { data: userCoursesData } = await supabase.from("user_courses").select("*").eq("user_id", user.id)

    userCourses = userCoursesData || []

    // Fetch personalization for recommendations
    const { data: personalData } = await supabase.from("personalization").select("*").eq("user_id", user.id).single()

    personalization = personalData
  }

  // Fetch all courses
  const supabase = await createClient()
  const { data: coursesData } = await supabase.from("courses").select("*").order("rating", { ascending: false })

  courses = coursesData || []

  return (
    <DashboardLayout>
      <CoursesContent
        courses={courses}
        userCourses={userCourses}
        personalization={personalization}
        isGuest={isGuest}
        userId={user?.id}
      />
    </DashboardLayout>
  )
}
