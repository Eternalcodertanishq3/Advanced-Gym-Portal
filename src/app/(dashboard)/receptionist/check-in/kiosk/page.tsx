import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CheckInScanner } from "@/components/receptionist/check-in-scanner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReceptionistKioskPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "RECEPTIONIST" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 p-6 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-emerald-400" />
          <span className="text-xl font-bold uppercase tracking-wider text-slate-200">
            GymFlow Turnstile Kiosk
          </span>
        </div>
        <Link href="/receptionist/check-in">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Exit Kiosk
          </Button>
        </Link>
      </div>

      {/* Main Scanner Container */}
      <div className="mx-auto w-full max-w-xl py-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="mb-1 text-2xl font-bold text-white">Scan Your Member QR Pass</h2>
            <p className="text-sm text-slate-400">
              Hold your dynamic QR code or digital turnstile card in front of the camera.
            </p>
          </div>
          <CheckInScanner isKiosk={true} />
        </div>
      </div>

      {/* Footer System Status */}
      <div className="text-center text-xs text-slate-500">
        Autonomous Turnstile Gate Controller • 60s Double-Scan Protection Active
      </div>
    </div>
  );
}
