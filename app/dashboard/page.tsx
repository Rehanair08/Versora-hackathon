import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Award,
  Play,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

interface DashboardPageProps {
  searchParams: Promise<{ guest?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const isGuest = params.guest === "true"

  let user = null
  let streakData = null
  let recentCourses = []
  let personalization = null

  if (!isGuest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }

    user = data.user

    // Fetch user streak data
    const { data: streak } = await supabase.from("streaks").select("*").eq("user_id", user.id).single()

    streakData = streak

    // Fetch recent courses
    const { data: courses } = await supabase
      .from("user_courses")
      .select(
        `
        *,
        courses (
          title,
          description,
          category,
          difficulty_level
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3)

    recentCourses = courses || []

    // Fetch personalization data
    const { data: personalData } = await supabase.from("personalization").select("*").eq("user_id", user.id).single()

    personalization = personalData
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isGuest
                ? "Welcome, Guest!"
                : `Welcome back${user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}!`}
            </h1>
            <p className="text-gray-600 mt-1">
              {isGuest ? "Explore courses and quizzes in guest mode" : "Continue your learning journey"}
            </p>
          </div>
          {!isGuest && !personalization && (
            <Link href="/personalization">
              <Button>Complete Setup</Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isGuest ? "0" : streakData?.current_streak || 0} days</div>
              <p className="text-xs text-muted-foreground">
                {isGuest ? "Sign up to track streaks" : "Keep learning daily!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isGuest ? "0" : recentCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {isGuest ? "Browse courses to get started" : "Active learning paths"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isGuest ? "0" : personalization?.time_commitment ? `${personalization.time_commitment * 7}` : "0"} min
              </div>
              <p className="text-xs text-muted-foreground">
                {isGuest ? "Set goals after signing up" : "This week's target"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isGuest ? "0" : "3"}</div>
              <p className="text-xs text-muted-foreground">{isGuest ? "Earn badges by learning" : "Badges earned"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Path */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Learning Path
                </CardTitle>
                <CardDescription>
                  {isGuest
                    ? "Sign up to get personalized course recommendations"
                    : "Recommended courses based on your preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGuest ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Create an account to get personalized recommendations</p>
                    <Link href="/auth/sign-up">
                      <Button>Sign Up Free</Button>
                    </Link>
                  </div>
                ) : recentCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recentCourses.map((userCourse: any) => (
                      <div key={userCourse.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{userCourse.courses.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{userCourse.courses.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{userCourse.courses.category}</Badge>
                            <Badge variant="outline">{userCourse.courses.difficulty_level}</Badge>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{userCourse.progress_percentage}%</span>
                            </div>
                            <Progress value={userCourse.progress_percentage} className="h-2" />
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    ))}
                    <Link href="/courses">
                      <Button variant="outline" className="w-full bg-transparent">
                        View All Courses
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Quiz */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Quiz
                </CardTitle>
                <CardDescription>Test your knowledge on any topic</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/quizzes${isGuest ? "?guest=true" : ""}`}>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Today's Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time spent learning</span>
                    <span className="font-medium">{isGuest ? "0" : "45"} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quizzes completed</span>
                    <span className="font-medium">{isGuest ? "0" : "2"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Courses accessed</span>
                    <span className="font-medium">{isGuest ? "0" : "1"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Reminder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Reminder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {isGuest
                    ? "Sign up to set personalized study reminders"
                    : `Daily goal: ${personalization?.time_commitment || 30} minutes`}
                </p>
                {!isGuest && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    Great job! You're on track for today.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
