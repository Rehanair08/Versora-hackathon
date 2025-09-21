import CodingPractice from "@/components/CodingPractice";

export default function Coding() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Coding</h1>
      <p className="text-sm text-muted-foreground">
        Use the console to run JavaScript snippets.
      </p>
      <CodingPractice />
    </section>
  );
}
