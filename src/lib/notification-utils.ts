export function getNotificationIcon(type: string): string {
  switch (type) {
    case "PAYMENT":
      return "CreditCard";
    case "SYSTEM":
      return "Bell";
    case "SESSION":
      return "Calendar";
    default:
      return "Bell";
  }
}

export function formatNotificationTime(date: Date): string {
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day",
  );
}
