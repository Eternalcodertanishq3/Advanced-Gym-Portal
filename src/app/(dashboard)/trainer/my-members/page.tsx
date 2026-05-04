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
  UserPlus
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

  const filteredMembers = members.filter(m => {
    const fullName = `${m.user.firstName} ${m.user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || 
           m.user.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My <span className="text-brand-orange">Members</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1">
            Track and manage your assigned athletes and their plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-brand-navy-soft text-brand-navy border-brand-navy/20 px-3 py-1 text-sm font-bold">
            {members.length} Active Assignments
          </Badge>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="surface-card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface-sunken border-border focus-visible:ring-brand-orange"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="bg-surface-sunken border-border h-11">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface-card p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full py-20 text-center surface-card">
            <div className="w-20 h-20 bg-surface-sunken rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-txt-tertiary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No members found</h3>
            <p className="text-txt-secondary">You don't have any members assigned yet.</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
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
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm transition-transform group-hover:scale-105", avatarColor)}>
              {initials}
            </div>
            <div>
              <h4 className="font-bold text-foreground text-lg leading-tight group-hover:text-brand-orange transition-colors">
                {name}
              </h4>
              <p className="text-xs font-medium text-txt-tertiary flex items-center gap-1.5 mt-1">
                Joined {formatDate(member.joinDate)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-txt-tertiary hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-surface-card border-border">
              <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem>
                <Link href={`/trainer/my-members/${member.id}`} className="flex items-center w-full">
                  <TrendingUp className="mr-2 h-4 w-4" /> View Progress
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/trainer/workouts/assign?memberId=${member.id}`} className="flex items-center w-full">
                  <Dumbbell className="mr-2 h-4 w-4" /> Change Workout
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/trainer/diet/assign?memberId=${member.id}`} className="flex items-center w-full">
                  <Apple className="mr-2 h-4 w-4" /> Change Diet
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-surface-sunken p-3 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Workout</span>
            </div>
            <p className="text-xs font-bold text-foreground truncate">{currentWorkout}</p>
          </div>
          <div className="bg-surface-sunken p-3 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-1.5">
              <Apple className="w-3.5 h-3.5 text-success" />
              <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Diet Plan</span>
            </div>
            <p className="text-xs font-bold text-foreground truncate">{currentDiet}</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-surface-sunken/30 group-hover:bg-surface-sunken/50 transition-colors">
        <div className="flex gap-1.5">
          <button title="Email Member" className="w-8 h-8 rounded-lg bg-surface-card border border-border flex items-center justify-center text-txt-secondary hover:text-brand-orange hover:border-brand-orange transition-all">
            <Mail className="w-4 h-4" />
          </button>
          <button title="Call Member" className="w-8 h-8 rounded-lg bg-surface-card border border-border flex items-center justify-center text-txt-secondary hover:text-brand-orange hover:border-brand-orange transition-all">
            <Phone className="w-4 h-4" />
          </button>
        </div>
        <Link 
          href={`/trainer/my-members/${member.id}`}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:gap-2 transition-all"
        >
          VIEW PROFILE <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

