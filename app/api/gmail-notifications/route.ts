import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, type } = await request.json()

    // For now, we'll store notification preferences and simulate sending
    // In a full implementation, you'd use Gmail API with OAuth2
    const apiKey = "AIzaSyAQM1CyGeBGkXzE1qNDtMJfRH70x8PcwE0"
  
    // Log the notification (in production, this would send via Gmail API)
    console.log(`[Gmail Notification] To: ${to}, Subject: ${subject}, Type: ${type}`)
    console.log(`Message: ${message}`)

    // Simulate successful sending
    return NextResponse.json({
      success: true,
      message: "Notification queued successfully",
      notificationId: `notif_${Date.now()}`,
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Return default notification preferences
    const preferences = {
      emailNotifications: true,
      courseReminders: true,
      achievementAlerts: true,
      weeklyProgress: true,
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}
