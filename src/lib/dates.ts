import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function formatDate(
  date: Date | string | number | null | undefined,
  pattern: string = "dd MMM yyyy"
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : typeof date === "number" ? new Date(date) : date;
  if (!isValid(d)) return "-";
  return format(d, pattern);
}

export function formatRelative(date: Date | string | number | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : typeof date === "number" ? new Date(date) : date;
  if (!isValid(d)) return "-";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function isUpcoming(date: Date | string): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) && d > new Date();
}

export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
