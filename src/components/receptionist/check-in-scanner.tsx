"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Search, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { checkInMember } from "@/actions/admin/attendance-actions";

export function CheckInScanner({ isKiosk = false }: { isKiosk?: boolean }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; name?: string } | null>(
    null,
  );

  const handleManualScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await checkInMember(query.trim());
      if (res.success) {
        setResult({
          success: true,
          message: "Check-in verified successfully. Turnstile gate opened.",
        });
        setQuery("");
      } else {
        setResult({
          success: false,
          message: res.error || "Turnstile scan failed or membership is inactive.",
        });
      }
    } catch (err) {
      setResult({ success: false, message: "Network or server connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={isKiosk ? "border-0 bg-transparent shadow-none" : ""}>
      <CardHeader className={isKiosk ? "px-0 pt-0" : ""}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode className="h-5 w-5 text-primary" />
          Turnstile Desk Scanner
        </CardTitle>
        <CardDescription>Enter Member ID, Passcode, or Scan QR Code</CardDescription>
      </CardHeader>
      <CardContent className={isKiosk ? "space-y-4 px-0" : "space-y-4"}>
        <form onSubmit={handleManualScan} className="flex gap-2">
          <Input
            placeholder="Scan QR or enter Member ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="font-mono text-sm"
          />
          <Button type="submit" disabled={loading || !query.trim()} className="shrink-0 gap-2">
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Verify
          </Button>
        </form>

        {result && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              result.success
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div className="text-sm">
              <p className="font-semibold">{result.success ? "Access Granted" : "Access Denied"}</p>
              <p className="mt-0.5 text-xs">{result.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
