import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag, Search, RefreshCw, AlertCircle } from "lucide-react";
import { getTagsList } from "../api/questions";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const { data } = await getTagsList();
        setTags(data?.data?.tags || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tags.");
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-surface-border/40 pb-5">
        <h1 className="text-xl font-extrabold tracking-tight text-surface-text sm:text-2xl flex items-center gap-2">
          <Tag className="h-6 w-6 text-brand-500" /> Tags
        </h1>
        <p className="mt-1.5 text-sm text-surface-muted">
          Filter questions using the tags listed below.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted" />
        <input
          type="search"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-surface-border bg-surface-card py-2.5 pl-10 pr-4 text-sm text-surface-text transition-all duration-150 placeholder:text-surface-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
        />
      </div>

      {/* States */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3">
              <div className="h-5 w-24 shimmer rounded-lg" />
              <div className="h-4 w-full shimmer rounded-lg" />
              <div className="h-4 w-5/6 shimmer rounded-lg" />
              <div className="h-4.5 w-16 shimmer rounded-lg pt-1" />
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
      ) : filteredTags.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center text-sm text-surface-muted">
          No matching tags found.
        </div>
      ) : (
        /* Tags Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTags.map((tag) => (
            <Link
              key={tag.name}
              to={`/?tag=${encodeURIComponent(tag.name)}`}
              className="group rounded-2xl border border-surface-border bg-surface-card p-5 shadow-sm transition-all duration-150 hover:border-brand-500/30 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block rounded-lg border border-brand-100 bg-brand-50/50 dark:border-brand-500/10 dark:bg-brand-500/5 px-2.5 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-500/15 transition-all">
                  #{tag.name}
                </span>
                <p className="mt-3 text-xs leading-relaxed text-surface-muted line-clamp-3">
                  {tag.description}
                </p>
              </div>
              <div className="mt-4 pt-3.5 border-t border-surface-border/40 text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {tag.count} question{tag.count !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
