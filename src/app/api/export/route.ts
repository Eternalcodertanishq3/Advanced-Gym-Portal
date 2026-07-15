import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Papa from "papaparse";
import { rateLimit } from "@/lib/rate-limit";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Secure Member CSV Export API
// ═══════════════════════════════════════════════════════════════

export async function GET(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = await rateLimit(`api:export:${ip}`, 5, 60);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // 2. Auth Check
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get("branchId");

    // Dynamic filtering matching admin context
    const whereClause: any = {};
    if (branchId && branchId !== "ALL") {
      whereClause.user = { branchId };
    }

    const members = (await prisma.member.findMany({
      where: whereClause,
      include: {
        user: {
          include: { branch: true },
        },
        subscription: {
          include: { plan: true },
        },
      },
      orderBy: { joinDate: "desc" },
    })) as any[];

    // Formulate CSV dataset
    const records = members.map((m) => ({
      "Member ID": m.id,
      "First Name": m.user.firstName,
      "Last Name": m.user.lastName,
      "Email Address": m.user.email,
      "Phone Number": m.user.phone || "N/A",
      Branch: m.user.branch?.name || "N/A",
      Gender: m.gender || "N/A",
      "Date of Birth": m.dateOfBirth ? m.dateOfBirth.toISOString().split("T")[0] : "N/A",
      "Blood Group": m.bloodGroup || "N/A",
      "Join Date": m.joinDate.toISOString().split("T")[0],
      "Subscription Status": m.subscription?.status || "NO_SUBSCRIPTION",
      "Active Plan": m.subscription?.plan?.name || "N/A",
      Status: m.status,
    }));

    const csvContent = Papa.unparse(records);

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=gymflow_members_${Date.now()}.csv`,
      },
    });
  } catch (error: unknown) {
    console.error("Member export failure:", error);
    return NextResponse.json(
      {
        error:
          (error instanceof Error ? error.message : String(error)) ||
          "Failed to generate CSV export",
      },
      { status: 500 },
    );
  }
}
