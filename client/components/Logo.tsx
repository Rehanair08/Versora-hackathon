import { cn } from "@/lib/utils";

export function VersoraLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id="vgrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--brand-start))" />
            <stop offset="100%" stopColor="hsl(var(--brand-end))" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#vgrad)" strokeWidth="6" strokeLinecap="round">
          <path d="M8 12 L28 52" />
          <path d="M56 12 L36 52" />
          <circle cx="32" cy="12" r="4" fill="url(#vgrad)" />
        </g>
      </svg>
      <span className="font-extrabold text-xl tracking-tight">Versora</span>
    </div>
  );
}
