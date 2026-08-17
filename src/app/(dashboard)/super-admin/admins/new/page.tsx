import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SuperAdminCreateAdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <Link href="/super-admin/admins">
          <Button variant="ghost" size="sm" className="mb-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Gym Admins
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Onboard Gym Branch Administrator</h1>
        <p className="text-sm text-muted-foreground">
          Create credentials and assign gym branch ownership for a tenant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" />
            Admin Credentials
          </CardTitle>
          <CardDescription>
            Enter administrator details and email for dashboard invitation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Admin First Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Admin Last Name" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="admin@gymtenant.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
            </div>

            <div className="pt-2">
              <Button type="button" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Send Dashboard Invitation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
