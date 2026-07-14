import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Secure File Upload Endpoint
// ═══════════════════════════════════════════════════════════════

const ALLOWED_UPLOAD_TYPES = ["avatar", "document", "progress", "general"];

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = await rateLimit(`api:upload:${ip}`, 10, 60);
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // 2. Auth Check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const rawType = formData.get("type") as string || "general";

    // 3. Prevent path traversal & validate upload type
    const type = rawType.replace(/[^a-zA-Z0-9]/g, "");
    if (!ALLOWED_UPLOAD_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 5MB size limit" }, { status: 400 });
    }

    // Enforce allowed mime-types (Images and common PDF/docs)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WebP, PDF, or Word docs are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe, unique filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${type}_${Date.now()}_${sanitizedName}`;

    // Target upload directory
    const uploadDir = join(process.cwd(), "public", "uploads", type);
    
    // Ensure upload directory exists recursively
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      filename: filename,
      size: file.size,
      mimeType: file.type
    });
  } catch (error: any) {
    console.error("File upload endpoint failure:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
