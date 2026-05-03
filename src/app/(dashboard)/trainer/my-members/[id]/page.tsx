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
  Mail
} from "lucide-react";
import { cn, formatDate, getInitials, getAvatarColor } from "@/lib/utils";
import { getMemberProfileForTrainer } from "@/server/actions/trainer-actions";
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
          className="flex items-center gap-2 text-txt-tertiary hover:text-foreground transition-colors w-fit group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">Back to My Members</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-surface-card", avatarColor)}>
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-3xl font-bold text-foreground">{name}</h1>
                <Badge className="bg-success-soft text-success border-success/20">ACTIVE</Badge>
              </div>
              <p className="text-txt-secondary flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Member since {formatDate(member.joinDate)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl h-11 px-6 font-bold shadow-sm">
              <Mail className="w-4 h-4 mr-2" /> Message
            </Button>
            <Button variant="outline" className="rounded-xl h-11 px-4 border-border hover:bg-surface-elevated font-bold">
              Schedule Session
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-surface-sunken p-1 rounded-2xl border border-border h-auto">
          <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange font-bold text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="workouts" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange font-bold text-sm">
            Workouts
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange font-bold text-sm">
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="progress" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-surface-card data-[state=active]:text-brand-orange font-bold text-sm">
            Progress Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Progress Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
               <MetricCard icon={<Scale className="w-5 h-5" />} label="Current Weight" value={`${member.progress?.[0]?.weight || "N/A"} kg`} trend={member.progress?.[1] ? `${(Number(member.progress[0].weight) - Number(member.progress[1].weight)).toFixed(1)}kg` : undefined} trendDown />
               <MetricCard icon={<Activity className="w-5 h-5" />} label="Body Fat %" value={`${member.progress?.[0]?.bodyFat || "N/A"}%`} color="orange" />
               <MetricCard icon={<Target className="w-5 h-5" />} label="Active Goals" value={member.goals?.filter((g: any) => !g.isAchieved).length || 0} color="success" />
            </div>

            {/* Current Plans Summary */}
            <div className="surface-card p-6 space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-orange" /> Active Strategy
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-surface-sunken border border-border/50">
                  <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mb-1">Current Workout</p>
                  <p className="text-sm font-bold text-foreground truncate">{member.workoutPlans?.[0]?.name || "None assigned"}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-sunken border border-border/50">
                  <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mb-1">Current Diet</p>
                  <p className="text-sm font-bold text-foreground truncate">{member.dietPlans?.[0]?.name || "None assigned"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Logs Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Recent Measurements</h3>
                <Button variant="ghost" size="sm" className="text-brand-orange font-bold text-xs">VIEW HISTORY</Button>
              </div>
              <div className="space-y-4">
                {member.progress?.slice(0, 5).map((log: any, idx: number) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-sunken/50 border border-transparent hover:border-border transition-all">
                    <div>
                      <p className="text-sm font-bold text-foreground">{log.weight} kg</p>
                      <p className="text-[10px] font-medium text-txt-tertiary uppercase">{formatDate(log.createdAt)}</p>
                    </div>
                    <div className="flex gap-4 text-xs font-bold text-txt-secondary">
                      <span>BF: {log.bodyFat || "--"}%</span>
                      <span>W: {log.waist || "--"}cm</span>
                    </div>
                  </div>
                ))}
                {(!member.progress || member.progress.length === 0) && (
                  <p className="text-center py-6 text-txt-tertiary text-sm italic">No logs recorded yet</p>
                )}
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Progress Photos</h3>
                <Button variant="ghost" size="sm" className="text-brand-orange font-bold text-xs">UPLOAD NEW</Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {member.progressPhotos?.slice(0, 3).map((photo: any) => (
                  <div key={photo.id} className="aspect-[3/4] rounded-xl bg-surface-sunken overflow-hidden border border-border group relative">
                    <img src={photo.photoUrl} alt="Progress" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                       <span className="text-[10px] font-bold text-white uppercase">{photo.photoType}</span>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - (member.progressPhotos?.length || 0)) }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-surface-sunken border-2 border-dashed border-border flex items-center justify-center text-txt-tertiary">
                    <Camera className="w-6 h-6 opacity-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-6">
           <div className="surface-card p-6">
             <div className="flex items-center justify-between mb-8">
               <div>
                 <h3 className="text-xl font-bold text-foreground">Workout Architecture</h3>
                 <p className="text-sm text-txt-secondary">Active plan and exercise breakdown</p>
               </div>
               <Button onClick={() => router.push(`/trainer/workouts/assign?memberId=${member.id}`)} className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl font-bold">
                 <Dumbbell className="w-4 h-4 mr-2" /> Change Plan
               </Button>
             </div>

             {member.workoutPlans?.[0] ? (
               <div className="space-y-8">
                 <div className="p-6 rounded-2xl bg-surface-sunken border border-brand-orange/10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                     <Dumbbell className="w-32 h-32" />
                   </div>
                   <h4 className="text-2xl font-bold text-foreground mb-2">{member.workoutPlans[0].name}</h4>
                   <p className="text-txt-secondary max-w-2xl mb-6">{member.workoutPlans[0].description}</p>
                   <div className="flex gap-6">
                     <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Difficulty</span>
                       <span className="text-sm font-bold text-brand-orange">{member.workoutPlans[0].difficulty}</span>
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Duration</span>
                       <span className="text-sm font-bold text-foreground">{member.workoutPlans[0].estimatedDuration} mins</span>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h5 className="font-bold text-foreground flex items-center gap-2">
                     <ArrowRight className="w-4 h-4 text-brand-orange" /> Exercises ({member.workoutPlans[0].exercises?.length || 0})
                   </h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {member.workoutPlans[0].exercises?.map((ex: any) => (
                       <div key={ex.id} className="p-4 rounded-xl bg-surface-card border border-border flex items-center justify-between group hover:border-brand-orange/30 transition-all">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-surface-sunken flex items-center justify-center text-txt-secondary group-hover:text-brand-orange transition-colors">
                             <Dumbbell className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-foreground">{ex.name}</p>
                             <p className="text-xs text-txt-tertiary">{ex.sets} Sets × {ex.reps} Reps</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-bold text-txt-secondary">{ex.weight ? `${ex.weight} kg` : "Bodyweight"}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             ) : (
               <div className="py-20 text-center bg-surface-sunken rounded-2xl border border-dashed border-border">
                 <Dumbbell className="w-12 h-12 text-txt-tertiary mx-auto mb-4 opacity-20" />
                 <p className="text-txt-secondary font-medium">No workout plan assigned yet</p>
               </div>
             )}
           </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
           {/* Similar structure for Nutrition */}
           <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Nutrition Strategy</h3>
                  <p className="text-sm text-txt-secondary">Meal scheduling and macro targets</p>
                </div>
                <Button onClick={() => router.push(`/trainer/diet/assign?memberId=${member.id}`)} className="bg-success hover:bg-success/90 text-white rounded-xl font-bold">
                  <Apple className="w-4 h-4 mr-2" /> Change Plan
                </Button>
              </div>

              {member.dietPlans?.[0] ? (
                <div className="space-y-8">
                   <div className="p-6 rounded-2xl bg-surface-sunken border border-success/10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                       <Apple className="w-32 h-32" />
                     </div>
                     <h4 className="text-2xl font-bold text-foreground mb-2">{member.dietPlans[0].name}</h4>
                     <p className="text-txt-secondary max-w-2xl mb-6">{member.dietPlans[0].description}</p>
                     <div className="flex gap-8">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Daily Target</span>
                         <span className="text-sm font-bold text-success">{member.dietPlans[0].totalCalories} kcal</span>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Plan Type</span>
                         <span className="text-sm font-bold text-foreground">{member.dietPlans[0].type}</span>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <h5 className="font-bold text-foreground flex items-center gap-2">
                       <ArrowRight className="w-4 h-4 text-success" /> Daily Meals ({member.dietPlans[0].meals?.length || 0})
                     </h5>
                     <div className="space-y-3">
                       {member.dietPlans[0].meals?.map((meal: any) => (
                         <div key={meal.id} className="p-4 rounded-xl bg-surface-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-success/30 transition-all">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-surface-sunken flex items-center justify-center text-txt-secondary group-hover:text-success transition-colors">
                               <Clock className="w-5 h-5" />
                             </div>
                             <div>
                               <div className="flex items-center gap-2">
                                 <span className="text-xs font-bold text-success">{meal.time}</span>
                                 <p className="text-base font-bold text-foreground">{meal.name}</p>
                               </div>
                               <p className="text-xs text-txt-tertiary line-clamp-1">{meal.items?.join(", ") || "No items listed"}</p>
                             </div>
                           </div>
                           <div className="flex gap-4 md:text-right">
                             <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">Calories</span>
                               <span className="text-sm font-bold text-foreground">{meal.calories || 0}</span>
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">Protein</span>
                               <span className="text-sm font-bold text-foreground">{meal.protein || 0}g</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-surface-sunken rounded-2xl border border-dashed border-border">
                  <Apple className="w-12 h-12 text-txt-tertiary mx-auto mb-4 opacity-20" />
                  <p className="text-txt-secondary font-medium">No nutrition plan assigned yet</p>
                </div>
              )}
           </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                 <div className="surface-card p-6">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-lg font-bold text-foreground">Body Measurements Trend</h3>
                       <Button size="sm" className="bg-brand-navy hover:bg-brand-orange text-white font-bold rounded-lg text-xs h-9 px-4">
                         <Plus className="w-4 h-4 mr-2" /> RECORD LOG
                       </Button>
                    </div>
                    {/* Measurement Table */}
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="text-left border-b border-border">
                                <th className="pb-4 text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Date</th>
                                <th className="pb-4 text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Weight</th>
                                <th className="pb-4 text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">BF %</th>
                                <th className="pb-4 text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Chest</th>
                                <th className="pb-4 text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Waist</th>
                                <th className="pb-4 text-[10px] font-bold text-txt-tertiary uppercase tracking-wider">Hips</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                             {member.progress?.map((log: any) => (
                                <tr key={log.id} className="hover:bg-surface-sunken/50 transition-colors">
                                   <td className="py-4 text-sm font-medium text-txt-secondary">{formatDate(log.createdAt)}</td>
                                   <td className="py-4 text-sm font-bold text-foreground">{log.weight}kg</td>
                                   <td className="py-4 text-sm font-bold text-foreground">{log.bodyFat || "--"}%</td>
                                   <td className="py-4 text-sm font-medium text-foreground">{log.chest || "--"}cm</td>
                                   <td className="py-4 text-sm font-medium text-foreground">{log.waist || "--"}cm</td>
                                   <td className="py-4 text-sm font-medium text-foreground">{log.hips || "--"}cm</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="surface-card p-6">
                    <h3 className="text-lg font-bold text-foreground mb-6">Goals Track</h3>
                    <div className="space-y-6">
                       {member.goals?.map((goal: any) => (
                          <div key={goal.id} className="space-y-2">
                             <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-foreground">{goal.title}</p>
                                <span className="text-[10px] font-bold text-txt-tertiary">{Math.round((Number(goal.currentValue) / Number(goal.targetValue)) * 100)}%</span>
                             </div>
                             <div className="h-2 bg-surface-sunken rounded-full overflow-hidden">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${(Number(goal.currentValue) / Number(goal.targetValue)) * 100}%` }}
                                   className={cn(
                                     "h-full rounded-full transition-all duration-1000",
                                     goal.isAchieved ? "bg-success" : "bg-brand-orange"
                                   )}
                                />
                             </div>
                             <p className="text-[10px] text-txt-tertiary font-medium">
                                {goal.currentValue} / {goal.targetValue} {goal.unit}
                             </p>
                          </div>
                       ))}
                       {(!member.goals || member.goals.length === 0) && (
                         <p className="text-center py-6 text-txt-tertiary text-sm italic">No active goals</p>
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
    <div className="surface-card p-5 flex flex-col justify-between">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", colorMap[color])}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-end gap-2">
          <h4 className="text-xl font-bold text-foreground leading-none">{value}</h4>
          {trend && (
            <span className={cn("text-[10px] font-bold", trendDown ? "text-danger" : "text-success")}>
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
    <div className="space-y-8 pb-12 animate-pulse-fade">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-3xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

