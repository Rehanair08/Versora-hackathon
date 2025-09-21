import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SearchBar({
  onSearch,
  placeholder = "Search courses, topics, skills...",
  className,
  inputClassName,
  buttonClassName,
}: {
  onSearch: (q: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [q, setQ] = useState("");
  return (
    <form
      className={cn("flex w-full items-center gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q.trim());
      }}
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className={cn("pl-9 h-12 rounded-xl", inputClassName)}
        />
      </div>
      <Button
        type="submit"
        className={cn("h-12 rounded-xl px-5", buttonClassName)}
      >
        Search
      </Button>
    </form>
  );
}
