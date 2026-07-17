import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    let reportPayload: any = null;

    if (
      contentType?.includes("application/csp-report") ||
      contentType?.includes("application/json")
    ) {
      const text = await req.text();
      try {
        const body = JSON.parse(text);
        reportPayload = body["csp-report"] || body;
      } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    if (reportPayload) {
      // Safe sanitization and validation of fields to prevent log injection
      const blockedUri = String(reportPayload["blocked-uri"] || "").replace(/[\r\n]/g, "");
      const violatedDirective = String(reportPayload["violated-directive"] || "").replace(
        /[\r\n]/g,
        "",
      );
      const originalPolicy = String(reportPayload["original-policy"] || "").replace(/[\r\n]/g, "");
      const documentUri = String(reportPayload["document-uri"] || "").replace(/[\r\n]/g, "");

      console.warn("Content-Security-Policy (CSP) Violation Detected:", {
        blockedUri,
        violatedDirective,
        documentUri,
        originalPolicy,
      });

      // Integrate with Datadog, Sentry, or custom alerting service here
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("CSP report ingestion failure:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
