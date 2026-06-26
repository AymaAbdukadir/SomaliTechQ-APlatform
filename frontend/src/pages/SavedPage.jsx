import { useState, useEffect } from "react";
import { Bookmark, RefreshCw, AlertCircle } from "lucide-react";
import { getAllQuestions } from "../api/questions";
import QuestionCard from "../components/questions/QuestionCard";
import { QuestionCardSkeleton } from "../components/ui/Skeleton";

export default function SavedPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedIds = (() => {
    try {
      return JSON.parse(localStorage.getItem("saved_questions") || "[]");
    } catch {
      return [];
    }
  })();

  useEffect(() => {
    if (savedIds.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    async function fetchSavedQuestions() {
      try {
        setLoading(true);
        setError("");
        // Query the API for the recent questions and filter by bookmarked IDs
        const { data } = await getAllQuestions({ limit: 100 });
        const list = data?.data?.questions || data?.questions || [];
        const filtered = list.filter((q) => savedIds.includes(q._id));
        setQuestions(filtered);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load saved questions.");
      } finally {
        setLoading(false);
      }
    }

    fetchSavedQuestions();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-surface-border/40 pb-5">
        <h1 className="text-xl font-extrabold tracking-tight text-surface-text sm:text-2xl flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-brand-500" /> Saved Questions
        </h1>
        <p className="mt-1.5 text-sm text-surface-muted">
          Here you can find all the questions you have bookmarked for later reading.
        </p>
      </div>

      {/* States */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <QuestionCardSkeleton key={i} />
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
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card p-12 text-center text-sm text-surface-muted">
          No questions saved here. Add questions by clicking the bookmark icon on the question card.
        </div>
      ) : (
        /* Questions list */
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
