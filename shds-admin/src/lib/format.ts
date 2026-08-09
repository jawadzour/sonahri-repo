import { format, parseISO } from "date-fns";

export function formatDate(value?: string | null, pattern = "d MMM yyyy"): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), pattern);
  } catch {
    return value;
  }
}

export function formatDateTime(value?: string | null): string {
  return formatDate(value, "d MMM yyyy, h:mm a");
}

export function formatCurrency(amount: number | string, currency = "PKR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(num)) return String(amount);
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num);
}

export function truncate(text: string | null | undefined, max = 60): string {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
