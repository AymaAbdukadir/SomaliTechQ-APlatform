export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 select-none";

  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 border border-brand-600 shadow-sm shadow-brand-600/10 active:scale-98",
    secondary:
      "bg-surface-card text-surface-text hover:bg-surface-bg border border-surface-border",
    ghost: "bg-transparent text-surface-muted hover:bg-surface-bg hover:text-surface-text border border-transparent",
    danger:
      "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20 dark:text-red-400 dark:border-red-500/30",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4.5 py-2.5 text-sm",
    lg: "px-5.5 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
