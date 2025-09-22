import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

function VLogo({ className }: { className?: string }) {
  return <div className={`flex items-center justify-center font-bold text-blue-600 ${className}`}>V</div>
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VLogo className="h-8 w-8 text-2xl" />
            <span className="text-2xl font-bold text-gray-900">Versora</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Personalized Learning That Adapts to <span className="text-blue-600">Your Goals</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Discover courses tailored to your learning style, track your progress with intelligent insights, and build
            lasting knowledge with AI-powered quizzes and streak tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Learning Free
              </Button>
            </Link>
            <Link href="/guest">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Try as Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Learn Effectively</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines the best courses from top providers with intelligent tracking and personalization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Personalized Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Take our quiz to get learning recommendations tailored to your goals, skill level, and preferred style.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Curated Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access the best courses from Coursera, edX, YouTube, and more, all in one organized platform.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <VLogo className="h-12 w-12 text-4xl mx-auto mb-4 text-purple-600" />
              <CardTitle>AI-Powered Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test your knowledge with intelligent quizzes powered by Gemini AI, adapting to your learning progress.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build learning streaks, earn achievements, and visualize your growth with detailed progress analytics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of learners who are achieving their goals with personalized education.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <VLogo className="h-6 w-6 text-xl text-white" />
            <span className="text-xl font-bold">Versora</span>
          </div>
          <p className="text-gray-400">Empowering learners worldwide with personalized education technology.</p>
        </div>
      </footer>
    </div>
  )
}
