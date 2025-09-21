import { allCourses } from "@/data/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Quizzes() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCourses.map((c) => (
          <Card key={c.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Level {c.level}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(100, c.quizProgress ?? 0)}%` }}
                  />
                </div>
                <span className="text-xs w-10 text-right">
                  {Math.min(100, c.quizProgress ?? 0)}%
                </span>
              </div>
              <Button className="w-full">
                {(c.quizProgress ?? 0) > 0
                  ? c.quizProgress === 100
                    ? "Review Quiz"
                    : "Continue Quiz"
                  : "Start Quiz"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
