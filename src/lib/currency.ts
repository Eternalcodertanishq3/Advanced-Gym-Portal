import { getTenantDetailsSync } from "@/lib/tenant";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Dynamic Multi-Currency Utility
// ═══════════════════════════════════════════════════════════════

export function formatCurrency(
  amount: number | string | null | undefined,
  options: { showSymbol?: boolean; decimals?: number; currency?: string; locale?: string } = {},
): string {
  // Dynamically resolve tenant settings from active headers
  const tenant = getTenantDetailsSync();

  const {
    showSymbol = true,
    decimals = 2,
    currency = tenant.currency,
    locale = tenant.locale,
  } = options;

  if (amount === null || amount === undefined || amount === "") {
    if (!showSymbol) return "0.00";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(0);
    } catch {
      return `0.00`;
    }
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    if (!showSymbol) return "0.00";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(0);
    } catch {
      return `0.00`;
    }
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showSymbol ? "currency" : "decimal",
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const formatted = formatter.format(Math.abs(num));
    return num < 0 ? `-${formatted}` : formatted;
  } catch (error) {
    // Graceful fallback for invalid locales/currencies
    const fallbackFormatter = new Intl.NumberFormat("en-US", {
      style: showSymbol ? "currency" : "decimal",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const formatted = fallbackFormatter.format(Math.abs(num));
    return num < 0 ? `-${formatted}` : formatted;
  }
}

export function parseCurrency(amountStr: string): number {
  return parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));
}

export function formatNumber(
  num: number | string | null | undefined,
  decimals: number = 0,
  options: { locale?: string } = {},
): string {
  const tenant = getTenantDetailsSync();
  const { locale = tenant.locale } = options;

  if (num === null || num === undefined || num === "") return "0";
  const number = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(number)) return "0";

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  } catch {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  }
}
