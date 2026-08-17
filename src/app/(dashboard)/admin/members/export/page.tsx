import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMembersExportPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login");
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/members">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Members
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Export Member Records & GDPR Archives</h1>
        <p className="text-sm text-muted-foreground">
          Download CSV and JSON data exports for compliance, accounting, and CRM backup.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
              Member Directory CSV
            </CardTitle>
            <CardDescription>
              Export active member list with contact details and plan info
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <a href="/api/export?type=members" download>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Member CSV
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              GDPR Data Portability Package
            </CardTitle>
            <CardDescription>
              Full structured JSON archive including subscriptions & logs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <a href="/api/export?type=full" download>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Full JSON Archive
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
