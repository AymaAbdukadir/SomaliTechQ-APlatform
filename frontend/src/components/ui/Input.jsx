export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-surface-text">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border bg-surface-bg px-3.5 py-2.5 text-sm text-surface-text transition-all duration-150 placeholder:text-surface-muted focus:border-brand-500 focus:bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-surface-border hover:border-surface-border/80"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
