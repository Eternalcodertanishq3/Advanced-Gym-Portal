import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddMemberClient } from "./components/new-member-client";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Add New Member (Server Wrapper)
// ═══════════════════════════════════════════════════════════════

export default async function AddMemberPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <AddMemberClient userRole={session.user.role} />;
}
