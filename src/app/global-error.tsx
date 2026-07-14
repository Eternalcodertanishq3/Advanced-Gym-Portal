"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Global Error Boundary (catches root layout errors)
// ═══════════════════════════════════════════════════════════════

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Eagle Gym Global Error]:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F1117",
          color: "#FAFAF8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400, padding: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <AlertTriangle size={32} color="#ef4444" />
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Critical Error
          </h1>

          <p style={{ color: "#9CA3AF", marginBottom: 24, lineHeight: 1.6 }}>
            A critical error occurred. The application could not recover
            gracefully.
          </p>

          {error.digest && (
            <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 16 }}>
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
