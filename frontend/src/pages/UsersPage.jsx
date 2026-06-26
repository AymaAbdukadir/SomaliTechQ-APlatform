import { useState, useEffect } from "react";
import { Users, Search, RefreshCw, AlertCircle, Award, MessageSquare, HelpCircle } from "lucide-react";
import { getUserList } from "../api/auth";
import Avatar from "../components/ui/Avatar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const { data } = await getUserList();
        setUsers(data?.data?.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadgeColor = (index) => {
    if (index === 0) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    if (index === 1) return "bg-slate-400/10 text-slate-500 dark:text-slate-300 border border-slate-400/20";
    if (index === 2) return "bg-amber-700/10 text-amber-800 dark:text-amber-500 border border-amber-700/20";
    return "bg-surface-bg text-surface-muted border border-surface-border";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-surface-border/40 pb-5">
        <h1 className="text-xl font-extrabold tracking-tight text-surface-text sm:text-2xl flex items-center gap-2">
          <Users className="h-6 w-6 text-brand-500" /> Community Members
        </h1>
        <p className="mt-1.5 text-sm text-surface-muted">
          Meet the most active developers contributing to Somali Tech Q&amp;A.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
        <input
          type="search"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-surface-border bg-surface-card py-2.5 pl-10 pr-4 text-sm text-surface-text transition-all duration-150 placeholder:text-surface-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
        />
      </div>

      {/* States */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-card p-5 flex items-center gap-4">
              <div className="h-12 w-12 shimmer rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4.5 w-24 shimmer rounded-lg" />
                <div className="h-3 w-16 shimmer rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-surface-card border border-surface-border px-4 py-2 text-xs font-semibold text-surface-text shadow-sm hover:bg-surface-bg transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center text-sm text-surface-muted">
          No matching users found.
        </div>
      ) : (
        /* Users Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((item, index) => (
            <div
              key={item._id}
              className="group rounded-2xl border border-surface-border bg-surface-card p-5 shadow-sm transition-all duration-150 hover:border-brand-500/30 hover:shadow-md relative"
            >
              {/* Leaderboard Rank Badge */}
              <div className={`absolute top-4 right-4 h-6 px-2 flex items-center justify-center rounded-lg text-[10px] font-extrabold tracking-wider ${getRankBadgeColor(index)}`}>
                #{index + 1}
              </div>

              <div className="flex items-center gap-3.5">
                <Avatar name={item.name} size="lg" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-surface-text truncate group-hover:text-brand-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-surface-muted mt-0.5 truncate">
                    {item.email}
                  </p>
                </div>
              </div>

              {/* Reputation Indicator */}
              <div className="mt-4 flex items-center gap-2 bg-surface-bg/70 dark:bg-surface-bg/30 border border-surface-border/50 rounded-xl px-3 py-2">
                <Award className="h-4.5 w-4.5 text-brand-500 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-surface-text">{item.reputation}</span>{" "}
                  <span className="font-semibold text-surface-muted text-[10px] uppercase tracking-wider">Reputation</span>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="mt-3.5 pt-3.5 border-t border-surface-border/40 grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-surface-muted">
                <div className="flex flex-col items-center border-r border-surface-border/40">
                  <span className="text-sm font-extrabold text-surface-text">{item.questionCount}</span>
                  <span className="uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <HelpCircle className="h-3 w-3 text-surface-muted" /> Questions
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-extrabold text-surface-text">{item.answerCount}</span>
                  <span className="uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <MessageSquare className="h-3 w-3 text-surface-muted" /> Answers
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
