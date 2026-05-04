import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MemberImportClient } from "./components/member-import-client";

export default async function MemberImportPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  const branchId = user.branchId;
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  if (!branchId && !isSuperAdmin) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-rose-500">No Branch Assigned</h1>
        <p className="text-muted-foreground">
          You must be assigned to a branch to import members.
        </p>
      </div>
    );
  }

  let branches: any[] = [];
  if (isSuperAdmin) {
    const res = await prisma.branch.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true }
    });
    branches = res;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Member <span className="text-brand-orange">Import</span>
        </h1>
        <p className="text-muted-foreground">
          Quickly scale your gym by importing your existing member database.
        </p>
      </div>

      <MemberImportClient branchId={branchId} branches={branches} />
    </div>
  );
}
