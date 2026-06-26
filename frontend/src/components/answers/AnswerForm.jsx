import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { createAnswer } from "../../api/answers";

export default function AnswerForm({ questionId, onSuccess }) {
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!body.trim()) {
      setError("Please write your answer before submitting.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await createAnswer(questionId, body.trim());
      setBody("");
      onSuccess?.(data.data.answer);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">
          Please{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            log in
          </Link>{" "}
          to post an answer.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 shadow-sm"
    >
      <h3 className="mb-3.5 text-sm font-extrabold text-surface-text uppercase tracking-wider">
        Your Answer
      </h3>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder="Write your answer here... You can use Markdown with code blocks."
        className="w-full resize-y rounded-xl border border-surface-border bg-surface-bg px-3.5 py-3 text-sm leading-relaxed text-surface-text transition-all duration-150 placeholder:text-surface-muted hover:border-surface-border/80 focus:border-brand-500 focus:bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={loading} className="rounded-xl shadow-sm">
          {loading ? "Posting..." : "Post Answer"}
        </Button>
      </div>
    </form>
  );
}
