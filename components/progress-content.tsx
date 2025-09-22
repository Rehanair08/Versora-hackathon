"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Flame,
  TrendingUp,
  BookOpen,
  Brain,
  Award,
  Calendar,
  Target,
  Clock,
  CheckCircle,
  Play,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface StreakData {
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
}

interface UserCourse {
  id: string
  course_id: string
  progress_percentage: number
  started_at: string
  completed_at: string | null
  courses: {
    title: string
    category: string
    difficulty_level: string
    duration_hours: number
  }
}

interface Quiz {
  id: string
  title: string
  type: string
  score: number | null
  total_questions: number
  completed_at: string | null
  created_at: string
}

interface Achievement {
  id: string
  achievement_type: string
  achievement_name: string
  description: string
  earned_at: string
  metadata: any
}

interface Personalization {
  subjects: string[]
  skill_level: string
  goals: string[]
  time_commitment: number
}

interface ProgressContentProps {
  streakData: StreakData | null
  userCourses: UserCourse[]
  quizzes: Quiz[]
  achievements: Achievement[]
  personalization: Personalization | null
  isGuest: boolean
}

export function ProgressContent({
  streakData,
  userCourses,
  quizzes,
  achievements,
  personalization,
  isGuest,
}: ProgressContentProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    if (isGuest) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalQuizzes: 0,
        averageQuizScore: 0,
        totalStudyTime: 0,
        skillGrowth: 0,
      }
    }

    const completedCourses = userCourses.filter((course) => course.completed_at).length
    const completedQuizzes = quizzes.filter((quiz) => quiz.completed_at).length
    const averageScore =
      completedQuizzes > 0
        ? quizzes.filter((q) => q.score !== null).reduce((acc, q) => acc + (q.score! / q.total_questions) * 100, 0) /
          completedQuizzes
        : 0

    const totalStudyTime = userCourses.reduce((acc, course) => {
      const progress = course.progress_percentage / 100
      return acc + course.courses.duration_hours * progress
    }, 0)

    return {
      totalCourses: userCourses.length,
      completedCourses,
      totalQuizzes: completedQuizzes,
      averageQuizScore: Math.round(averageScore),
      totalStudyTime: Math.round(totalStudyTime),
      skillGrowth: Math.min(100, completedCourses * 20 + completedQuizzes * 5),
    }
  }, [userCourses, quizzes, isGuest])

  const quizScoresData = useMemo(() => {
    if (isGuest) return []

    return quizzes
      .filter((quiz) => quiz.completed_at && quiz.score !== null)
      .sort((a, b) => new Date(a.completed_at!).getTime() - new Date(b.completed_at!).getTime())
      .map((quiz, index) => ({
        quiz: `Quiz ${index + 1}`,
        score: Math.round((quiz.score! / quiz.total_questions) * 100),
        title: quiz.title.length > 20 ? quiz.title.substring(0, 20) + "..." : quiz.title,
        date: new Date(quiz.completed_at!).toLocaleDateString(),
      }))
      .slice(-10) // Show last 10 quizzes
  }, [quizzes, isGuest])

  const enrolledCourses = useMemo(() => {
    return userCourses.filter((course) => course.started_at && !course.completed_at)
  }, [userCourses])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isGuest) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Progress</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up to unlock detailed progress tracking, streak monitoring, achievement badges, and personalized
            learning analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-600 mt-1">Track your learning journey and celebrate your achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streakData?.current_streak || 0} days</div>
            <p className="text-xs text-muted-foreground">Longest: {streakData?.longest_streak || 0} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedCourses}/{stats.totalCourses}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCourses > 0 ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageQuizScore}%</div>
            <p className="text-xs text-muted-foreground">{stats.totalQuizzes} quizzes taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudyTime}h</div>
            <p className="text-xs text-muted-foreground">Total learning time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Progress
              </CardTitle>
              <CardDescription>Your progress across all enrolled courses</CardDescription>
            </CardHeader>
            <CardContent>
              {userCourses.length > 0 ? (
                <div className="space-y-4">
                  {userCourses.map((userCourse) => (
                    <div key={userCourse.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{userCourse.courses.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{userCourse.courses.category}</Badge>
                            <Badge variant="outline">{userCourse.courses.difficulty_level}</Badge>
                            {userCourse.completed_at && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{userCourse.progress_percentage}%</div>
                          <div className="text-xs text-gray-500">{userCourse.courses.duration_hours}h total</div>
                        </div>
                      </div>
                      <Progress value={userCourse.progress_percentage} className="h-2" />
                    </div>
                  ))}
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

        {/* Achievements & Streak */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Continue Learning
              </CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.slice(0, 3).map((userCourse) => (
                    <div key={userCourse.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{userCourse.courses.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {userCourse.courses.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {userCourse.courses.difficulty_level}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{userCourse.progress_percentage}% complete</span>
                        <span>{userCourse.courses.duration_hours}h total</span>
                      </div>
                      <Progress value={userCourse.progress_percentage} className="h-1 mb-2" />
                      <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                        Continue Course
                      </Button>
                    </div>
                  ))}
                  {enrolledCourses.length > 3 && (
                    <Link href="/courses">
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View All Enrolled Courses
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">No enrolled courses</p>
                  <Link href="/courses">
                    <Button size="sm">Browse Courses</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>Badges you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-2xl">{achievement.metadata.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.achievement_name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.earned_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Skill Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium">{stats.skillGrowth}%</span>
                  </div>
                  <Progress value={stats.skillGrowth} className="h-2" />
                </div>

                {personalization?.subjects && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {personalization.subjects.slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Learning goal</span>
                    <span className="font-medium">{personalization?.time_commitment || 30} min/day</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Days active</span>
                  <span className="font-medium">5/7</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quizzes completed</span>
                  <span className="font-medium">{quizzes.filter((q) => q.completed_at).length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Study time</span>
                  <span className="font-medium">{Math.round(stats.totalStudyTime * 0.3)}h</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Target className="h-4 w-4" />
                    <span>On track for weekly goal!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {quizScoresData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Quiz Performance Trends
            </CardTitle>
            <CardDescription>Your quiz scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" fontSize={12} tick={{ fill: "#666" }} />
                  <YAxis
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fill: "#666" }}
                    label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.title}</p>
                            <p className="text-sm text-gray-600">{data.date}</p>
                            <p className="text-lg font-bold text-purple-600">{data.score}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {quizScoresData.filter((q) => q.score >= 80).length}
                </div>
                <div className="text-xs text-gray-500">High Scores (80%+)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(quizScoresData.reduce((acc, q) => acc + q.score, 0) / quizScoresData.length)}%
                </div>
                <div className="text-xs text-gray-500">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...quizScoresData.map((q) => q.score))}%
                </div>
                <div className="text-xs text-gray-500">Best Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Quiz Performance */}
      {quizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recent Quiz Performance
            </CardTitle>
            <CardDescription>Your latest quiz results and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quizzes
                .filter((quiz) => quiz.completed_at)
                .slice(0, 4)
                .map((quiz) => {
                  const score = quiz.score || 0
                  const percentage = Math.round((score / quiz.total_questions) * 100)
                  const getScoreColor = () => {
                    if (percentage >= 80) return "text-green-600"
                    if (percentage >= 60) return "text-yellow-600"
                    return "text-red-600"
                  }

                  return (
                    <div key={quiz.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">{quiz.title}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {quiz.type}
                        </Badge>
                        <span className={`text-lg font-bold ${getScoreColor()}`}>{percentage}%</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {score}/{quiz.total_questions} correct
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(quiz.created_at)}</div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
