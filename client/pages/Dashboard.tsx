import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allCourses } from "@/data/courses";
import { user } from "@/data/user";
import { CourseCard } from "@/components/CourseCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { recommendCourses } from "@/utils/ai";

export default function Dashboard() {
  const enrolled = allCourses.slice(0, 4);
  const completed = allCourses.filter(
    (c) => c.completed || (c.progress ?? 0) >= 100,
  );
  const interests = Array.from(new Set(enrolled.flatMap((c) => c.tags))).slice(
    0,
    5,
  );
  const recommendations = recommendCourses({
    interests,
    courses: allCourses,
    excludeIds: enrolled.map((c) => c.id),
  });

  return (
    <section className="container mx-auto py-8 space-y-8">
      <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-white/30">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-sm/6 opacity-90">
              Learning streak {user.streakDays} days — keep it going
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Streak ×{user.streakDays}</Badge>
              {user.achievements.map((a) => (
                <Badge key={a} variant="secondary">
                  {a}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Continue learning</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrolled.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recommendations</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.slice(0, 8).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
