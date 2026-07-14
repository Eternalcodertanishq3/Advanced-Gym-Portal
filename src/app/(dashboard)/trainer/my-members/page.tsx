"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Dumbbell,
  Apple,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { cn, formatDate, getInitials, getAvatarColor } from "@/lib/utils";
import { getTrainerMembers } from "@/actions/admin/trainer-actions";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — My Members (Trainer View)
// ═══════════════════════════════════════════════════════════════

export default function MyMembersPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadMembers() {
      if (!session?.user?.id) return;

      const res = await getTrainerMembers(session.user.id);
      if (res.success && res.data) {
        setMembers(res.data);
      } else {
        toast.error(res.error || "Failed to load members");
      }
      setIsLoading(false);
    }
    loadMembers();
  }, [session]);

  const filteredMembers = members.filter((m) => {
    const fullName = `${m.user.firstName} ${m.user.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      m.user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My <span className="text-brand-orange">Members</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Track and manage your assigned athletes and their plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-brand-navy-soft border-brand-navy/20 px-3 py-1 text-sm font-bold text-brand-navy"
          >
            {members.length} Active Assignments
          </Badge>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="surface-card p-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border bg-surface-sunken pl-9 focus-visible:ring-brand-orange"
            />
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button variant="outline" className="h-11 border-border bg-surface-sunken">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface-card space-y-4 p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : filteredMembers.length === 0 ? (
          <div className="surface-card col-span-full py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-sunken">
              <Users className="h-10 w-10 text-txt-tertiary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No members found</h3>
            <p className="text-txt-secondary">You don't have any members assigned yet.</p>
          </div>
        ) : (
          filteredMembers.map((member) => <MemberCard key={member.id} member={member} />)
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: any }) {
  const name = `${member.user.firstName} ${member.user.lastName}`;
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  const currentWorkout = member.workoutPlans?.[0]?.name || "Not Assigned";
  const currentDiet = member.dietPlans?.[0]?.name || "Not Assigned";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card group overflow-hidden"
    >
      {/* Top Section */}
      <div className="p-6 pb-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold shadow-sm transition-transform group-hover:scale-105",
                avatarColor,
              )}
            >
              {initials}
            </div>
            <div>
              <h4 className="text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-brand-orange">
                {name}
              </h4>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-txt-tertiary">
                Joined {formatDate(member.joinDate)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-txt-tertiary hover:text-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border bg-surface-card">
              <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem>
                <Link
                  href={`/trainer/my-members/${member.id}`}
                  className="flex w-full items-center"
                >
                  <TrendingUp className="mr-2 h-4 w-4" /> View Progress
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/trainer/workouts/assign?memberId=${member.id}`}
                  className="flex w-full items-center"
                >
                  <Dumbbell className="mr-2 h-4 w-4" /> Change Workout
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={`/trainer/diet/assign?memberId=${member.id}`}
                  className="flex w-full items-center"
                >
                  <Apple className="mr-2 h-4 w-4" /> Change Diet
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-surface-sunken p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <Dumbbell className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                Workout
              </span>
            </div>
            <p className="truncate text-xs font-bold text-foreground">{currentWorkout}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-surface-sunken p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <Apple className="h-3.5 w-3.5 text-success" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                Diet Plan
              </span>
            </div>
            <p className="truncate text-xs font-bold text-foreground">{currentDiet}</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-border bg-surface-sunken/30 p-4 transition-colors group-hover:bg-surface-sunken/50">
        <div className="flex gap-1.5">
          <button
            title="Email Member"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-txt-secondary transition-all hover:border-brand-orange hover:text-brand-orange"
          >
            <Mail className="h-4 w-4" />
          </button>
          <button
            title="Call Member"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-txt-secondary transition-all hover:border-brand-orange hover:text-brand-orange"
          >
            <Phone className="h-4 w-4" />
          </button>
        </div>
        <Link
          href={`/trainer/my-members/${member.id}`}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-orange transition-all hover:gap-2"
        >
          VIEW PROFILE <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
