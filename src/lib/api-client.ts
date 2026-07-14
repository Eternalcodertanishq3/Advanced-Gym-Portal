export const API_ROUTES = {
  MEMBERS: "/api/members",
  TRAINERS: "/api/trainers",
  PAYMENTS: "/api/payments",
  CLASSES: "/api/classes",
};

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("API Error");
  }
  return res.json();
}
