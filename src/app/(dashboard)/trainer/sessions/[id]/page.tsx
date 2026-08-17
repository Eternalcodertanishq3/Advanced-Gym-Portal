import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, FileText } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PTSessionDetailPage({ params }: PageProps) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "TRAINER" &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const ptSession = await prisma.pTSession.findUnique({
    where: { id },
    include: {
      member: {
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          subscription: { include: { plan: true } },
        },
      },
    },
  });

  if (!ptSession) {
    notFound();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6 p-6">
      <div>
        <Link href="/trainer/sessions">
          <Button variant="ghost" size="sm" className="mb-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sessions
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Personal Training Session Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={ptSession.status === "COMPLETED" ? "default" : "secondary"}>
              {ptSession.status}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              ID: {ptSession.id.slice(0, 8)}
            </span>
          </div>
          <CardTitle className="mt-2 text-xl">
            Client: {ptSession.member.user.firstName} {ptSession.member.user.lastName}
          </CardTitle>
          <CardDescription>
            {ptSession.member.user.email} • {ptSession.member.user.phone || "No phone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Date: {new Date(ptSession.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                Time: {ptSession.startTime} - {ptSession.endTime}
              </span>
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Session Notes & Focus
            </div>
            <p className="text-sm">
              {ptSession.notes || "Standard Hypertrophy / Conditioning Session"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
