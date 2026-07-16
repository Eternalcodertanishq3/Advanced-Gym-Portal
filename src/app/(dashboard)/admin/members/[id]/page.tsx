import { getMemberById } from "@/actions/admin/member-management-actions";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  Dumbbell,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await getMemberById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const member = res.data;
  const user = member.user;
  const name = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Back to Members Navigation */}
      <div className="flex items-center">
        <Link
          href="/admin/members"
          className="flex items-center text-sm font-medium text-obsidian-500 transition-colors hover:text-obsidian-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Link>
      </div>

      {/* Main Profile Header */}
      <div className="flex flex-col gap-6 rounded-2xl border border-surface-sunken bg-surface-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div
            className={cn(
              "flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold md:h-32 md:w-32 md:text-5xl",
              avatarColor,
            )}
          >
            {initials}
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-display text-3xl font-bold text-obsidian-950">{name}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-obsidian-600 md:justify-start">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" /> {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Joined {formatDate(member.joinDate)}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Badge
                variant="outline"
                className="border-surface-sunken bg-surface-base px-3 py-1 font-medium text-obsidian-700"
              >
                {member.status}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-brand-navy/10 px-3 py-1 font-medium text-brand-navy"
              >
                Plan: {member.subscription?.plan?.name || "No Plan"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="flex items-center justify-center gap-2 md:self-start">
          <a href={`mailto:${user.email}`} className="inline-block">
            <Button variant="outline" className="border-surface-sunken bg-surface-card">
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
          </a>
          <Link href={`/admin/members/${member.id}/edit`}>
            <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Col 1 - Subscription & Trainer */}
        <div className="space-y-6">
          <Card className="border-surface-sunken bg-surface-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-brand-orange" />
                Active Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.subscription ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-obsidian-950">
                      {member.subscription.plan.name}
                    </p>
                    <p className="mt-1 text-xs text-obsidian-500">
                      {member.subscription.plan.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-surface-sunken pt-4 text-sm">
                    <span className="text-obsidian-500">Expires On</span>
                    <span className="font-medium text-obsidian-900">
                      {formatDate(member.subscription.endDate)}
                    </span>
                  </div>
                  {(() => {
                    const isExpired = new Date(member.subscription.endDate) < new Date();
                    const daysToExpiry = Math.ceil(
                      (new Date(member.subscription.endDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    );
                    const canRenew = isExpired || (daysToExpiry >= 0 && daysToExpiry <= 30);
                    return (
                      <>
                        <Button
                          disabled={!canRenew}
                          className="mt-2 w-full bg-brand-navy text-white hover:bg-brand-navy/90"
                        >
                          Renew Plan
                        </Button>
                        {!canRenew && (
                          <p className="text-center text-[10px] text-obsidian-400">
                            Renewal option opens 30 days before expiration.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="mb-4 text-sm text-obsidian-500">No active subscription found.</p>
                  <Button variant="outline" className="w-full">
                    Assign Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-surface-sunken bg-surface-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Dumbbell className="h-5 w-5 text-brand-orange" />
                Assigned Trainer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.trainer ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-sm font-bold text-obsidian-500">
                    {getInitials(
                      member.trainer.user.firstName + " " + member.trainer.user.lastName,
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-obsidian-950">
                      {member.trainer.user.firstName} {member.trainer.user.lastName}
                    </p>
                    <p className="text-xs text-obsidian-500">{member.trainer.specialization}</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="mb-4 text-sm text-obsidian-500">No trainer assigned.</p>
                  <Link href={`/admin/members/${member.id}/edit`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Assign Trainer
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Col 2 - Activity */}
        <div className="space-y-6">
          <Card className="h-full border-surface-sunken bg-surface-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="h-5 w-5 text-brand-orange" />
                  Recent Check-ins
                </CardTitle>
                <CardDescription>Last 5 attendance records</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {member.attendance && member.attendance.length > 0 ? (
                <div className="space-y-4">
                  {member.attendance.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-xl border border-surface-sunken bg-surface-base p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-obsidian-400" />
                        <span className="text-sm font-medium text-obsidian-900">
                          {formatDate(record.date)}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          record.status === "PRESENT"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700",
                        )}
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-obsidian-500">
                  No attendance records found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Col 3 - Payments */}
        <div className="space-y-6">
          <Card className="h-full border-surface-sunken bg-surface-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-brand-orange" />
                  Recent Payments
                </CardTitle>
                <CardDescription>Last 5 transaction records</CardDescription>
              </div>
              <Link href={`/admin/payments?search=${encodeURIComponent(user.email || "")}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-orange hover:text-brand-orange/80"
                >
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {member.payments && member.payments.length > 0 ? (
                <div className="space-y-4">
                  {member.payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-xl border border-surface-sunken bg-surface-base p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-obsidian-950">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="mt-0.5 text-xs text-obsidian-500">
                          {payment.description || "Membership Fee"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="mb-1 border-surface-sunken bg-surface-card text-obsidian-600"
                        >
                          {payment.method}
                        </Badge>
                        <p className="text-xs text-obsidian-400">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-obsidian-500">
                  No payment history found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
