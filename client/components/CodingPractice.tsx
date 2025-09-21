import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CodingPractice() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState("console.log('Hello Versora');");
  const [output, setOutput] = useState("");
  const prevLog = useRef<Console["log"] | null>(null);

  const run = () => {
    if (lang !== "javascript") {
      setOutput("Language not supported yet. Use JavaScript.");
      return;
    }
    const logs: string[] = [];
    prevLog.current = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(String).join(" "));
    };
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
      setOutput(logs.join("\n"));
    } catch (e: any) {
      setOutput(String(e));
    } finally {
      if (prevLog.current) console.log = prevLog.current;
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={run}>
            Run
          </Button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-56 p-3 font-mono text-sm bg-background"
        />
      </div>
      <div className="rounded-2xl border">
        <div className="px-3 py-2 border-b text-sm text-muted-foreground">
          Output
        </div>
        <pre className="p-3 text-sm whitespace-pre-wrap min-h-[14rem]">
          {output}
        </pre>
      </div>
    </div>
  );
}
