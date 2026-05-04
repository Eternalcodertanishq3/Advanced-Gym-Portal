import { getMemberById } from "@/actions/admin/member-management-actions";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Mail, Phone, Calendar, Clock, Activity, Dumbbell, UserCheck } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/admin/members" className="flex items-center text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Members
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface-card border-surface-sunken">
            <Mail className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="bg-surface-card rounded-2xl p-6 md:p-8 border border-surface-sunken shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className={cn("w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-3xl md:text-5xl font-bold shrink-0", avatarColor)}>
          {initials}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display text-3xl font-bold text-obsidian-950">{name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-obsidian-600 text-sm">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
            {user.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {user.phone}</span>}
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {formatDate(member.joinDate)}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-surface-base text-obsidian-700 font-medium border-surface-sunken">
              {member.status}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 font-medium bg-brand-navy/10 text-brand-navy">
              Plan: {member.subscription?.plan?.name || "No Plan"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col - Subscription & Trainer */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-surface-card border-surface-sunken shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-orange" />
                Active Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.subscription ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-obsidian-950">{member.subscription.plan.name}</p>
                    <p className="text-xs text-obsidian-500 mt-1">{member.subscription.plan.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-surface-sunken">
                    <span className="text-obsidian-500">Expires On</span>
                    <span className="font-medium text-obsidian-900">{formatDate(member.subscription.endDate)}</span>
                  </div>
                  <Button className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 mt-2">
                    Renew Plan
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-obsidian-500 mb-4">No active subscription found.</p>
                  <Button variant="outline" className="w-full">Assign Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-surface-card border-surface-sunken shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-brand-orange" />
                Assigned Trainer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.trainer ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-sm font-bold text-obsidian-500">
                    {getInitials(member.trainer.user.firstName + ' ' + member.trainer.user.lastName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-obsidian-950">{member.trainer.user.firstName} {member.trainer.user.lastName}</p>
                    <p className="text-xs text-obsidian-500">{member.trainer.specialization}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-obsidian-500 mb-4">No trainer assigned.</p>
                  <Button variant="outline" className="w-full">Assign Trainer</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Activity & Payments */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-surface-card border-surface-sunken shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-orange" />
                  Recent Check-ins
                </CardTitle>
                <CardDescription>Last 5 attendance records</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {member.attendance && member.attendance.length > 0 ? (
                <div className="space-y-4">
                  {member.attendance.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-base border border-surface-sunken">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-obsidian-400" />
                        <span className="text-sm font-medium text-obsidian-900">{formatDate(record.date)}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        record.status === "PRESENT" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-obsidian-500 py-4 text-center">No attendance records found.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-surface-card border-surface-sunken shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-orange" />
                  Recent Payments
                </CardTitle>
                <CardDescription>Last 5 transaction records</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-orange hover:text-brand-orange/80">View All</Button>
            </CardHeader>
            <CardContent>
              {member.payments && member.payments.length > 0 ? (
                <div className="space-y-4">
                  {member.payments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-base border border-surface-sunken">
                      <div>
                        <p className="text-sm font-medium text-obsidian-950">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-obsidian-500 mt-0.5">{payment.description || "Membership Fee"}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-surface-card text-obsidian-600 border-surface-sunken mb-1">
                          {payment.method}
                        </Badge>
                        <p className="text-xs text-obsidian-400">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-obsidian-500 py-4 text-center">No payment history found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}