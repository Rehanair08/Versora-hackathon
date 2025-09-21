import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { user } from "@/data/user";

export default function Settings() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
        <Input defaultValue={user.name} />
        <Input placeholder="Email" />
      </div>
      <Button>Save</Button>
    </section>
  );
}
