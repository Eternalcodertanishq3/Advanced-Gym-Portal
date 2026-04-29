export function formatCurrency(
  amount: number | string | null | undefined,
  options: { showSymbol?: boolean; decimals?: number; currency?: string } = {}
): string {
  const { showSymbol = true, decimals = 2, currency = "INR" } = options;
  
  if (amount === null || amount === undefined || amount === "") return showSymbol ? "₹0.00" : "0.00";
  
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return showSymbol ? "₹0.00" : "0.00";

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(Math.abs(num));
  return num < 0 ? `-${formatted}` : formatted;
}


export function parseCurrency(amountStr: string): number {
  return parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));
}

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
