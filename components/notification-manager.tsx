"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, Award, TrendingUp } from "lucide-react"

interface NotificationPreferences {
  emailNotifications: boolean
  courseReminders: boolean
  achievementAlerts: boolean
  weeklyProgress: boolean
}

interface NotificationManagerProps {
  userId?: string
  isGuest: boolean
}

export function NotificationManager({ userId, isGuest }: NotificationManagerProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    courseReminders: true,
    achievementAlerts: true,
    weeklyProgress: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isGuest && userId) {
      fetchPreferences()
    }
  }, [userId, isGuest])

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`/api/gmail-notifications?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences)
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error)
    }
  }

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (isGuest) return

    setPreferences((prev) => ({ ...prev, [key]: value }))

    // In a real implementation, this would save to database
    console.log(`Updated ${key} to ${value}`)
  }

  const sendTestNotification = async () => {
    if (isGuest || !userId) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/gmail-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "user@example.com", // In real app, get from user profile
          subject: "Test Notification from Versora",
          message: "This is a test notification to verify your email settings are working correctly.",
          type: "test",
        }),
      })

      if (response.ok) {
        console.log("Test notification sent successfully")
      }
    } catch (error) {
      console.error("Error sending test notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isGuest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Sign up to receive personalized learning notifications and progress updates.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Manage how you receive updates about your learning progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive general updates via email</p>
              </div>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => updatePreference("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Course Reminders</p>
                <p className="text-sm text-gray-600">Get reminded about your ongoing courses</p>
              </div>
            </div>
            <Switch
              checked={preferences.courseReminders}
              onCheckedChange={(checked) => updatePreference("courseReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Achievement Alerts</p>
                <p className="text-sm text-gray-600">Celebrate your learning milestones</p>
              </div>
            </div>
            <Switch
              checked={preferences.achievementAlerts}
              onCheckedChange={(checked) => updatePreference("achievementAlerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Weekly Progress</p>
                <p className="text-sm text-gray-600">Weekly summary of your learning activity</p>
              </div>
            </div>
            <Switch
              checked={preferences.weeklyProgress}
              onCheckedChange={(checked) => updatePreference("weeklyProgress", checked)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={sendTestNotification}
            disabled={isLoading}
            className="w-full bg-transparent"
          >
            {isLoading ? "Sending..." : "Send Test Notification"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
