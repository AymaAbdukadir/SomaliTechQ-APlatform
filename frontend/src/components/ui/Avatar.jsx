const gradients = [
  "from-indigo-500 to-purple-600 text-white",
  "from-blue-500 to-cyan-500 text-white",
  "from-emerald-400 to-teal-600 text-white",
  "from-violet-500 to-fuchsia-600 text-white",
  "from-pink-500 to-rose-500 text-white",
  "from-amber-500 to-orange-600 text-white",
  "from-rose-500 to-red-600 text-white",
  "from-teal-500 to-cyan-600 text-white",
];

const getGradient = (str) => {
  let hash = 0;
  if (str) {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export default function Avatar({ name, size = "md" }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  const gradientClass = getGradient(name);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold shadow-sm ${gradientClass} ${sizes[size]}`}
      title={name}
    >
      {initials}
    </div>
  );
}
