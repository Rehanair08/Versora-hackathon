import { Link, Outlet } from "react-router-dom";
import { VersoraLogo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import Sidebar from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { user } from "@/data/user";
// Chatbot temporarily removed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

export default function MainLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-background text-foreground">
      {/* Topbar */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center gap-3">
          <Link to="/" className="flex items-center gap-2 mr-2">
            <VersoraLogo />
          </Link>
          <div className="flex-1 hidden md:block">
            <SearchBar
              onSearch={() => {}}
              inputClassName="h-10 rounded-lg"
              buttonClassName="h-10 rounded-lg hidden"
            />
          </div>
          <Select defaultValue="student">
            <SelectTrigger className="w-36 h-10">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student View</SelectItem>
              <SelectItem value="admin">Admin View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
          <ThemeToggle />
          <div className="flex items-center gap-2 pl-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm text-muted-foreground">
              {user.name.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Content area with sidebar */}
      <div className="container mx-auto w-full grid grid-cols-1 md:grid-cols-[16rem_1fr] lg:grid-cols-[17rem_1fr] gap-6 py-6">
        <Sidebar />
        <main className="min-h-[60vh]">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Versora</span>
          <span>Learn smarter. Earn badges. Get certified.</span>
        </div>
      </footer>
      {/* Chatbot removed for now */}
    </div>
  );
}
