import { allCourses } from "@/data/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Certificates() {
  const completed = allCourses.filter(
    (c) => c.completed || (c.progress ?? 0) >= 100,
  );
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Certificates</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {completed.map((c) => (
          <Card key={c.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>Completed — certificate available</div>
              <Button className="w-full">Download Certificate</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
