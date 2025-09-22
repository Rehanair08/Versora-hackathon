"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Brain, BookOpen, Play, Clock, Target, MessageSquare, CheckCircle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface Quiz {
  id: string
  title: string
  type: string
  score: number | null
  total_questions: number
  completed_at: string | null
  created_at: string
}

interface UserCourse {
  id: string
  course_id: string
  progress_percentage: number
  courses: {
    id: string
    title: string
    category: string
  }
}

interface StartedCourse {
  id: string
  course_id: string
  progress_percentage: number
  started_at: string
  courses: {
    id: string
    title: string
    description: string
    category: string
    difficulty_level: string
    provider: string
  }
}

interface QuizzesContentProps {
  recentQuizzes: Quiz[]
  userCourses: UserCourse[]
  isGuest: boolean
  userId?: string
}

export function QuizzesContent({ recentQuizzes, userCourses, isGuest, userId }: QuizzesContentProps) {
  const [activeTab, setActiveTab] = useState<"general" | "course">("general")
  const [customTopic, setCustomTopic] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [questionCount, setQuestionCount] = useState("5")
  const [customQuestionCount, setCustomQuestionCount] = useState("")
  const [startedCourses, setStartedCourses] = useState<StartedCourse[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)

  const fetchStartedCourses = async () => {
    if (isGuest || !userId) return

    setIsLoadingCourses(true)
    try {
      const response = await fetch(`/api/started-courses?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setStartedCourses(data.startedCourses || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching started courses:", error)
    } finally {
      setIsLoadingCourses(false)
    }
  }

  useEffect(() => {
    if (activeTab === "course") {
      fetchStartedCourses()
    }
  }, [activeTab, userId, isGuest])

  const handleStartGeneralQuiz = () => {
    if (!customTopic.trim()) return

    const params = new URLSearchParams({
      type: "general",
      topic: customTopic,
      difficulty,
      count: questionCount,
      ...(isGuest && { guest: "true" }),
    })

    window.location.href = `/quizzes/take?${params.toString()}`
  }

  const handleStartCourseQuiz = () => {
    if (!selectedCourse) return

    const params = new URLSearchParams({
      type: "course",
      courseId: selectedCourse,
      difficulty,
      count: questionCount,
      ...(isGuest && { guest: "true" }),
    })

    window.location.href = `/quizzes/take?${params.toString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-600 mt-1">
          {isGuest
            ? "Test your knowledge with AI-powered quizzes on any topic"
            : "Challenge yourself with personalized quizzes and track your progress"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Creation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Create New Quiz
              </CardTitle>
              <CardDescription>
                Generate AI-powered quizzes on absolutely any topic - from programming to history, science to arts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tab Selection */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={activeTab === "general" ? "default" : "outline"}
                  onClick={() => setActiveTab("general")}
                  className={activeTab === "general" ? "" : "bg-transparent"}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Quiz on Anything
                </Button>
                <Button
                  variant={activeTab === "course" ? "default" : "outline"}
                  onClick={() => setActiveTab("course")}
                  disabled={isGuest}
                  className={activeTab === "course" ? "" : "bg-transparent"}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Quiz on Courses
                  {isGuest && <span className="ml-2 text-xs">(Sign up required)</span>}
                </Button>
              </div>

              {/* General Quiz Form */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">What topic would you like to be quizzed on?</Label>
                    <Textarea
                      id="topic"
                      placeholder="Type anything! Examples: JavaScript arrays, Ancient Rome, Quantum physics, Cooking techniques, Art history, Music theory, Business strategy, Psychology concepts..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      💡 Be specific for better questions! Instead of "programming", try "React hooks" or "Python data
                      structures"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner - Basic concepts</SelectItem>
                          <SelectItem value="intermediate">Intermediate - Practical application</SelectItem>
                          <SelectItem value="advanced">Advanced - Expert level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="count">Number of Questions</Label>
                      <Select
                        value={questionCount}
                        onValueChange={(value) => {
                          setQuestionCount(value)
                          if (value !== "custom") {
                            setCustomQuestionCount("")
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Questions</SelectItem>
                          <SelectItem value="10">10 Questions</SelectItem>
                          <SelectItem value="15">15 Questions</SelectItem>
                          <SelectItem value="20">20 Questions</SelectItem>
                          <SelectItem value="25">25 Questions</SelectItem>
                          <SelectItem value="custom">Custom Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {questionCount === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customCount">Custom Number of Questions</Label>
                      <Input
                        id="customCount"
                        type="number"
                        min="1"
                        max="50"
                        placeholder="Enter number (1-50)"
                        value={customQuestionCount}
                        onChange={(e) => setCustomQuestionCount(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Maximum 50 questions. More questions = longer generation time.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      const finalQuestionCount = questionCount === "custom" ? customQuestionCount : questionCount
                      const params = new URLSearchParams({
                        type: "general",
                        topic: customTopic,
                        difficulty,
                        count: finalQuestionCount,
                        ...(isGuest && { guest: "true" }),
                      })
                      window.location.href = `/quizzes/take?${params.toString()}`
                    }}
                    disabled={
                      !customTopic.trim() ||
                      (questionCount === "custom" &&
                        (!customQuestionCount ||
                          Number.parseInt(customQuestionCount) < 1 ||
                          Number.parseInt(customQuestionCount) > 50))
                    }
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Generate {questionCount === "custom" ? customQuestionCount || "Custom" : questionCount} Question
                    Quiz
                  </Button>
                </div>
              )}

              {/* Course Quiz Form */}
              {activeTab === "course" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Quiz on Your Started Courses</h3>
                    <Button variant="outline" size="sm" onClick={fetchStartedCourses} disabled={isLoadingCourses}>
                      {isLoadingCourses ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  {startedCourses.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="course">Select a Started Course</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a course you've started" />
                          </SelectTrigger>
                          <SelectContent>
                            {startedCourses.map((startedCourse) => (
                              <SelectItem key={startedCourse.course_id} value={startedCourse.course_id}>
                                <div className="flex flex-col">
                                  <span>{startedCourse.courses.title}</span>
                                  <span className="text-xs text-gray-500">
                                    {startedCourse.courses.category} • {startedCourse.courses.difficulty_level} •{" "}
                                    {startedCourse.progress_percentage}% complete
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Only courses you've started are available for quizzes</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty Level</Label>
                          <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner - Basic concepts</SelectItem>
                              <SelectItem value="intermediate">Intermediate - Practical application</SelectItem>
                              <SelectItem value="advanced">Advanced - Expert level</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="count">Number of Questions</Label>
                          <Select
                            value={questionCount}
                            onValueChange={(value) => {
                              setQuestionCount(value)
                              if (value !== "custom") {
                                setCustomQuestionCount("")
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 Questions</SelectItem>
                              <SelectItem value="10">10 Questions</SelectItem>
                              <SelectItem value="15">15 Questions</SelectItem>
                              <SelectItem value="20">20 Questions</SelectItem>
                              <SelectItem value="25">25 Questions</SelectItem>
                              <SelectItem value="custom">Custom Amount</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {questionCount === "custom" && (
                        <div className="space-y-2">
                          <Label htmlFor="customCount">Custom Number of Questions</Label>
                          <Input
                            id="customCount"
                            type="number"
                            min="1"
                            max="50"
                            placeholder="Enter number (1-50)"
                            value={customQuestionCount}
                            onChange={(e) => setCustomQuestionCount(e.target.value)}
                          />
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          const finalQuestionCount = questionCount === "custom" ? customQuestionCount : questionCount
                          const selectedCourseData = startedCourses.find((c) => c.course_id === selectedCourse)
                          const params = new URLSearchParams({
                            type: "course",
                            courseId: selectedCourse,
                            topic: selectedCourseData?.courses.title || "course content",
                            difficulty,
                            count: finalQuestionCount,
                            ...(isGuest && { guest: "true" }),
                          })
                          window.location.href = `/quizzes/take?${params.toString()}`
                        }}
                        disabled={
                          !selectedCourse ||
                          (questionCount === "custom" &&
                            (!customQuestionCount ||
                              Number.parseInt(customQuestionCount) < 1 ||
                              Number.parseInt(customQuestionCount) > 50))
                        }
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Generate Course Quiz
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No started courses found</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Start some courses first to unlock course-based quizzes
                      </p>
                      <Link href={`/courses${isGuest ? "?guest=true" : ""}`}>
                        <Button variant="outline" className="bg-transparent">
                          Browse Courses
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Quizzes & Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Quiz Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quizzes taken</span>
                  <span className="font-medium">{isGuest ? "0" : recentQuizzes.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Average score</span>
                  <span className="font-medium">
                    {isGuest
                      ? "0%"
                      : recentQuizzes.length > 0
                        ? `${Math.round(
                            recentQuizzes
                              .filter((q) => q.score !== null)
                              .reduce((acc, q) => acc + (q.score! / q.total_questions) * 100, 0) /
                              recentQuizzes.filter((q) => q.score !== null).length,
                          )}%`
                        : "0%"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">This week</span>
                  <span className="font-medium">{isGuest ? "0" : "3"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recent Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGuest ? (
                <div className="text-center py-6">
                  <Brain className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">Sign up to track your quiz history</p>
                  <Link href="/auth/sign-up">
                    <Button size="sm">Create Account</Button>
                  </Link>
                </div>
              ) : recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizzes.slice(0, 5).map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{quiz.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {quiz.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDate(quiz.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {quiz.completed_at ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className={`text-sm font-medium ${getScoreColor(quiz.score!, quiz.total_questions)}`}>
                              {quiz.score}/{quiz.total_questions}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-500">In progress</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Brain className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No quizzes taken yet</p>
                  <p className="text-xs text-gray-500 mt-1">Start your first quiz above!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
