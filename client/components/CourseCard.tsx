import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, BadgeCheck } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  progress?: number;
  quizProgress?: number;
  completed?: boolean;
}

export function CourseCard({
  course,
  onOpen,
}: {
  course: Course;
  onOpen?: (id: string) => void;
}) {
  const done = course.completed || (course.progress ?? 0) >= 100;
  return (
    <Card className="group hover:shadow-lg transition-shadow rounded-2xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{course.level}</Badge>
          <div className="flex items-center gap-1.5">
            {done && (
              <BadgeCheck
                className="text-emerald-500"
                size={18}
                aria-label="Certificate"
              />
            )}
            {(course.progress ?? 0) >= 60 && !done && (
              <Award className="text-amber-500" size={18} aria-label="Badge" />
            )}
          </div>
        </div>
        <CardTitle className="text-lg leading-snug">{course.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {course.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={Math.min(100, course.progress ?? 0)} />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{Math.min(100, course.progress ?? 0)}% complete</span>
        </div>
        <Button className="w-full" onClick={() => onOpen?.(course.id)}>
          {done
            ? "View Certificate"
            : (course.progress ?? 0) > 0
              ? "Continue"
              : "Start"}
        </Button>
      </CardContent>
    </Card>
  );
}
