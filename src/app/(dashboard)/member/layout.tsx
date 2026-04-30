import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/membership";
import { headers } from "next/headers";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role === "MEMBER") {
    const headersList = headers();
    const pathname = headersList.get("x-url") || "";

    const active = await hasActiveSubscription(session.user.id);
    
    // Redirect to plan selection if no active subscription
    // AND not already on the select-plan page
    if (!active && !pathname.includes("/member/select-plan")) {
      redirect("/member/select-plan");
    }
  }

  return <>{children}</>;
}
