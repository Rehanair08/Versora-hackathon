import { allCourses } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";

export default function Courses() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">My Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCourses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  );
}
