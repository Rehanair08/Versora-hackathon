import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { QuizTaker } from "@/components/quiz-taker"

interface QuizTakePageProps {
  searchParams: Promise<{
    type?: string
    topic?: string
    courseId?: string
    difficulty?: string
    count?: string
    guest?: string
  }>
}

export default async function QuizTakePage({ searchParams }: QuizTakePageProps) {
  const params = await searchParams
  const isGuest = params.guest === "true"

  let user = null
  let courseTitle = ""

  if (!isGuest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }

    user = data.user

    // If it's a course quiz, get the course title
    if (params.type === "course" && params.courseId) {
      const { data: courseData } = await supabase.from("courses").select("title").eq("id", params.courseId).single()

      courseTitle = courseData?.title || ""
    }
  }

  if (!params.type || (!params.topic && !params.courseId)) {
    redirect(`/quizzes${isGuest ? "?guest=true" : ""}`)
  }

  return (
    <DashboardLayout>
      <QuizTaker
        type={params.type!}
        topic={params.topic}
        courseId={params.courseId}
        courseTitle={courseTitle}
        difficulty={params.difficulty || "intermediate"}
        questionCount={Number.parseInt(params.count || "5")}
        isGuest={isGuest}
        userId={user?.id}
      />
    </DashboardLayout>
  )
}
