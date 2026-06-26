import { NavLink } from "react-router-dom";
import { Home, Tag, Bookmark, Users } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/tags", label: "Tags", icon: Tag },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/users", label: "Users", icon: Users },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-border bg-surface-card/90 backdrop-blur-md px-2 py-1.5 lg:hidden shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl py-1 px-2.5 text-[10px] font-semibold transition-all duration-150 ${
                isActive
                  ? "text-brand-600 dark:text-brand-500 scale-105"
                  : "text-surface-muted hover:text-surface-text"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
