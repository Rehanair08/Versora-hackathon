"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

function VLogo({ className }: { className?: string }) {
  return <div className={`flex items-center justify-center font-bold text-blue-600 ${className}`}>V</div>
}

interface PersonalizationData {
  age: number
  goals: string[]
  skillLevel: string
  subjects: string[]
  learningStyle: string
  timeCommitment: number
}

const GOALS = [
  "Career advancement",
  "Personal development",
  "Academic improvement",
  "Skill building",
  "Hobby exploration",
  "Professional certification",
]

const SUBJECTS = [
  "Programming",
  "Web Development",
  "Data Science",
  "AI/ML",
  "Database",
  "Marketing",
  "Business",
  "Design",
  "Languages",
  "Mathematics",
]

const LEARNING_STYLES = [
  { value: "visual", label: "Visual", description: "Learn best with diagrams, charts, and visual aids" },
  { value: "auditory", label: "Auditory", description: "Prefer listening to lectures and discussions" },
  { value: "kinesthetic", label: "Hands-on", description: "Learn by doing and practical exercises" },
  { value: "reading", label: "Reading/Writing", description: "Prefer text-based learning and note-taking" },
]

export default function PersonalizationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<PersonalizationData>({
    age: 25,
    goals: [],
    skillLevel: "",
    subjects: [],
    learningStyle: "",
    timeCommitment: 30,
  })

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("personalization").insert({
        user_id: user.id,
        age: formData.age,
        goals: formData.goals,
        skill_level: formData.skillLevel,
        subjects: formData.subjects,
        learning_style: formData.learningStyle,
        time_commitment: formData.timeCommitment,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.age > 0
      case 2:
        return formData.goals.length > 0
      case 3:
        return formData.skillLevel !== ""
      case 4:
        return formData.subjects.length > 0
      case 5:
        return formData.learningStyle !== ""
      case 6:
        return formData.timeCommitment > 0
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get to know you</h2>
              <p className="text-gray-600">This helps us personalize your learning experience</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">What's your age?</Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))}
                className="text-center text-lg"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your learning goals?</h2>
              <p className="text-gray-600">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={goal} className="text-sm font-normal cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your current skill level?</h2>
              <p className="text-gray-600">This helps us recommend appropriate courses</p>
            </div>
            <RadioGroup
              value={formData.skillLevel}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, skillLevel: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner - Just starting out</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate - Some experience</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced - Experienced learner</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Which subjects interest you?</h2>
              <p className="text-gray-600">Select all that you'd like to learn about</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                  />
                  <Label htmlFor={subject} className="text-sm font-normal cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you prefer to learn?</h2>
              <p className="text-gray-600">Choose your preferred learning style</p>
            </div>
            <RadioGroup
              value={formData.learningStyle}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, learningStyle: value }))}
            >
              {LEARNING_STYLES.map((style) => (
                <div key={style.value} className="flex items-start space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={style.value} id={style.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={style.value} className="font-medium cursor-pointer">
                      {style.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How much time can you dedicate daily?</h2>
              <p className="text-gray-600">This helps us create realistic learning plans</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{formData.timeCommitment} minutes</div>
                <Input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={formData.timeCommitment}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, timeCommitment: Number.parseInt(e.target.value) }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>15 min</span>
                  <span>3 hours</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
            <VLogo className="h-8 w-8 text-2xl" />
            Versora
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg">Personalization Quiz</CardTitle>
              <span className="text-sm text-gray-500">{currentStep} of 6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4">{error}</div>}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="bg-transparent"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed() || isLoading}>
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
