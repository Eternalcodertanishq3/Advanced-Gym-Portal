import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Production Health & Telemetry API
// Real-time latency probe, memory heap telemetry, and database ping
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Database Connection & Latency Probe
    await prisma.$queryRawUnsafe("SELECT 1;");
    const dbLatencyMs = Date.now() - startTime;

    // 2. Memory Heap Usage
    const memoryUsage = process.memoryUsage();
    const memoryStats = {
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    };

    return NextResponse.json(
      {
        status: "HEALTHY",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        database: {
          status: "CONNECTED",
          latencyMs: dbLatencyMs,
        },
        memory: memoryStats,
        environment: process.env.NODE_ENV || "development",
        version: "2.0.0-production",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Response-Time-Ms": dbLatencyMs.toString(),
        },
      },
    );
  } catch (error: unknown) {
    const errorLatencyMs = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "UNHEALTHY",
        timestamp: new Date().toISOString(),
        database: {
          status: "DISCONNECTED",
          latencyMs: errorLatencyMs,
          error: error instanceof Error ? error.message : "Database probe failed",
        },
      },
      { status: 503 },
    );
  }
}
