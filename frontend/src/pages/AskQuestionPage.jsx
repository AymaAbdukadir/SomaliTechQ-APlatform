import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../api/questions";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function AskQuestionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const { data } = await createQuestion({
        title: title.trim(),
        body: body.trim(),
        tags,
      });
      navigate(`/questions/${data.data.question._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create question. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in duration-200">
      <h1 className="mb-6 text-xl font-extrabold text-surface-text sm:text-2xl">
        Ask a Question
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 shadow-sm"
      >
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Be concise and describe the essence of your question"
          maxLength={200}
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-surface-text">
            Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Enter the details of your question. You can use Markdown with code snippets..."
            className="w-full resize-y rounded-xl border border-surface-border bg-surface-bg px-3.5 py-3 text-sm leading-relaxed text-surface-text transition-all duration-150 placeholder:text-surface-muted hover:border-surface-border/80 focus:border-brand-500 focus:bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <Input
          label="Tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. react, nodejs, mongodb (comma separated)"
        />

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Question"}
          </Button>
        </div>
      </form>
    </div>
  );
}
