import type { Course } from "@/components/CourseCard";

export function recommendCourses({ interests, courses, excludeIds = [] }: {
  interests: string[];
  courses: Course[];
  excludeIds?: string[];
}) {
  const interestSet = new Set(interests.map((s) => s.toLowerCase()));
  return courses
    .filter((c) => !excludeIds.includes(c.id))
    .map((c) => {
      const score = c.tags.reduce((acc, t) => acc + (interestSet.has(t.toLowerCase()) ? 2 : 0), 0) +
        (c.level === "Beginner" ? 0.5 : c.level === "Intermediate" ? 0.8 : 1);
      return { course: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => r.course);
}
