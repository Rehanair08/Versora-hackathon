import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

function VLogo({ className }: { className?: string }) {
  return <div className={`flex items-center justify-center font-bold text-blue-600 ${className}`}>V</div>
}

export default function GuestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900">
            <VLogo className="h-8 w-8 text-2xl" />
            Versora
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Guest Mode</CardTitle>
            <CardDescription>Explore Versora with limited features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Limited Access</p>
                  <p className="text-amber-700">
                    As a guest, you can browse courses and take quizzes, but progress won't be saved.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">What you can do:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Browse available courses</li>
                <li>• Take AI-powered quizzes</li>
                <li>• View course details</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">What you'll miss:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalized recommendations</li>
                <li>• Progress tracking & streaks</li>
                <li>• Bookmarking courses</li>
                <li>• Achievement badges</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <Link href="/dashboard?guest=true">
                <Button className="w-full">Continue as Guest</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="outline" className="w-full bg-transparent">
                  Create Free Account Instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
