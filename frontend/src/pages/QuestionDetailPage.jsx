import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, CheckCircle2, Trash2, Award } from "lucide-react";
import {
  getSingleQuestion,
  upvoteQuestion,
  downvoteQuestion,
  deleteQuestion,
} from "../api/questions";
import VoteButtons from "../components/ui/VoteButtons";
import Avatar from "../components/ui/Avatar";
import TagBadge from "../components/questions/TagBadge";
import AnswerCard from "../components/answers/AnswerCard";
import AnswerForm from "../components/answers/AnswerForm";
import MarkdownRenderer from "../components/ui/MarkdownRenderer";
import { QuestionDetailSkeleton } from "../components/ui/Skeleton";
import { timeAgo } from "../utils/formatTime";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuthor = question && String(user?._id) === String(question.author?._id);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getSingleQuestion(id);
      setQuestion(data.data.question);
      setVotes(data.data.question.votes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load question.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleVote = async (type) => {
    if (!isAuthenticated) return;
    try {
      const fn = type === "up" ? upvoteQuestion : downvoteQuestion;
      const { data } = await fn(id);
      setVotes(data.data.votes);
    } catch {
      /* vote errors handled silently */
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete the question.");
    }
  };

  const handleNewAnswer = (answer) => {
    setQuestion((prev) => ({
      ...prev,
      answers: [...(prev.answers || []), answer],
    }));
  };

  if (loading) return <QuestionDetailSkeleton />;

  if (error || !question) {
    return (
      <div className="rounded-2xl border border-red-500/10 bg-red-500/5 px-6 py-12 text-center">
        <p className="text-red-500 font-bold">{error || "Question not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in duration-200">
      {/* Question thread */}
      <article className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 relative overflow-hidden shadow-sm">
        {question.isSolved && (
          <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {question.isSolved && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Solved
              </span>
            )}
            {question.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>

          {/* Author Action buttons */}
          {isAuthor && (
            <Button
              variant="danger"
              size="sm"
              className="rounded-lg py-1 px-2.5 text-xs flex items-center gap-1 hover:bg-red-500/20"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
        </div>

        <div className="flex gap-4 sm:gap-5">
          <VoteButtons
            votes={votes}
            onUpvote={() => handleVote("up")}
            onDownvote={() => handleVote("down")}
            disabled={!isAuthenticated}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <h1 className="text-lg font-extrabold leading-snug text-surface-text sm:text-2xl">
              {question.title}
            </h1>

            {/* Renders dynamic Markdown & Code Blocks */}
            <div className="border-t border-surface-border/40 pt-3">
              <MarkdownRenderer content={question.body} />
            </div>

            {/* Metadata details */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/40 pt-4 text-xs text-surface-muted">
              <div className="flex items-center gap-1.5 font-semibold">
                <Eye className="h-4 w-4" />
                <span>{question.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar name={question.author?.name} size="sm" />
                <span className="font-bold text-surface-text">
                  {question.author?.name}
                </span>
                <span className="text-surface-border">·</span>
                <time dateTime={question.createdAt}>
                  {timeAgo(question.createdAt)}
                </time>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Answers List */}
      <section>
        <h2 className="mb-4 text-base font-extrabold text-surface-text">
          {question.answers?.length ?? 0} Answer
          {(question.answers?.length ?? 0) !== 1 ? "s" : ""}
        </h2>
        <div className="space-y-4">
          {question.answers?.map((answer) => (
            <AnswerCard
              key={answer._id}
              answer={answer}
              question={question}
              onAccept={fetchQuestion}
            />
          ))}
          {!question.answers?.length && (
            <div className="rounded-2xl border border-dashed border-surface-border bg-surface-card px-6 py-12 text-center text-sm text-surface-muted">
              No answers yet. Be the first to help!
            </div>
          )}
        </div>
      </section>

      {/* Answer Form */}
      <AnswerForm questionId={question._id} onSuccess={handleNewAnswer} />
    </div>
  );
}
