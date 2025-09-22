"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Star,
  Clock,
  Bookmark,
  BookmarkCheck,
  Play,
  TrendingUp,
  Youtube,
  RefreshCw,
} from "lucide-react"
import { useState, useMemo, useEffect } from "react"

interface Course {
  id: string
  title: string
  description: string
  provider: string
  external_url: string
  thumbnail_url?: string
  category: string
  difficulty_level: string
  duration_hours: number
  rating: number
}

interface UserCourse {
  id: string
  course_id: string
  is_bookmarked: boolean
  progress_percentage: number
  started_at?: string
}

interface Personalization {
  subjects: string[]
  skill_level: string
  goals: string[]
}

interface CoursesContentProps {
  courses: Course[]
  userCourses: UserCourse[]
  personalization: Personalization | null
  isGuest: boolean
  userId?: string
}

export function CoursesContent({ courses, userCourses, personalization, isGuest, userId }: CoursesContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Set<string>>(
    new Set(userCourses.filter((uc) => uc.is_bookmarked).map((uc) => uc.course_id)),
  )
  const [youtubeCourses, setYoutubeCourses] = useState<Course[]>([])
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false)
  const [allCourses, setAllCourses] = useState<Course[]>(courses.filter((course) => course.provider === "YouTube"))
  const [startedCourses, setStartedCourses] = useState<Set<string>>(
    new Set(userCourses.filter((uc) => uc.progress_percentage > 0).map((uc) => uc.course_id)),
  )

  const fetchYoutubeCourses = async (query = "programming tutorial", difficulty = "all") => {
    setIsLoadingYoutube(true)
    try {
      const queries = []

      if (difficulty === "all") {
        queries.push(`${query} beginner tutorial`, `${query} intermediate course`, `${query} advanced masterclass`)
      } else {
        queries.push(`${query} ${difficulty} tutorial`)
      }

      const allResults = []
      for (const searchQuery of queries) {
        const response = await fetch(`/api/youtube-courses?q=${encodeURIComponent(searchQuery)}&maxResults=8`)
        if (response.ok) {
          const data = await response.json()
          allResults.push(...data.courses)
        }
      }

      const uniqueCourses = allResults.filter(
        (course, index, self) => index === self.findIndex((c) => c.external_url === course.external_url),
      )

      setYoutubeCourses(uniqueCourses)
      setAllCourses([...courses.filter((course) => course.provider === "YouTube"), ...uniqueCourses])
    } catch (error) {
      console.error("Error fetching YouTube courses:", error)
    } finally {
      setIsLoadingYoutube(false)
    }
  }

  useEffect(() => {
    fetchYoutubeCourses("programming tutorial")
  }, [])

  const categories = [...new Set(allCourses.map((course) => course.category))]
  const difficulties = [...new Set(allCourses.map((course) => course.difficulty_level))]
  const providers = ["YouTube"]

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || course.difficulty_level === selectedDifficulty
      const matchesProvider = selectedProvider === "all" || course.provider === selectedProvider
      const matchesBookmarked = !showBookmarked || bookmarkedCourses.has(course.id)

      return matchesSearch && matchesCategory && matchesDifficulty && matchesProvider && matchesBookmarked
    })
  }, [
    allCourses,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedProvider,
    showBookmarked,
    bookmarkedCourses,
  ])

  const recommendedCourses = useMemo(() => {
    if (!personalization || isGuest) return []

    return allCourses
      .filter((course) => {
        const matchesSubjects = personalization.subjects.some((subject) =>
          course.category.toLowerCase().includes(subject.toLowerCase()),
        )
        const matchesDifficulty = course.difficulty_level.toLowerCase() === personalization.skill_level.toLowerCase()
        return matchesSubjects || matchesDifficulty
      })
      .slice(0, 3)
  }, [allCourses, personalization, isGuest])

  const handleBookmark = async (courseId: string) => {
    if (isGuest || !userId) return

    const supabase = createClient()
    const isCurrentlyBookmarked = bookmarkedCourses.has(courseId)

    try {
      if (isCurrentlyBookmarked) {
        await supabase.from("user_courses").delete().eq("user_id", userId).eq("course_id", courseId)
        setBookmarkedCourses((prev) => {
          const newSet = new Set(prev)
          newSet.delete(courseId)
          return newSet
        })
      } else {
        await supabase.from("user_courses").upsert({
          user_id: userId,
          course_id: courseId,
          is_bookmarked: true,
          progress_percentage: 0,
        })
        setBookmarkedCourses((prev) => new Set([...prev, courseId]))
      }
    } catch (error) {
      console.error("Error updating bookmark:", error)
    }
  }

  const handleEnrollCourse = async (courseId: string, courseTitle: string) => {
    if (isGuest || !userId) return

    const supabase = createClient()

    try {
      // Check if user_course record exists
      const { data: existingRecord } = await supabase
        .from("user_courses")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single()

      if (existingRecord) {
        // Update existing record to mark as started
        await supabase
          .from("user_courses")
          .update({
            progress_percentage: Math.max(existingRecord.progress_percentage, 1),
            started_at: existingRecord.started_at || new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("course_id", courseId)
      } else {
        // Create new record
        await supabase.from("user_courses").insert({
          user_id: userId,
          course_id: courseId,
          progress_percentage: 1,
          started_at: new Date().toISOString(),
          is_bookmarked: false,
        })
      }

      setStartedCourses((prev) => new Set([...prev, courseId]))
      console.log("[v0] Course enrolled:", courseTitle)
    } catch (error) {
      console.error("[v0] Error enrolling in course:", error)
    }
  }

  const getUserCourseProgress = (courseId: string) => {
    const userCourse = userCourses.find((uc) => uc.course_id === courseId)
    return userCourse?.progress_percentage || 0
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">
            {isGuest
              ? "Explore educational videos from YouTube across all difficulty levels"
              : "Discover YouTube courses tailored to your learning goals and interests"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchYoutubeCourses(searchQuery || "programming tutorial", selectedDifficulty)}
            disabled={isLoadingYoutube}
          >
            {isLoadingYoutube ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Youtube className="h-4 w-4 mr-2" />
            )}
            Refresh YouTube
          </Button>
        </div>
      </div>

      {!isGuest && recommendedCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Recommended
                    </Badge>
                    {!isGuest && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(course.id)}
                        className="h-8 w-8 p-0"
                      >
                        {bookmarkedCourses.has(course.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_hours}h</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {course.provider}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.difficulty_level}</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {!isGuest && !startedCourses.has(course.id) ? (
                      <Button
                        size="sm"
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        onClick={() => handleEnrollCourse(course.id, course.title)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Enroll Course
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        onClick={() => window.open(course.external_url, "_blank", "noopener,noreferrer")}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {startedCourses.has(course.id) ? "Continue Course" : "Watch Course"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search YouTube courses... (try 'React', 'Python', 'Machine Learning')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  fetchYoutubeCourses(searchQuery, selectedDifficulty)
                }
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={(value) => {
                setSelectedDifficulty(value)
                if (searchQuery.trim()) {
                  fetchYoutubeCourses(searchQuery, value)
                }
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredCourses.length} YouTube courses found
              {youtubeCourses.length > 0 && (
                <span className="text-red-600 ml-1">({youtubeCourses.length} live results)</span>
              )}
            </span>
          </div>
          {!isGuest && (
            <Button
              variant={showBookmarked ? "default" : "outline"}
              size="sm"
              onClick={() => setShowBookmarked(!showBookmarked)}
              className={showBookmarked ? "" : "bg-transparent"}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmarked Only
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const progress = getUserCourseProgress(course.id)
          const isBookmarked = bookmarkedCourses.has(course.id)
          const isStarted = startedCourses.has(course.id)

          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-black" />
                    <Badge variant="outline" className="bg-black text-white border-black">
                      YouTube
                    </Badge>
                  </div>
                  {!isGuest && (
                    <Button variant="ghost" size="sm" onClick={() => handleBookmark(course.id)} className="h-8 w-8 p-0">
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.difficulty_level}</Badge>
                </div>

                {!isGuest && progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isGuest && !isStarted ? (
                    <Button
                      size="sm"
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      onClick={() => handleEnrollCourse(course.id, course.title)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Enroll Course
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      onClick={() => {
                        console.log("[v0] Opening YouTube URL:", course.external_url)
                        window.open(course.external_url, "_blank", "noopener,noreferrer")
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isStarted ? "Continue on YouTube" : "Watch on YouTube"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <Youtube className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No YouTube courses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or search for different topics</p>
          <Button onClick={() => fetchYoutubeCourses("programming tutorial", "all")} disabled={isLoadingYoutube}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingYoutube ? "animate-spin" : ""}`} />
            Load Default Courses
          </Button>
        </div>
      )}
    </div>
  )
}
