import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  BookOpen,
  ChartBar,
  Settings,
  BadgeCheck,
  Code2,
} from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: LayoutGrid },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/quizzes", label: "Quizzes", icon: ChartBar },
  { to: "/progress", label: "Progress", icon: ChartBar },
  { to: "/certificates", label: "Certificates", icon: BadgeCheck },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col gap-2 border-r bg-background/60">
      <nav className="p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
