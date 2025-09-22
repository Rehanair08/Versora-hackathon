"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Shield, Trash2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { NotificationManager } from "./notification-manager"

interface Profile {
  id: string
  name: string | null
  email: string | null
}

interface Personalization {
  age: number
  goals: string[]
  skill_level: string
  subjects: string[]
  learning_style: string
  time_commitment: number
}

interface SettingsContentProps {
  user: any | null
  profile: Profile | null
  personalization: Personalization | null
  isGuest: boolean
}

export function SettingsContent({ user, profile, personalization, isGuest }: SettingsContentProps) {
  const [name, setName] = useState(profile?.name || user?.user_metadata?.name || "")
  const [timeCommitment, setTimeCommitment] = useState(personalization?.time_commitment || 30)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleUpdateProfile = async () => {
    if (isGuest || !user) return

    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      // Update profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        name,
        email: user.email,
      })

      if (profileError) throw profileError

      // Update personalization if it exists
      if (personalization) {
        const { error: personalError } = await supabase
          .from("personalization")
          .update({
            time_commitment: timeCommitment,
          })
          .eq("user_id", user.id)

        if (personalError) throw personalError
      }

      setMessage({ type: "success", text: "Settings updated successfully!" })
    } catch (error) {
      console.error("Error updating settings:", error)
      setMessage({ type: "error", text: "Failed to update settings. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (isGuest) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Settings</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up to access personalized settings, learning preferences, and account management features.
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and learning preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-commitment">Daily Learning Goal (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(Number.parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-16">{timeCommitment} min</span>
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? "Updating..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          {personalization && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>Your personalization settings from the initial quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Skill Level</Label>
                    <p className="text-sm text-gray-600 capitalize">{personalization.skill_level}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Learning Style</Label>
                    <p className="text-sm text-gray-600 capitalize">{personalization.learning_style}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Subjects of Interest</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personalization.subjects.map((subject) => (
                      <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Learning Goals</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personalization.goals.map((goal) => (
                      <span key={goal} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href="/personalization">
                  <Button variant="outline" className="bg-transparent">
                    Retake Personalization Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Account Actions */}
        <div className="space-y-6">
          <NotificationManager userId={user?.id} isGuest={isGuest} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Download My Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
