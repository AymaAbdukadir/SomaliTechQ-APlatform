import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      return true;
    }
    if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      return true;
    }
    return false;
  });

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/?search=${encodeURIComponent(q)}` : "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface-card/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 md:px-8 lg:px-12">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 transition-opacity duration-150 hover:opacity-85"
        >
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-extrabold text-white shadow-md">
            ST
          </div>
          <span className="hidden font-bold tracking-tight text-surface-text sm:block">
            Somali Tech
          </span>
        </Link>

        <form onSubmit={handleSearch} className="mx-auto hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full rounded-xl border border-surface-border bg-surface-bg py-2 pl-9 pr-3 text-sm text-surface-text transition-all duration-150 placeholder:text-surface-muted hover:border-brand-500/50 focus:border-brand-500 focus:bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-xl border border-surface-border p-2 text-surface-muted transition-colors duration-150 hover:bg-surface-bg hover:text-surface-text"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link to="/ask" className="hidden sm:block">
            <Button size="sm" className="rounded-xl shadow-sm shadow-brand-500/10">
              <Plus className="h-4 w-4" />
              Ask a Question
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-transparent p-1 transition-colors duration-150 hover:border-surface-border hover:bg-surface-bg"
              >
                <Avatar name={user.name} size="sm" />
                <span className="hidden text-sm font-semibold text-surface-text md:block">
                  {user.name}
                </span>
              </button>
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-surface-border bg-surface-card py-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="border-b border-surface-border px-3.5 py-2.5">
                      <p className="truncate text-sm font-bold text-surface-text">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-surface-muted">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-surface-muted transition-colors duration-150 hover:bg-surface-bg hover:text-surface-text"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-xl hover:bg-surface-bg">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button variant="secondary" size="sm" className="rounded-xl hover:bg-surface-bg">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-xl border border-surface-border p-2 text-surface-muted transition-colors duration-150 hover:bg-surface-bg lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-surface-border bg-surface-card px-4 py-3 lg:hidden space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full rounded-xl border border-surface-border bg-surface-bg py-2 pl-9 pr-3 text-sm text-surface-text focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </form>
          <Link
            to="/ask"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            <Button className="w-full rounded-xl" size="sm">
              <Plus className="h-4 w-4" />
              Ask a Question
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
