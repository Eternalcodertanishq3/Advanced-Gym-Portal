import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReceptionistWalkInPage() {
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
    <div className="flex max-w-4xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quick Walk-In Registration</h1>
        <p className="text-sm text-muted-foreground">
          Fast desk onboarding for new trial walk-in clients and guest consultations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-primary" />
            Walk-In Information
          </CardTitle>
          <CardDescription>
            Instant registration with auto-generated welcome SMS and visitor pass
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Visit Purpose / Interested Program</Label>
              <Input id="purpose" placeholder="e.g. Strength Training, Trial Pass, Weight Loss" />
            </div>

            <div className="pt-2">
              <Button type="button" className="w-full gap-2 sm:w-auto">
                <Sparkles className="h-4 w-4" />
                Issue 1-Day Trial Pass
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
