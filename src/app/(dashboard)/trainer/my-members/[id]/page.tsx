"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Dumbbell,
  Apple,
  Calendar,
  ChevronLeft,
  Target,
  Camera,
  Scale,
  Activity,
  ChevronRight,
  Plus,
  ArrowRight,
  Clock,
  Mail,
} from "lucide-react";
import { cn, formatDate, getInitials, getAvatarColor } from "@/lib/utils";
import { getMemberProfileForTrainer } from "@/actions/admin/trainer-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Member Detail & Progress (Trainer View)
// ═══════════════════════════════════════════════════════════════

export default function MemberProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      const res = await getMemberProfileForTrainer(id as string);
      if (res.success && res.data) {
        setMember(res.data);
      } else {
        toast.error(res.error || "Failed to load member profile");
        router.push("/trainer/my-members");
      }
      setIsLoading(false);
    }
    loadProfile();
  }, [id, router]);

  if (isLoading) return <ProfileSkeleton />;
  if (!member) return null;

  const name = `${member.user.firstName} ${member.user.lastName}`;
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col gap-6">
        <button
          onClick={() => router.push("/trainer/my-members")}
          className="group flex w-fit items-center gap-2 text-txt-tertiary transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">Back to My Members</span>
        </button>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-surface-card text-3xl font-bold shadow-lg",
                avatarColor,
              )}
            >
              {initials}
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-foreground">{name}</h1>
                <Badge className="border-success/20 bg-success-soft text-success">ACTIVE</Badge>
              </div>
              <p className="flex items-center gap-2 text-txt-secondary">
                <Calendar className="h-4 w-4" /> Member since {formatDate(member.joinDate)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="h-11 rounded-xl bg-brand-navy px-6 font-bold text-white shadow-sm hover:bg-brand-navy/90">
              <Mail className="mr-2 h-4 w-4" /> Message
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border px-4 font-bold hover:bg-surface-elevated"
            >
              Schedule Session
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="h-auto rounded-2xl border border-border bg-surface-sunken p-1">
          <TabsTrigger
            value="overview"
            className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="workouts"
            className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange"
          >
            Workouts
          </TabsTrigger>
          <TabsTrigger
            value="nutrition"
            className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange"
          >
            Nutrition
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange"
          >
            Progress Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Progress Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-2">
              <MetricCard
                icon={<Scale className="h-5 w-5" />}
                label="Current Weight"
                value={`${member.progress?.[0]?.weight || "N/A"} kg`}
                trend={
                  member.progress?.[1]
                    ? `${(Number(member.progress[0].weight) - Number(member.progress[1].weight)).toFixed(1)}kg`
                    : undefined
                }
                trendDown
              />
              <MetricCard
                icon={<Activity className="h-5 w-5" />}
                label="Body Fat %"
                value={`${member.progress?.[0]?.bodyFat || "N/A"}%`}
                color="orange"
              />
              <MetricCard
                icon={<Target className="h-5 w-5" />}
                label="Active Goals"
                value={member.goals?.filter((g: any) => !g.isAchieved).length || 0}
                color="success"
              />
            </div>

            {/* Current Plans Summary */}
            <div className="surface-card space-y-4 p-6">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <TrendingUp className="h-5 w-5 text-brand-orange" /> Active Strategy
              </h3>
              <div className="space-y-3">
                <div className="rounded-xl border border-border/50 bg-surface-sunken p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Current Workout
                  </p>
                  <p className="truncate text-sm font-bold text-foreground">
                    {member.workoutPlans?.[0]?.name || "None assigned"}
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-surface-sunken p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Current Diet
                  </p>
                  <p className="truncate text-sm font-bold text-foreground">
                    {member.dietPlans?.[0]?.name || "None assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Logs Section */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="surface-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Recent Measurements</h3>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-orange">
                  VIEW HISTORY
                </Button>
              </div>
              <div className="space-y-4">
                {member.progress?.slice(0, 5).map((log: any, _idx: number) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-transparent bg-surface-sunken/50 p-3 transition-all hover:border-border"
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground">{log.weight} kg</p>
                      <p className="text-[10px] font-medium uppercase text-txt-tertiary">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-4 text-xs font-bold text-txt-secondary">
                      <span>BF: {log.bodyFat || "--"}%</span>
                      <span>W: {log.waist || "--"}cm</span>
                    </div>
                  </div>
                ))}
                {(!member.progress || member.progress.length === 0) && (
                  <p className="py-6 text-center text-sm italic text-txt-tertiary">
                    No logs recorded yet
                  </p>
                )}
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Progress Photos</h3>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-orange">
                  UPLOAD NEW
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {member.progressPhotos?.slice(0, 3).map((photo: any) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-surface-sunken"
                  >
                    <img
                      src={photo.photoUrl}
                      alt="Progress"
                      className="h-full w-full object-cover grayscale-[0.5] transition-all duration-500 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-[10px] font-bold uppercase text-white">
                        {photo.photoType}
                      </span>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - (member.progressPhotos?.length || 0)) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="flex aspect-[3/4] items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-sunken text-txt-tertiary"
                    >
                      <Camera className="h-6 w-6 opacity-20" />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-6">
          <div className="surface-card p-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Workout Architecture</h3>
                <p className="text-sm text-txt-secondary">Active plan and exercise breakdown</p>
              </div>
              <Button
                onClick={() => router.push(`/trainer/workouts/assign?memberId=${member.id}`)}
                className="rounded-xl bg-brand-orange font-bold text-white hover:bg-brand-orange/90"
              >
                <Dumbbell className="mr-2 h-4 w-4" /> Change Plan
              </Button>
            </div>

            {member.workoutPlans?.[0] ? (
              <div className="space-y-8">
                <div className="group relative overflow-hidden rounded-2xl border border-brand-orange/10 bg-surface-sunken p-6">
                  <div className="absolute right-0 top-0 p-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]">
                    <Dumbbell className="h-32 w-32" />
                  </div>
                  <h4 className="mb-2 text-2xl font-bold text-foreground">
                    {member.workoutPlans[0].name}
                  </h4>
                  <p className="mb-6 max-w-2xl text-txt-secondary">
                    {member.workoutPlans[0].description}
                  </p>
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                        Difficulty
                      </span>
                      <span className="text-sm font-bold text-brand-orange">
                        {member.workoutPlans[0].difficulty}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                        Duration
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {member.workoutPlans[0].estimatedDuration} mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 font-bold text-foreground">
                    <ArrowRight className="h-4 w-4 text-brand-orange" /> Exercises (
                    {member.workoutPlans[0].exercises?.length || 0})
                  </h5>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {member.workoutPlans[0].exercises?.map((ex: any) => (
                      <div
                        key={ex.id}
                        className="group flex items-center justify-between rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-brand-orange/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-txt-secondary transition-colors group-hover:text-brand-orange">
                            <Dumbbell className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{ex.name}</p>
                            <p className="text-xs text-txt-tertiary">
                              {ex.sets} Sets × {ex.reps} Reps
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-txt-secondary">
                            {ex.weight ? `${ex.weight} kg` : "Bodyweight"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-sunken py-20 text-center">
                <Dumbbell className="mx-auto mb-4 h-12 w-12 text-txt-tertiary opacity-20" />
                <p className="font-medium text-txt-secondary">No workout plan assigned yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          {/* Similar structure for Nutrition */}
          <div className="surface-card p-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Nutrition Strategy</h3>
                <p className="text-sm text-txt-secondary">Meal scheduling and macro targets</p>
              </div>
              <Button
                onClick={() => router.push(`/trainer/diet/assign?memberId=${member.id}`)}
                className="rounded-xl bg-success font-bold text-white hover:bg-success/90"
              >
                <Apple className="mr-2 h-4 w-4" /> Change Plan
              </Button>
            </div>

            {member.dietPlans?.[0] ? (
              <div className="space-y-8">
                <div className="group relative overflow-hidden rounded-2xl border border-success/10 bg-surface-sunken p-6">
                  <div className="absolute right-0 top-0 p-8 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]">
                    <Apple className="h-32 w-32" />
                  </div>
                  <h4 className="mb-2 text-2xl font-bold text-foreground">
                    {member.dietPlans[0].name}
                  </h4>
                  <p className="mb-6 max-w-2xl text-txt-secondary">
                    {member.dietPlans[0].description}
                  </p>
                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                        Daily Target
                      </span>
                      <span className="text-sm font-bold text-success">
                        {member.dietPlans[0].totalCalories} kcal
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                        Plan Type
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {member.dietPlans[0].type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="flex items-center gap-2 font-bold text-foreground">
                    <ArrowRight className="h-4 w-4 text-success" /> Daily Meals (
                    {member.dietPlans[0].meals?.length || 0})
                  </h5>
                  <div className="space-y-3">
                    {member.dietPlans[0].meals?.map((meal: any) => (
                      <div
                        key={meal.id}
                        className="group flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-success/30 md:flex-row md:items-center"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-sunken text-txt-secondary transition-colors group-hover:text-success">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-success">{meal.time}</span>
                              <p className="text-base font-bold text-foreground">{meal.name}</p>
                            </div>
                            <p className="line-clamp-1 text-xs text-txt-tertiary">
                              {meal.items?.join(", ") || "No items listed"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4 md:text-right">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                              Calories
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {meal.calories || 0}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                              Protein
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {meal.protein || 0}g
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-sunken py-20 text-center">
                <Apple className="mx-auto mb-4 h-12 w-12 text-txt-tertiary opacity-20" />
                <p className="font-medium text-txt-secondary">No nutrition plan assigned yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="surface-card p-6">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Body Measurements Trend</h3>
                  <Button
                    size="sm"
                    className="h-9 rounded-lg bg-brand-navy px-4 text-xs font-bold text-white hover:bg-brand-orange"
                  >
                    <Plus className="mr-2 h-4 w-4" /> RECORD LOG
                  </Button>
                </div>
                {/* Measurement Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-4 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                          Date
                        </th>
                        <th className="pb-4 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                          Weight
                        </th>
                        <th className="pb-4 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                          BF %
                        </th>
                        <th className="pb-4 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                          Chest
                        </th>
                        <th className="pb-4 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                          Waist
                        </th>
                        <th className="pb-4 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
                          Hips
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {member.progress?.map((log: any) => (
                        <tr key={log.id} className="transition-colors hover:bg-surface-sunken/50">
                          <td className="py-4 text-sm font-medium text-txt-secondary">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="py-4 text-sm font-bold text-foreground">{log.weight}kg</td>
                          <td className="py-4 text-sm font-bold text-foreground">
                            {log.bodyFat || "--"}%
                          </td>
                          <td className="py-4 text-sm font-medium text-foreground">
                            {log.chest || "--"}cm
                          </td>
                          <td className="py-4 text-sm font-medium text-foreground">
                            {log.waist || "--"}cm
                          </td>
                          <td className="py-4 text-sm font-medium text-foreground">
                            {log.hips || "--"}cm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface-card p-6">
                <h3 className="mb-6 text-lg font-bold text-foreground">Goals Track</h3>
                <div className="space-y-6">
                  {member.goals?.map((goal: any) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground">{goal.title}</p>
                        <span className="text-[10px] font-bold text-txt-tertiary">
                          {Math.round((Number(goal.currentValue) / Number(goal.targetValue)) * 100)}
                          %
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(Number(goal.currentValue) / Number(goal.targetValue)) * 100}%`,
                          }}
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            goal.isAchieved ? "bg-success" : "bg-brand-orange",
                          )}
                        />
                      </div>
                      <p className="text-[10px] font-medium text-txt-tertiary">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                  ))}
                  {(!member.goals || member.goals.length === 0) && (
                    <p className="py-6 text-center text-sm italic text-txt-tertiary">
                      No active goals
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, trendDown, color = "navy" }: any) {
  const colorMap: any = {
    navy: "bg-brand-navy-soft text-brand-navy",
    orange: "bg-brand-orange-soft text-brand-orange",
    success: "bg-success-soft text-success",
  };

  return (
    <div className="surface-card flex flex-col justify-between p-5">
      <div
        className={cn(
          "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
          colorMap[color],
        )}
      >
        {icon}
      </div>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-txt-tertiary">
          {label}
        </p>
        <div className="flex items-end gap-2">
          <h4 className="text-xl font-bold leading-none text-foreground">{value}</h4>
          {trend && (
            <span
              className={cn("text-[10px] font-bold", trendDown ? "text-danger" : "text-success")}
            >
              {trendDown ? "▼" : "▲"} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse-fade space-y-8 pb-12">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-3xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-4 lg:col-span-2">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
