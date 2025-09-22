"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, CheckCircle, XCircle, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Question {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  id?: string
}

interface QuizTakerProps {
  type: string
  topic?: string
  courseId?: string
  courseTitle?: string
  difficulty: string
  questionCount: number
  isGuest: boolean
  userId?: string
}

export function QuizTaker({
  type,
  topic,
  courseId,
  courseTitle,
  difficulty,
  questionCount,
  isGuest,
  userId,
}: QuizTakerProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Timer effect
  useEffect(() => {
    if (!showResults && !isLoading) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [showResults, isLoading])

  // Generate questions on component mount
  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Generating quiz with:", { type, topic, difficulty, questionCount })

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          topic,
          courseId,
          difficulty,
          questionCount,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate quiz: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Quiz generated successfully:", data.questions.length, "questions")

      setQuestions(data.questions)
      setSelectedAnswers(new Array(data.questions.length).fill(-1))
    } catch (error) {
      console.error("Error generating quiz:", error)
      setError("Failed to generate quiz. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Calculate score
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correct_answer ? 1 : 0)
    }, 0)

    setScore(correctAnswers)

    // Save quiz to database if not guest
    if (!isGuest && userId) {
      try {
        const supabase = createClient()
        await supabase.from("quizzes").insert({
          user_id: userId,
          title: type === "course" ? `${courseTitle} Quiz` : `${topic} Quiz`,
          type,
          course_id: courseId || null,
          questions: questions,
          answers: selectedAnswers,
          score: correctAnswers,
          total_questions: questions.length,
          completed_at: new Date().toISOString(),
        })

        if (correctAnswers / questions.length >= 0.8) {
          try {
            await fetch("/api/gmail-notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: "user@example.com",
                subject: "Great Quiz Performance! 🎉",
                message: `Congratulations! You scored ${correctAnswers}/${questions.length} (${Math.round((correctAnswers / questions.length) * 100)}%) on your ${topic} quiz. Keep up the excellent work!`,
                type: "achievement",
              }),
            })
          } catch (notifError) {
            console.error("Error sending achievement notification:", notifError)
          }
        }
      } catch (error) {
        console.error("Error saving quiz:", error)
      }
    }

    setShowResults(true)
    setIsSubmitting(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 90) return "Excellent work! 🎉"
    if (percentage >= 80) return "Great job! 👏"
    if (percentage >= 70) return "Good effort! 👍"
    if (percentage >= 60) return "Not bad, keep practicing! 📚"
    return "Keep studying and try again! 💪"
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Quiz</h3>
              <p className="text-gray-600">
                Gemini AI is creating {difficulty}-level questions about {topic}...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={generateQuestions}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="p-6 space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor()}`}>
                {score}/{questions.length}
              </div>
              <p className="text-lg text-gray-600">{getScoreMessage()}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <Badge variant="outline">{Math.round((score / questions.length) * 100)}% Score</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correct_answer
                const userAnswer = selectedAnswers[index]

                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            let className = "p-2 rounded border text-sm"
                            if (optionIndex === question.correct_answer) {
                              className += " bg-green-50 border-green-200 text-green-800"
                            } else if (optionIndex === userAnswer && !isCorrect) {
                              className += " bg-red-50 border-red-200 text-red-800"
                            } else {
                              className += " bg-gray-50 border-gray-200"
                            }

                            return (
                              <div key={optionIndex} className={className}>
                                {option}
                                {optionIndex === question.correct_answer && (
                                  <span className="ml-2 text-xs font-medium">✓ Correct</span>
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <span className="ml-2 text-xs font-medium">✗ Your answer</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push(`/quizzes${isGuest ? "?guest=true" : ""}`)}
            variant="outline"
            className="bg-transparent"
          >
            Take Another Quiz
          </Button>
          <Button onClick={() => router.push(`/dashboard${isGuest ? "?guest=true" : ""}`)}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                {type === "course" ? `${courseTitle} Quiz` : `${topic} Quiz`}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {difficulty}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Question</div>
              <div className="text-lg font-semibold">
                {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString() || ""}
            onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? "bg-blue-600 text-white"
                  : selectedAnswers[index] !== -1
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={selectedAnswers.includes(-1) || isSubmitting} className="min-w-24">
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === -1}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
