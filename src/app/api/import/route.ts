import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bulkImportMembers, ImportMemberData } from "@/actions/admin/member-import-actions";
import Papa from "papaparse";
import { rateLimit } from "@/lib/rate-limit";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Secure Member CSV Import API
// ═══════════════════════════════════════════════════════════════

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = await rateLimit(`api:import:${ip}`, 3, 60);
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // 2. Auth Check
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const branchId = formData.get("branchId") as string;

    if (!file) {
      return NextResponse.json({ error: "Missing CSV file" }, { status: 400 });
    }
    
    if (!branchId) {
      return NextResponse.json({ error: "Missing target branchId" }, { status: 400 });
    }

    const csvText = await file.text();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0) {
      return NextResponse.json({ error: "CSV parsing error: " + parsed.errors[0].message }, { status: 400 });
    }

    const importData: ImportMemberData[] = parsed.data.map((row: any) => ({
      firstName: row["First Name"] || row["firstName"] || "",
      lastName: row["Last Name"] || row["lastName"] || "",
      email: row["Email Address"] || row["email"] || "",
      phone: row["Phone Number"] || row["phone"] || undefined,
      gender: row["Gender"] || undefined,
      dateOfBirth: row["Date of Birth"] || row["dateOfBirth"] || undefined,
      bloodGroup: row["Blood Group"] || row["bloodGroup"] || undefined,
      address: row["Address"] || row["address"] || undefined,
      city: row["City"] || undefined,
      state: row["State"] || undefined,
      pincode: row["Pincode"] || undefined,
    }));

    const result = await bulkImportMembers(importData, branchId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("CSV import endpoint failure:", error);
    return NextResponse.json({ error: error.message || "Failed to process import" }, { status: 500 });
  }
}
