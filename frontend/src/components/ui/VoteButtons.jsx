import { ChevronDown, ChevronUp } from "lucide-react";

export default function VoteButtons({
  votes,
  onUpvote,
  onDownvote,
  disabled = false,
  size = "md",
}) {
  const isSm = size === "sm";

  return (
    <div
      className={`flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 ${
        isSm ? "gap-0.5 px-1.5 py-1" : "gap-1 px-2 py-2"
      }`}
    >
      <button
        type="button"
        onClick={onUpvote}
        disabled={disabled}
        aria-label="Upvote"
        className="rounded p-0.5 text-slate-500 transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronUp className={isSm ? "h-4 w-4" : "h-5 w-5"} />
      </button>
      <span
        className={`font-semibold text-slate-800 ${isSm ? "text-sm" : "text-base"}`}
      >
        {votes}
      </span>
      <button
        type="button"
        onClick={onDownvote}
        disabled={disabled}
        aria-label="Downvote"
        className="rounded p-0.5 text-slate-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronDown className={isSm ? "h-4 w-4" : "h-5 w-5"} />
      </button>
    </div>
  );
}
