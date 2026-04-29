"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  CreditCard,
  MessageSquare,
  UserCheck,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Droplets,
  Ruler,
  Weight,
  Activity,
  Camera,
  TrendingUp,
  Award,
  Dumbbell,
  Utensils,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Snowflake,
  Clock3,
  Crown,
  Printer,
  Share2,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { cn, formatDate, formatCurrency, getInitials, getAvatarColor } from "@/lib/utils";
import { TIER_BADGE_COLORS } from "@/lib/constants";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Member Detail View
// ═══════════════════════════════════════════════════════════════

interface MemberDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "FROZEN" | "PENDING";
  tier: string;
  planName: string;
  planStart: string;
  planExpiry: string;
  trainerName?: string;
  trainerId?: string;
  joinDate: string;
  lastCheckIn?: string;
  totalCheckIns: number;
  pendingAmount?: number;
  gender: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  source?: string;
}

interface ProgressEntry {
  date: string;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  biceps?: number;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  type: string;
  status: string;
  receiptNo: string;
}

interface AttendanceEntry {
  date: string;
  checkIn: string;
  checkOut?: string;
  status: string;
}

const mockMember: MemberDetail = {
  id: "1",
  firstName: "Rahul",
  lastName: "Patel",
  email: "rahul.patel@gmail.com",
  phone: "+91 98765 43210",
  status: "ACTIVE",
  tier: "GOLD",
  planName: "Gold Monthly",
  planStart: "2026-04-15",
  planExpiry: "2026-05-15",
  trainerName: "Vikram Singh",
  trainerId: "t1",
  joinDate: "2025-03-10",
  lastCheckIn: "2026-04-26",
  totalCheckIns: 156,
  gender: "MALE",
  dateOfBirth: "1995-06-15",
  bloodGroup: "O+",
  emergencyContact: "+91 98765 43200",
  address: "B-204, Sunrise Apartments",
  city: "Vadodara",
  state: "Gujarat",
  pincode: "390001",
  notes: "Prefers morning workouts. Has lower back issues - avoid heavy deadlifts.",
  source: "Instagram Ad",
};

const mockProgress: ProgressEntry[] = [
  { date: "2026-01-15", weight: 78.5, bodyFat: 18.2, chest: 102, waist: 88, biceps: 34 },
  { date: "2026-02-15", weight: 77.2, bodyFat: 17.5, chest: 103, waist: 86, biceps: 35 },
  { date: "2026-03-15", weight: 76.0, bodyFat: 16.8, chest: 104, waist: 84, biceps: 36 },
  { date: "2026-04-15", weight: 75.5, bodyFat: 16.2, chest: 105, waist: 83, biceps: 36.5 },
];

const mockPayments: PaymentHistory[] = [
  { id: "p1", date: "2026-04-15", amount: 2499, method: "UPI", type: "Subscription", status: "COMPLETED", receiptNo: "EG-2026-0415-001" },
  { id: "p2", date: "2026-03-15", amount: 2499, method: "CARD", type: "Subscription", status: "COMPLETED", receiptNo: "EG-2026-0315-042" },
  { id: "p3", date: "2026-02-15", amount: 2499, method: "CASH", type: "Subscription", status: "COMPLETED", receiptNo: "EG-2026-0215-089" },
  { id: "p4", date: "2026-01-20", amount: 500, method: "UPI", type: "PT Session", status: "COMPLETED", receiptNo: "EG-2026-0120-156" },
];

const mockAttendance: AttendanceEntry[] = [
  { date: "2026-04-26", checkIn: "06:30 AM", checkOut: "08:15 AM", status: "PRESENT" },
  { date: "2026-04-25", checkIn: "06:45 AM", checkOut: "08:00 AM", status: "PRESENT" },
  { date: "2026-04-24", checkIn: "07:00 AM", status: "PRESENT" },
  { date: "2026-04-23", checkIn: "06:15 AM", checkOut: "08:30 AM", status: "PRESENT" },
  { date: "2026-04-22", status: "ABSENT" },
  { date: "2026-04-21", checkIn: "06:30 AM", checkOut: "08:00 AM", status: "PRESENT" },
  { date: "2026-04-20", checkIn: "07:15 AM", checkOut: "08:45 AM", status: "PRESENT" },
];

const statusConfig = {
  ACTIVE: { icon: CheckCircle2, color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/20", label: "Active" },
  INACTIVE: { icon: XCircle, color: "text-white/40", bg: "bg-white/5", border: "border-white/10", label: "Inactive" },
  EXPIRED: { icon: Clock3, color: "text-crimson", bg: "bg-crimson/10", border: "border-crimson/20", label: "Expired" },
  FROZEN: { icon: Snowflake, color: "text-electric-cyan", bg: "bg-electric-cyan/10", border: "border-electric-cyan/20", label: "Frozen" },
  PENDING: { icon: Clock3, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Pending" },
};

type TabType = "overview" | "progress" | "payments" | "attendance" | "documents";

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showActionMenu, setShowActionMenu] = useState(false);

  const member = mockMember;
  const status = statusConfig[member.status];
  const StatusIcon = status.icon;
  const initials = getInitials(`${member.firstName} ${member.lastName}`);
  const avatarColor = getAvatarColor(`${member.firstName} ${member.lastName}`);

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/members")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Member profile shared")}
            className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toast.info("Printing member profile...")}
            className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push(`/admin/members/${params.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-liquid-gold to-liquid-orange text-obsidian-950 font-semibold text-sm hover:brightness-110 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0",
                avatarColor
              )}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {member.firstName} {member.lastName}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                    status.bg,
                    status.color,
                    status.border
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {member.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {member.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium border",
                    TIER_BADGE_COLORS[member.tier] || TIER_BADGE_COLORS.BRONZE
                  )}
                >
                  <Crown className="w-3 h-3 inline mr-1" />
                  {member.tier}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs text-white/40 bg-white/5">
                  ID: EG-{member.id.padStart(4, "0")}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs text-white/40 bg-white/5">
                  Joined {formatDate(member.joinDate, "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="md:ml-auto flex flex-wrap gap-4">
            <div className="bg-white/[0.03] rounded-xl p-4 min-w-[100px]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Total Check-ins</p>
              <p className="text-2xl font-mono font-bold text-gold-400">{member.totalCheckIns}</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 min-w-[100px]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Current Streak</p>
              <p className="text-2xl font-mono font-bold text-neon-green">12 days</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 min-w-[100px]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Plan Expires</p>
              <p className={cn(
                "text-2xl font-mono font-bold",
                new Date(member.planExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  ? "text-crimson"
                  : "text-white"
              )}>
                {Math.ceil((new Date(member.planExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-[10px] text-white/20">days left</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
          <button
            onClick={() => toast.success(`Check-in recorded for ${member.firstName}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green/10 text-neon-green text-sm hover:bg-neon-green/20 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Quick Check-in
          </button>
          <button
            onClick={() => toast.info("Payment collection modal opened")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 text-gold-400 text-sm hover:bg-gold-500/20 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Collect Payment
          </button>
          <button
            onClick={() => toast.info("Message composer opened")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-electric-cyan/10 text-electric-cyan text-sm hover:bg-electric-cyan/20 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
          {member.trainerName && (
            <button
              onClick={() => router.push(`/admin/trainers/${member.trainerId}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm hover:bg-purple-500/20 transition-colors"
            >
              <Dumbbell className="w-4 h-4" />
              View Trainer
            </button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-gold-500/20 text-gold-400"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && <OverviewTab member={member} />}
        {activeTab === "progress" && <ProgressTab progress={mockProgress} />}
        {activeTab === "payments" && <PaymentsTab payments={mockPayments} />}
        {activeTab === "attendance" && <AttendanceTab attendance={mockAttendance} />}
        {activeTab === "documents" && <DocumentsTab />}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Overview Tab
// ═══════════════════════════════════════════════════════════════

function OverviewTab({ member }: { member: MemberDetail }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Full Name" value={`${member.firstName} ${member.lastName}`} />
            <InfoItem label="Email" value={member.email} />
            <InfoItem label="Phone" value={member.phone} />
            <InfoItem label="Gender" value={member.gender} />
            <InfoItem label="Date of Birth" value={member.dateOfBirth ? formatDate(member.dateOfBirth, "dd MMM yyyy") : "—"} />
            <InfoItem label="Blood Group" value={member.bloodGroup || "—"} />
            <InfoItem label="Emergency Contact" value={member.emergencyContact || "—"} />
            <InfoItem label="Source" value={member.source || "—"} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Street" value={member.address || "—"} />
            <InfoItem label="City" value={member.city || "—"} />
            <InfoItem label="State" value={member.state || "—"} />
            <InfoItem label="PIN Code" value={member.pincode || "—"} />
          </div>
        </div>

        {member.notes && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <AlertTriangle className="w-4 h-4 text-orange-400 inline mr-2" />
              <span className="text-sm text-white/60">{member.notes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Card */}
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Subscription</h3>
          <div className="text-center mb-6">
            <div className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3",
              "bg-gradient-to-br",
              TIER_BADGE_COLORS[member.tier]?.split(" ")[0].replace("bg-", "from-").replace("/20", "/30") || "from-gold-500/30",
              TIER_BADGE_COLORS[member.tier]?.split(" ")[0].replace("bg-", "to-").replace("/20", "/10") || "to-gold-500/10"
            )}>
              <Crown className="w-8 h-8 text-gold-400" />
            </div>
            <h4 className="text-xl font-bold text-white">{member.planName}</h4>
            <span className={cn("text-sm", TIER_BADGE_COLORS[member.tier]?.split(" ")[1] || "text-gold-400")}>
              {member.tier} Tier
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Started</span>
              <span className="text-white">{formatDate(member.planStart, "dd MMM yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Expires</span>
              <span className={cn(
                new Date(member.planExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  ? "text-crimson"
                  : "text-white"
              )}>
                {formatDate(member.planExpiry, "dd MMM yyyy")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Trainer</span>
              <span className="text-white">{member.trainerName || "—"}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/30">Plan Progress</span>
              <span className="text-xs text-white/30">
                {Math.round(((Date.now() - new Date(member.planStart).getTime()) / (new Date(member.planExpiry).getTime() - new Date(member.planStart).getTime())) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-liquid-gold to-liquid-orange"
                style={{
                  width: `${Math.min(100, ((Date.now() - new Date(member.planStart).getTime()) / (new Date(member.planExpiry).getTime() - new Date(member.planStart).getTime())) * 100)}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => toast.info("Upgrade plan modal opened")}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-liquid-gold to-liquid-orange text-obsidian-950 font-semibold text-sm hover:brightness-110 transition-all"
          >
            Upgrade / Renew Plan
          </button>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Check-ins</p>
                  <p className="text-xs text-white/30">This month</p>
                </div>
              </div>
              <span className="text-xl font-mono font-bold text-neon-green">18</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Avg. Duration</p>
                  <p className="text-xs text-white/30">Per session</p>
                </div>
              </div>
              <span className="text-xl font-mono font-bold text-gold-400">72 min</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-electric-cyan/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-electric-cyan" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Workouts</p>
                  <p className="text-xs text-white/30">Completed</p>
                </div>
              </div>
              <span className="text-xl font-mono font-bold text-electric-cyan">24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/30 mb-1">{label}</p>
      <p className="text-sm text-white/80">{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Progress Tab
// ═══════════════════════════════════════════════════════════════

function ProgressTab({ progress }: { progress: ProgressEntry[] }) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Body Measurements</h3>
        
        {/* Progress Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <ProgressStat label="Weight" value={`${progress[progress.length - 1].weight} kg`} change="-3.0 kg" positive />
          <ProgressStat label="Body Fat" value={`${progress[progress.length - 1].bodyFat}%`} change="-2.0%" positive />
          <ProgressStat label="Chest" value={`${progress[progress.length - 1].chest} cm`} change="+3 cm" positive />
          <ProgressStat label="Waist" value={`${progress[progress.length - 1].waist} cm`} change="-5 cm" positive />
        </div>

        {/* Progress Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Date</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Weight</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Body Fat</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Chest</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Waist</th>
                <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Biceps</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((entry, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="py-3 text-sm text-white/60">{formatDate(entry.date, "dd MMM yyyy")}</td>
                  <td className="py-3 text-sm text-white font-mono">{entry.weight} kg</td>
                  <td className="py-3 text-sm text-white/60">{entry.bodyFat}%</td>
                  <td className="py-3 text-sm text-white/60">{entry.chest} cm</td>
                  <td className="py-3 text-sm text-white/60">{entry.waist} cm</td>
                  <td className="py-3 text-sm text-white/60">{entry.biceps} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Comparison Placeholder */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Progress Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["Front", "Side", "Back"].map((view) => (
            <div key={view} className="aspect-[3/4] rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center">
              <Camera className="w-8 h-8 text-white/10 mb-2" />
              <p className="text-sm text-white/20">{view} View</p>
              <p className="text-xs text-white/10 mt-1">No photo uploaded</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressStat({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-4">
      <p className="text-xs text-white/30 mb-1">{label}</p>
      <p className="text-xl font-mono font-bold text-white">{value}</p>
      <p className={cn("text-xs mt-1", positive ? "text-neon-green" : "text-crimson")}>{change}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Payments Tab
// ═══════════════════════════════════════════════════════════════

function PaymentsTab({ payments }: { payments: PaymentHistory[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Payment History</h3>
        <button
          onClick={() => toast.info("Collect payment modal opened")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 text-gold-400 text-sm hover:bg-gold-500/20 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Collect Payment
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Receipt</th>
              <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Date</th>
              <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Type</th>
              <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Method</th>
              <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Amount</th>
              <th className="text-left text-xs text-white/40 uppercase tracking-wider py-3">Status</th>
              <th className="text-right text-xs text-white/40 uppercase tracking-wider py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="py-3 text-sm text-white/60 font-mono">{payment.receiptNo}</td>
                <td className="py-3 text-sm text-white/60">{formatDate(payment.date, "dd MMM yyyy")}</td>
                <td className="py-3 text-sm text-white/60">{payment.type}</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/40">{payment.method}</span>
                </td>
                <td className="py-3 text-sm font-mono font-medium text-gold-400">
                  {formatCurrency(payment.amount, { showSymbol: true, decimals: 0 })}
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neon-green/10 text-neon-green">
                    <CheckCircle2 className="w-3 h-3" />
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => toast.info("Receipt download started")}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Attendance Tab
// ═══════════════════════════════════════════════════════════════

function AttendanceTab({ attendance }: { attendance: AttendanceEntry[] }) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Attendance</h3>
      
      <div className="space-y-2">
        {attendance.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              entry.status === "PRESENT" ? "bg-neon-green/10" : "bg-crimson/10"
            )}>
              {entry.status === "PRESENT" ? (
                <CheckCircle2 className="w-5 h-5 text-neon-green" />
              ) : (
                <XCircle className="w-5 h-5 text-crimson" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{formatDate(entry.date, "EEEE, dd MMM yyyy")}</p>
              <div className="flex items-center gap-3 mt-0.5">
                {entry.checkIn && (
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    In: {entry.checkIn}
                  </span>
                )}
                {entry.checkOut && (
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Out: {entry.checkOut}
                  </span>
                )}
                {!entry.checkIn && <span className="text-xs text-crimson">No show</span>}
              </div>
            </div>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              entry.status === "PRESENT" ? "bg-neon-green/10 text-neon-green" : "bg-crimson/10 text-crimson"
            )}>
              {entry.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Documents Tab
// ═══════════════════════════════════════════════════════════════

function DocumentsTab() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Documents</h3>
        <button
          onClick={() => toast.info("Upload document modal opened")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 text-gold-400 text-sm hover:bg-gold-500/20 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "ID Proof - Aadhaar", type: "ID_PROOF", date: "2025-03-10" },
          { name: "Medical Certificate", type: "MEDICAL_CERTIFICATE", date: "2025-03-10" },
          { name: "Joining Form", type: "JOINING_FORM", date: "2025-03-10" },
        ].map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gold-400" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-medium text-white mb-1">{doc.name}</p>
            <p className="text-xs text-white/30">{doc.type}</p>
            <p className="text-xs text-white/20 mt-2">Uploaded {formatDate(doc.date, "dd MMM yyyy")}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}