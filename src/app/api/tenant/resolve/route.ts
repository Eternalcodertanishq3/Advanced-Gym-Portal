import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json({ error: "Missing subdomain" }, { status: 400 });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: {
        id: true,
        subdomain: true,
        saasStatus: true,
        name: true,
        logo: true,
        currency: true,
        locale: true,
      },
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Failed to resolve tenant:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
