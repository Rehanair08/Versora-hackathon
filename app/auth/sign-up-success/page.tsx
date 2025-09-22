import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

function VLogo({ className }: { className?: string }) {
  return <div className={`flex items-center justify-center font-bold text-blue-600 ${className}`}>V</div>
}

export default function SignUpSuccessPage() {
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link to complete your registration</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you'll
              be redirected to complete your personalization quiz.
            </p>
            <div className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{" "}
              <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
                try signing up again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
