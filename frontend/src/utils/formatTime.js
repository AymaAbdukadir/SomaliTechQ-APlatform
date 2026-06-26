import { formatDistanceToNow } from "date-fns";

export function timeAgo(date) {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function excerpt(text, maxLength = 160) {
  if (!text) return "";
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}
