import { useMemo, useRef, useState } from "react";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allCourses } from "@/data/courses";

interface Msg { id: string; role: "user" | "assistant"; text: string }

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", role: "assistant", text: "Hi! I’m Versora Assistant. Ask me for course suggestions or help with quizzes." },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => allCourses.slice(0, 3).map(c => `Try: ${c.title}`), []);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), role: "user", text }]);
    setInput("");
    // simple recommendation logic
    const q = text.toLowerCase();
    const picks = allCourses.filter(c => c.title.toLowerCase().includes(q) || c.tags.some(t => q.includes(t.toLowerCase()))).slice(0,3);
    const reply = picks.length
      ? `Based on that, I recommend: ${picks.map(p=>p.title).join(", ")}.`
      : suggestions[0];
    setTimeout(() => {
      setMessages((m) => [...m, { id: Math.random().toString(36).slice(2), role: "assistant", text: reply }]);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[340px] md:w-[380px] rounded-2xl border bg-background shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2 font-semibold"><Bot className="text-primary" size={18}/> Versora Assistant</div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close chat"><X/></Button>
          </div>
          <div ref={listRef} className="max-h-80 overflow-auto space-y-3 p-4">
            {messages.map(m => (
              <div key={m.id} className={`flex items-start gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.role === 'assistant' && <Bot size={16} className="mt-1 text-primary"/>}
                <div className={`rounded-2xl px-3 py-2 text-sm ${m.role==='user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{m.text}</div>
                {m.role === 'user' && <User size={16} className="mt-1 text-muted-foreground"/>}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask about a course or quiz..." onKeyDown={(e)=>{ if(e.key==='Enter') send(); }} />
            <Button onClick={send} aria-label="Send"><Send size={16}/></Button>
          </div>
        </div>
      ) : (
        <Button className="h-12 w-12 rounded-full shadow-lg" onClick={() => setOpen(true)} aria-label="Open chat">
          <MessageSquare />
        </Button>
      )}
    </div>
  );
}
