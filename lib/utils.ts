export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(value);
}

export function formatDateTime(date: Date | string): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function formatRelativeTime(
  date: Date | string
): string {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Unknown";
  }

  const diff = Date.now() - value.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(value);
}

export function truncate(
  text: string,
  maxLength: number
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function capitalize(text: string): string {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercentage(
  value: number,
  decimals = 1
): string {
  return `${value.toFixed(decimals)}%`;
}

export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max);
}