import { Link } from "react-router-dom";

export default function TagBadge({ tag }) {
  return (
    <Link
      to={`/?tag=${encodeURIComponent(tag)}`}
      className="inline-flex rounded-lg border border-brand-100 bg-brand-50/50 dark:border-brand-500/10 dark:bg-brand-500/5 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400 transition-all duration-150 hover:border-brand-200 hover:bg-brand-100 dark:hover:bg-brand-500/15"
    >
      #{tag}
    </Link>
  );
}
