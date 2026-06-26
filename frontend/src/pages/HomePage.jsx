import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllQuestions } from "../api/questions";
import QuestionList from "../components/questions/QuestionList";
import { QuestionCardSkeleton } from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import { ChevronLeft, ChevronRight, XCircle, AlertCircle, RefreshCw, SlidersHorizontal } from "lucide-react";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterTab, setFilterTab] = useState("all"); // all, solved, unsolved
  const [sortBy, setSortBy] = useState("newest"); // newest, popular

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  const clearFilters = () => {
    setSearchParams({});
    setFilterTab("all");
    setSortBy("newest");
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      setLoading(true);
      setError("");
      try {
        const { data } = await getAllQuestions({
          page,
          limit: 15,
          ...(search && { search }),
          ...(tag && { tag }),
        });
        if (!cancelled) {
          setQuestions(data?.data?.questions || data?.questions || []);
          setPagination(data?.pagination || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load questions.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, [page, search, tag]);

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    setSearchParams(params);
  };

  // Client-side filtering
  const filteredQuestions = questions.filter((q) => {
    if (filterTab === "solved") return q.isSolved;
    if (filterTab === "unsolved") return !q.isSolved;
    return true;
  });

  // Client-side sorting
  const displayQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "popular") {
      const aScore = a.votes + (a.views || 0);
      const bScore = b.votes + (b.views || 0);
      return bScore - aScore;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Dynamic Welcome Hero Section */}
      {!search && !tag && page === 1 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-800 p-6 text-white shadow-md sm:p-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-36 w-36 rounded-full bg-brand-500/10 blur-2xl" />
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-block rounded-lg bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider">
              Welcome 👋
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Join the Somali Tech Community!
            </h1>
            <p className="text-xs font-semibold text-brand-100 leading-relaxed sm:text-sm">
              Ask questions about software, help other developers, or explore new topics discussed on the platform.
            </p>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 border-b border-surface-border/40 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-surface-text sm:text-2xl">
            {tag ? (
              <span className="flex items-center gap-2">
                Tag: <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">#{tag}</span>
              </span>
            ) : search ? (
              "Search Results"
            ) : (
              "All Questions"
            )}
          </h1>
          
          {search && (
            <p className="mt-1.5 text-xs font-semibold text-surface-muted">
              Showing results for: <span className="font-bold text-surface-text">&ldquo;{search}&rdquo;</span>
            </p>
          )}
        </div>

        {/* Action tags count, Reset button */}
        <div className="flex flex-wrap items-center gap-2">
          {(tag || search || filterTab !== "all" || sortBy !== "newest") && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-surface-muted shadow-sm hover:bg-surface-bg hover:text-surface-text transition-all"
            >
              <XCircle className="h-3.5 w-3.5 text-surface-muted" />
              Clear Filters
            </button>
          )}

          {pagination && (
            <div className="rounded-xl bg-surface-bg border border-surface-border/50 px-3 py-1.5 text-[10px] font-bold text-surface-muted tracking-wider uppercase">
              {pagination.totalDocs} Questions
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs and Sort selector */}
      <div className="flex flex-col gap-3 justify-between sm:flex-row sm:items-center">
        <div className="flex border border-surface-border/50 bg-surface-card p-1 rounded-xl w-fit">
          {[
            { id: "all", label: "All" },
            { id: "solved", label: "Solved" },
            { id: "unsolved", label: "Unsolved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/10"
                  : "text-surface-muted hover:text-surface-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2 text-xs font-semibold text-surface-muted">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface-card px-2.5 py-1.5 text-xs font-bold text-surface-text focus:border-brand-500 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* ERROR HANDLING STATE */}
      {error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center shadow-sm">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm font-semibold text-red-800">{error}</p>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl border-red-200 bg-surface-card text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <QuestionCardSkeleton key={i} />
          ))}
        </div>
      ) : displayQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center text-sm text-surface-muted">
          No questions found in this section.
        </div>
      ) : (
        /* QUESTIONS LIST & PAGINATION */
        <>
          <QuestionList questions={displayQuestions} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-surface-border/40 pt-6">
              {/* Previous Button */}
              <Button
                variant="secondary"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => goToPage(page - 1)}
                className="disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              {/* Middle Page State Info */}
              <div className="rounded-xl bg-surface-bg px-4 py-2 text-xs font-bold text-surface-text border border-surface-border">
                Page {pagination.page} / {pagination.totalPages}
              </div>

              {/* Next Button */}
              <Button
                variant="secondary"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => goToPage(page + 1)}
                className="disabled:opacity-50"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}