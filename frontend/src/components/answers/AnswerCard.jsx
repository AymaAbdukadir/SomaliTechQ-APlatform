import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import VoteButtons from "../ui/VoteButtons";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { timeAgo } from "../../utils/formatTime";
import { useAuth } from "../../context/AuthContext";
import { upvoteAnswer, downvoteAnswer } from "../../api/answers";
import { acceptAnswer } from "../../api/questions";
import MarkdownRenderer from "../ui/MarkdownRenderer";

export default function AnswerCard({ answer, question, onAccept }) {
  const { isAuthenticated, user } = useAuth();
  const [votes, setVotes] = useState(answer.votes);
  const [accepting, setAccepting] = useState(false);

  const isAuthor = String(user?._id) === String(question.author?._id);

  const handleVote = async (type) => {
    if (!isAuthenticated) return;
    try {
      const fn = type === "up" ? upvoteAnswer : downvoteAnswer;
      const { data } = await fn(answer._id);
      setVotes(data.data.answer.votes);
    } catch {
      /* vote errors handled silently */
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await acceptAnswer(question._id, answer._id);
      onAccept?.();
    } catch {
      /* accept errors handled silently */
    } finally {
      setAccepting(false);
    }
  };

  return (
    <article
      className={`rounded-2xl border bg-surface-card p-5 sm:p-6 transition-all duration-150 ${
        answer.isAccepted
          ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
          : "border-surface-border"
      }`}
    >
      <div className="flex gap-4">
        <VoteButtons
          votes={votes}
          onUpvote={() => handleVote("up")}
          onDownvote={() => handleVote("down")}
          disabled={!isAuthenticated}
        />

        <div className="min-w-0 flex-1 space-y-3">
          {answer.isAccepted && (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Accepted Answer
            </div>
          )}

          {/* Answer details with Markdown & Syntax Highlighting */}
          <div className="border-t border-surface-border/20 pt-2.5">
            <MarkdownRenderer content={answer.body} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/20 pt-4">
            <div className="flex items-center gap-2 text-xs text-surface-muted">
              <Avatar name={answer.author?.name} size="sm" />
              <span className="font-bold text-surface-text">
                {answer.author?.name}
              </span>
              <span className="text-surface-border">·</span>
              <time dateTime={answer.createdAt}>
                {timeAgo(answer.createdAt)}
              </time>
            </div>

            {isAuthor && !answer.isAccepted && isAuthenticated && (
              <Button
                variant="secondary"
                size="sm"
                className="rounded-lg text-xs py-1.5 px-3 hover:bg-surface-bg flex items-center gap-1"
                onClick={handleAccept}
                disabled={accepting}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Accept Answer
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
