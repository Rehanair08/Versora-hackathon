import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || "programming tutorial"
    const maxResults = searchParams.get("maxResults") || "20"

    const apiKey = "AIzaSyCmW7fqZ0slVid9PPfvJWfKm_x3hFCldJ8"

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=long&videoDefinition=high&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform YouTube data to match our course structure
    const courses = data.items.map((item: any, index: number) => ({
      id: `yt_${item.id.videoId}`,
      title: item.snippet.title,
      description: item.snippet.description,
      provider: "YouTube",
      external_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      category: inferCategory(item.snippet.title, item.snippet.description),
      difficulty_level: inferDifficulty(item.snippet.title, item.snippet.description),
      duration_hours: Math.floor(Math.random() * 10) + 1, // YouTube API doesn't provide duration in search
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
    }))

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error fetching YouTube courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

function inferCategory(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase()

  if (text.includes("javascript") || text.includes("js") || text.includes("react") || text.includes("node"))
    return "Web Development"
  if (text.includes("python") || text.includes("django") || text.includes("flask")) return "Programming"
  if (text.includes("machine learning") || text.includes("ai") || text.includes("data science")) return "Data Science"
  if (text.includes("design") || text.includes("ui") || text.includes("ux")) return "Design"
  if (text.includes("business") || text.includes("marketing") || text.includes("management")) return "Business"
  if (text.includes("math") || text.includes("calculus") || text.includes("algebra")) return "Mathematics"

  return "Technology"
}

function inferDifficulty(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase()

  if (text.includes("beginner") || text.includes("intro") || text.includes("basics") || text.includes("fundamentals"))
    return "Beginner"
  if (text.includes("advanced") || text.includes("expert") || text.includes("master") || text.includes("professional"))
    return "Advanced"

  return "Intermediate"
}
