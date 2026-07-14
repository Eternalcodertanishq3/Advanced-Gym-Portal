import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Merge Tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Indian standard
 */
export function formatDate(
  date: Date | string | number,
  pattern: string = "dd MMM yyyy"
): string {
  if (!date) return "-";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return format(d, pattern);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelative(date: Date | string | number): string {
  if (!date) return "-";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format number to currency dynamically based on locale/settings
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: { showSymbol?: boolean; decimals?: number; currency?: string; locale?: string } = {}
): string {
  const { showSymbol = true, decimals = 2 } = options;
  
  let currencyCode = options.currency || "INR";
  let locale = options.locale || (currencyCode === "INR" ? "en-IN" : "en-US");

  // Client-side fallback to stored tenant config
  if (typeof window !== "undefined" && !options.currency) {
    try {
      const stored = localStorage.getItem("gymflow-currency");
      if (stored) {
        currencyCode = stored;
        locale = currencyCode === "INR" ? "en-IN" : (currencyCode === "EUR" ? "de-DE" : "en-US");
      }
    } catch {
      // safe fallback
    }
  }

  const symbolMap: Record<string, string> = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };
  const symbol = symbolMap[currencyCode] || "$";

  if (amount === null || amount === undefined || amount === "") {
    return showSymbol ? `${symbol}0.00` : "0.00";
  }
  
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return showSymbol ? `${symbol}0.00` : "0.00";
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showSymbol ? "currency" : "decimal",
      currency: currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return formatter.format(num);
  } catch {
    const formattedNum = num.toFixed(decimals);
    return showSymbol ? `${symbol}${formattedNum}` : formattedNum;
  }
}

/**
 * Format number with Indian separators (1,24,500)
 */
export function formatNumber(
  num: number | string | null | undefined,
  decimals: number = 0
): string {
  if (num === null || num === undefined || num === "") return "0";
  
  const number = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number = 50): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Delay promise (for loaders, animations)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if value is empty (null, undefined, "", [], {})
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Get initials from name (e.g., "Rahul Patel" -> "RP")
 */
export function getInitials(name: string): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get avatar color based on name (consistent colors)
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "bg-brand-orange/10 text-brand-orange",
    "bg-blue-500/10 text-blue-500",
    "bg-emerald-500/10 text-emerald-500",
    "bg-purple-500/10 text-purple-500",
    "bg-rose-500/10 text-rose-500",
    "bg-amber-500/10 text-amber-500",
    "bg-indigo-500/10 text-indigo-500",
    "bg-cyan-500/10 text-cyan-500",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * File size formatter
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate a random OTP
 */
export function generateOTP(length: number = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

/**
 * Mask phone number (e.g., +91 98xxx xxxxx)
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  const visible = phone.slice(-4);
  const masked = phone.slice(0, -4).replace(/\d/g, "x");
  return masked + visible;
}

/**
 * Mask email (e.g., r****@gmail.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  const maskedLocal = local[0] + "*".repeat(local.length - 1);
  return `${maskedLocal}@${domain}`;
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse CSV safely
 */
export function parseCSV(text: string): string[][] {
  const lines = text.trim().split("\n");
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

/**
 * Slugify text (for URLs)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * Get greeting based on time
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}