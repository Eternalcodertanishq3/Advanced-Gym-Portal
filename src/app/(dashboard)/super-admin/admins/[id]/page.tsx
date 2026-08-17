import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, Building2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SuperAdminAdminDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/auth/login");
  }

  const { id } = await params;
  const admin = await prisma.user.findUnique({
    where: { id },
    include: { branch: true },
  });

  if (!admin) {
    notFound();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <Link href="/super-admin/admins">
          <Button variant="ghost" size="sm" className="mb-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Admins
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Admin Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={admin.status === "ACTIVE" ? "default" : "secondary"}>
              {admin.status}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">Role: {admin.role}</span>
          </div>
          <CardTitle className="mt-2 text-xl">
            {admin.firstName} {admin.lastName}
          </CardTitle>
          <CardDescription>{admin.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 border-t pt-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Phone: {admin.phone || "No phone registered"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Assigned Branch: {admin.branch?.name || "All Branches"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
