import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useRouter } from "../router";
import { AlignJustify, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { navigate } = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Futuristic default: dark theme; respect system only on first visit
    const stored = localStorage.getItem("genzoo-theme") as "light" | "dark" | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("genzoo-theme", next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-card/70 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-12 flex items-center gap-2 sm:gap-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-full bg-reddit-orange flex items-center justify-center">
            <AlignJustify className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="hidden sm:block font-bold text-lg tracking-tight text-reddit-orange">
            GenZoo
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search GenZoo"
            className="pl-9 h-9 bg-muted/50 border-transparent focus:border-reddit-orange focus:bg-background text-sm"
            data-ocid="nav.search_input"
          />
        </div>

        {/* Desktop Right actions */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full active:scale-95 transition-transform"
            onClick={toggleTheme}
            data-ocid="nav.toggle"
            aria-label="Toggle dark mode"
          >
            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-4 text-sm font-semibold border-reddit-orange text-reddit-orange hover:bg-reddit-orange/10 active:scale-95 transition-transform"
            data-ocid="nav.login_button"
            onClick={() => navigate("/signin")}
          >
            Log In
          </Button>
          <Button
            size="sm"
            className="h-8 px-4 text-sm font-semibold bg-reddit-orange hover:bg-reddit-orange-hover text-white border-0 active:scale-95 transition-transform"
            data-ocid="nav.signup_button"
            onClick={() => navigate("/signin")}
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-lg p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
          <Button
            variant="ghost"
            className="justify-start px-4 h-10 w-full active:scale-95 transition-transform"
            onClick={() => {
              toggleTheme();
              setIsMobileMenuOpen(false);
            }}
          >
            {mounted && theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            Toggle Theme
          </Button>
          <Button
            variant="outline"
            className="justify-center px-4 h-10 w-full border-reddit-orange text-reddit-orange hover:bg-reddit-orange/10 active:scale-95 transition-transform"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/signin");
            }}
          >
            Log In
          </Button>
          <Button
            className="justify-center px-4 h-10 w-full bg-reddit-orange hover:bg-reddit-orange-hover text-white border-0 active:scale-95 transition-transform"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/signin");
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
    </header>
  );
}
