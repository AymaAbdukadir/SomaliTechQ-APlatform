import { NavLink } from "react-router-dom";
import { Home, Tag, Bookmark, Users } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/tags", label: "Tags", icon: Tag },
  { to: "/saved", label: "Saved Questions", icon: Bookmark },
  { to: "/users", label: "Active Users", icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-20 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "border-brand-100 bg-brand-50 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-500"
                  : "border-transparent text-surface-muted hover:border-surface-border hover:bg-surface-card hover:text-surface-text"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
