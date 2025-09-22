import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type, topic, courseId, difficulty, questionCount } = await request.json()

    console.log("[v0] Quiz generation request:", { type, topic, courseId, difficulty, questionCount })

    const apiKey = "AIzaSyAWnM3Z_wCNr6CVx5684tzbUfbHRmKrl8g"

    const difficultyPrompts = {
      beginner: `You are an expert quiz creator with deep knowledge across ALL subjects and domains. Create exactly ${questionCount} COMPLETELY UNIQUE beginner-level multiple choice questions about "${topic}".

CRITICAL REQUIREMENTS:
- You MUST be able to create questions about ANY topic: technology, science, history, arts, literature, sports, cooking, music, philosophy, business, medicine, law, etc.
- Each question must be COMPLETELY DIFFERENT from all others
- Cover different aspects, subtopics, and angles of ${topic}
- Use varied question formats: definitions, examples, basic applications, true/false concepts
- Questions should be accessible to complete beginners in ${topic}
- NO repetition of concepts, examples, or phrasing
- Make questions progressively build understanding
- If the topic is technical, include basic terminology and concepts
- If the topic is historical, include key dates, figures, and events
- If the topic is creative, include fundamental principles and techniques

Focus areas for variety:
- Basic definitions and terminology related to ${topic}
- Simple examples and use cases in ${topic}
- Fundamental principles of ${topic}
- Common beginner mistakes to avoid in ${topic}
- Basic tools, methods, or concepts for getting started with ${topic}`,

      intermediate: `You are an expert quiz creator with deep knowledge across ALL subjects and domains. Create exactly ${questionCount} COMPLETELY UNIQUE intermediate-level multiple choice questions about "${topic}".

CRITICAL REQUIREMENTS:
- You MUST be able to create questions about ANY topic: technology, science, history, arts, literature, sports, cooking, music, philosophy, business, medicine, law, etc.
- Each question must be COMPLETELY DIFFERENT from all others
- Cover different practical scenarios and applications of ${topic}
- Use varied question formats: problem-solving, comparisons, best practices, scenarios
- Questions should require hands-on understanding of ${topic}
- NO repetition of concepts, examples, or phrasing
- Include real-world application contexts for ${topic}
- If the topic is technical, include implementation details and troubleshooting
- If the topic is historical, include cause-and-effect relationships and analysis
- If the topic is creative, include intermediate techniques and style considerations

Focus areas for variety:
- Practical implementation scenarios in ${topic}
- Comparing different approaches/methods within ${topic}
- Troubleshooting common issues in ${topic}
- Best practices and conventions for ${topic}
- Integration of ${topic} with related concepts/tools`,

      advanced: `You are an expert quiz creator with deep knowledge across ALL subjects and domains. Create exactly ${questionCount} COMPLETELY UNIQUE advanced-level multiple choice questions about "${topic}".

CRITICAL REQUIREMENTS:
- You MUST be able to create questions about ANY topic: technology, science, history, arts, literature, sports, cooking, music, philosophy, business, medicine, law, etc.
- Each question must be COMPLETELY DIFFERENT from all others
- Cover complex scenarios, edge cases, and expert-level concepts in ${topic}
- Use varied question formats: optimization, architecture, advanced troubleshooting, expert scenarios
- Questions should challenge experienced practitioners of ${topic}
- NO repetition of concepts, examples, or phrasing
- Include cutting-edge and specialized knowledge about ${topic}
- If the topic is technical, include advanced optimization and architecture decisions
- If the topic is historical, include complex interpretations and scholarly debates
- If the topic is creative, include master-level techniques and innovation

Focus areas for variety:
- Performance optimization techniques in ${topic}
- Complex architectural or strategic decisions in ${topic}
- Advanced debugging, analysis, or problem-solving in ${topic}
- Expert-level best practices and innovations in ${topic}
- Cutting-edge features, theories, or techniques in ${topic}`,
    }

    const prompt = difficultyPrompts[difficulty as keyof typeof difficultyPrompts] || difficultyPrompts.intermediate

    const fullPrompt = `${prompt}

UNIVERSAL TOPIC COVERAGE:
You have comprehensive knowledge of ALL subjects including but not limited to:
- Technology: Programming, AI, Web Development, Cybersecurity, Hardware, Software Engineering
- Sciences: Physics, Chemistry, Biology, Mathematics, Medicine, Psychology, Environmental Science
- Humanities: History, Literature, Philosophy, Languages, Religion, Anthropology
- Arts: Music, Visual Arts, Theater, Film, Dance, Creative Writing, Design
- Business: Marketing, Finance, Management, Economics, Entrepreneurship, Strategy
- Practical Skills: Cooking, Sports, Fitness, Crafts, Home Improvement, Gardening
- And ANY other topic the user might request

RESPONSE FORMAT - Return ONLY valid JSON array with this EXACT structure:
[
  {
    "question": "Your unique question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Detailed explanation of why this answer is correct and others are wrong"
  }
]

FINAL CHECKLIST:
✓ Exactly ${questionCount} questions
✓ Each question covers a different aspect of ${topic}
✓ No repeated concepts or similar phrasing
✓ Appropriate ${difficulty} difficulty level for ${topic}
✓ Valid JSON format only
✓ All questions are multiple choice with 4 options
✓ Correct answer index (0-3) specified
✓ Detailed explanations provided
✓ Questions demonstrate deep understanding of ${topic}

Topic: ${topic}
Difficulty: ${difficulty}
Count: ${questionCount}`

    console.log("[v0] Sending request to Gemini API...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 1.2, // Increased temperature for maximum creativity and variety
            topK: 50, // Increased for more diverse responses
            topP: 0.98, // Increased for maximum variety
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Gemini API error:", errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Gemini API response received")

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("[v0] Invalid Gemini response structure:", data)
      throw new Error("Invalid response structure from Gemini API")
    }

    const generatedText = data.candidates[0].content.parts[0].text
    console.log("[v0] Generated text length:", generatedText.length)

    let questions
    try {
      // Try to find JSON array in the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: try to parse the entire response
        questions = JSON.parse(generatedText)
      }
    } catch (parseError) {
      console.error("[v0] JSON parsing failed:", parseError)
      console.error("[v0] Generated text:", generatedText)
      throw new Error("Could not parse JSON from Gemini response. Please try again.")
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("[v0] Invalid questions array:", questions)
      throw new Error("No valid questions generated. Please try again.")
    }

    const questionsWithIds = questions.map((q: any, index: number) => {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        console.error("[v0] Invalid question format:", q)
        throw new Error(`Invalid question format at index ${index}`)
      }

      return {
        ...q,
        id: `q_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${difficulty}_${topic.replace(/\s+/g, "_").toLowerCase().substr(0, 20)}`,
      }
    })

    console.log("[v0] Successfully generated", questionsWithIds.length, "unique questions for topic:", topic)

    return NextResponse.json({ questions: questionsWithIds })
  } catch (error) {
    console.error("[v0] Error generating quiz:", error)

    return NextResponse.json(
      {
        error: `Failed to generate quiz: ${error instanceof Error ? error.message : "Unknown error"}. Please try again with a different topic or check your connection.`,
      },
      { status: 500 },
    )
  }
}
