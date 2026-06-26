import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Bookmark } from "lucide-react";
import Avatar from "../ui/Avatar";
import TagBadge from "./TagBadge";
import { excerpt, timeAgo } from "../../utils/formatTime";

export default function QuestionCard({ question }) {
  const answerCount = question.answers?.length ?? 0;
  const isUpvoted = question.votes > 0;

  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_questions") || "[]");
      return saved.includes(question._id);
    } catch {
      return false;
    }
  });

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("saved_questions") || "[]");
      let updated;
      if (saved.includes(question._id)) {
        updated = saved.filter((id) => id !== question._id);
        setIsSaved(false);
      } else {
        updated = [...saved, question._id];
        setIsSaved(true);
      }
      localStorage.setItem("saved_questions", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className="group relative rounded-2xl border border-surface-border bg-surface-card p-5 transition-all duration-200 hover:border-brand-500/30 hover:shadow-md sm:p-6">
      {/* Solved marker bar */}
      {question.isSolved && (
        <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-emerald-500" />
      )}

      <div className="flex items-start gap-5">
        {/* SIDE COUNTERS (Desktop Only) */}
        <div className="hidden shrink-0 flex-col gap-2.5 sm:flex">
          {/* Votes Counter */}
          <div
            className={`flex min-w-[3.75rem] flex-col items-center rounded-xl border py-2 text-center transition-all duration-150 ${
              isUpvoted
                ? "border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400"
                : "border-surface-border bg-surface-bg/50"
            }`}
          >
            <ThumbsUp className={`mb-1 h-4 w-4 ${isUpvoted ? "text-brand-500" : "text-surface-muted"}`} />
            <span className={`text-sm font-bold ${isUpvoted ? "text-brand-600 dark:text-brand-400" : "text-surface-text"}`}>
              {question.votes}
            </span>
            <span className="text-[9px] font-semibold text-surface-muted uppercase tracking-wider">votes</span>
          </div>

          {/* Answers Counter */}
          <div
            className={`flex min-w-[3.75rem] flex-col items-center rounded-xl border py-2 text-center transition-all duration-150 ${
              question.isSolved
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                : answerCount > 0
                ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                : "border-surface-border bg-surface-bg/50"
            }`}
          >
            {question.isSolved ? (
              <CheckCircle2 className="mb-1 h-4 w-4 text-emerald-500" />
            ) : (
              <MessageSquare className={`mb-1 h-4 w-4 ${answerCount > 0 ? "text-amber-500" : "text-surface-muted"}`} />
            )}
            <span
              className={`text-sm font-bold ${
                question.isSolved ? "text-emerald-600 dark:text-emerald-400" : answerCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-surface-text"
              }`}
            >
              {answerCount}
            </span>
            <span className="text-[9px] font-semibold text-surface-muted uppercase tracking-wider">answers</span>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="min-w-0 flex-1">
          {/* HEADER: Author Info & time */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-surface-muted">
              <Avatar name={question.author?.name} size="sm" />
              <span className="font-bold text-surface-text hover:text-brand-500 transition-colors cursor-pointer">
                {question.author?.name || ""}
              </span>
              <span className="text-surface-border">·</span>
              <time dateTime={question.createdAt} className="text-surface-muted">
                {timeAgo(question.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-2">
              {/* Solved Badge */}
              {question.isSolved && (
                <span className="hidden items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:flex">
                  <CheckCircle2 className="h-3 w-3" /> Solved
                </span>
              )}
              {/* Bookmark Toggle */}
              <button
                type="button"
                onClick={toggleBookmark}
                className="rounded-lg p-1.5 text-surface-muted transition-colors duration-150 hover:bg-surface-bg hover:text-surface-text"
                aria-label="Save question"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-brand-500 text-brand-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* MOBILE COUNTERS */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:hidden">
            <span className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-semibold ${
              isUpvoted ? "border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400" : "border-surface-border bg-surface-bg text-surface-muted"
            }`}>
              {question.votes} votes
            </span>
            <span className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-semibold ${
              question.isSolved ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : answerCount > 0 ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400" : "border-surface-border bg-surface-bg text-surface-muted"
            }`}>
              {answerCount} answers
            </span>
          </div>

          {/* QUESTION TITLE */}
          <Link
            to={`/questions/${question._id}`}
            className="mb-1.5 block text-base font-bold leading-snug text-surface-text transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-500 sm:text-lg"
          >
            {question.title}
          </Link>

          {/* QUESTION BODY EXCERPT */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-surface-muted">
            {excerpt(question.body)}
          </p>

          {/* FOOTER: Tags & Views Counter */}
          <div className="flex flex-col gap-3 pt-2.5 border-t border-surface-border/40 sm:flex-row sm:items-center sm:justify-between">
            {question.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}

            {/* Views counter */}
            <div className="flex items-center gap-1.5 text-xs text-surface-muted self-end sm:self-center">
              <Eye className="h-3.5 w-3.5" />
              <span>{question.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}