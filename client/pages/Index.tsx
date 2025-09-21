import { useMemo, useState } from "react";
import { allCourses } from "@/data/courses";
import { recommendCourses } from "@/utils/ai";
import { CourseCard } from "@/components/CourseCard";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, ShieldCheck } from "lucide-react";

export default function Index() {
  const [query, setQuery] = useState("");
  const inProgress = allCourses.filter((c) => (c.progress ?? 0) > 0 && (c.progress ?? 0) < 100);
  const completed = allCourses.filter((c) => c.completed || (c.progress ?? 0) >= 100);

  const interests = useMemo(() => {
    if (query.trim()) return query.split(/[,\s]+/).slice(0, 5);
    const tags = inProgress.flatMap((c) => c.tags).slice(0, 5);
    return tags.length ? tags : ["React", "AI", "Design"];
  }, [inProgress, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCourses;
    return allCourses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  const recommendations = useMemo(
    () => recommendCourses({ interests, courses: filtered, excludeIds: inProgress.map((c) => c.id) }),
    [filtered, interests, inProgress],
  );

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-brand-gradient">
          <div className="container mx-auto py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white/90 backdrop-blur">
                <Sparkles size={16} />
                <span className="text-xs">Personalised learning • AI powered</span>
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-white">
                Learn your way with <span className="opacity-90">Versora</span>
              </h1>
              <p className="mt-3 md:mt-4 text-white/85 text-lg max-w-2xl">
                Search, discover and level up with a gamified experience. Earn badges and certificates as you go.
              </p>
              <div className="mt-6 max-w-2xl">
                <SearchBar onSearch={setQuery} />
                <div className="mt-3 flex flex-wrap gap-2 text-white/90">
                  {interests.slice(0, 6).map((t) => (
                    <span key={t} className="text-xs/5 rounded-full bg-white/15 px-3 py-1">#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="text-amber-500" /> Your Achievements</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3 flex-wrap">
              <Badge>Streak ×7</Badge>
              <Badge variant="secondary">Frontend Novice</Badge>
              <Badge variant="outline">Problem Solver</Badge>
              <Badge variant="secondary">Design Starter</Badge>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> Certificates</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {completed.length ? (
                <p>{completed.length} certificate(s) ready to download</p>
              ) : (
                <p>No certificates yet — complete a course to unlock one!</p>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Admin Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learners active: 128
              <br />
              Courses live: 24
              <br />
              Avg. progress today: 43%
            </CardContent>
          </Card>
        </div>

        {inProgress.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Continue learning</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {inProgress.slice(0, 8).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">AI Recommendations for you</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.slice(0, 8).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
