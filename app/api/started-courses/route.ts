import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: startedCourses, error } = await supabase
      .from("user_courses")
      .select(`
        id,
        course_id,
        progress_percentage,
        started_at,
        courses (
          id,
          title,
          description,
          category,
          difficulty_level,
          provider
        )
      `)
      .eq("user_id", userId)
      .gt("progress_percentage", 0)
      .order("started_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching started courses:", error)
      return NextResponse.json({ error: "Failed to fetch started courses" }, { status: 500 })
    }

    return NextResponse.json({ startedCourses: startedCourses || [] })
  } catch (error) {
    console.error("[v0] Error in started courses API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
