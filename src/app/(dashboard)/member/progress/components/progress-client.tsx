"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Camera, 
  Plus, 
  ChevronRight, 
  Activity, 
  Scale, 
  Ruler, 
  Calendar,
  Zap,
  Info,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addMeasurement, addProgressPhoto } from "@/actions/member/progress-actions";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/common/portal";
import { formatDate } from "@/lib/utils";

// New Component Imports
import { StatCard } from "./stat-card";
import { MeasurementModal } from "./modals/measurement-modal";
import { PhotoUploadModal } from "./modals/photo-upload-modal";
import { ComparisonTool } from "./comparison-tool";

interface Props {
  data: {
    measurements: any[];
    photos: any[];
    goals: any[];
  };
}

export function ProgressClient({ data }: Props) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as "metrics" | "photos" | "goals" | null;
  
  const [activeTab, setActiveTab] = useState<"metrics" | "photos" | "goals">(initialTab || "metrics");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Prepare chart data
  const chartData = data.measurements.map(m => ({
    date: formatDate(m.createdAt, "dd MMM"),
    weight: Number(m.weight),
    bodyFat: Number(m.bodyFat)
  }));

  const latest = data.measurements[data.measurements.length - 1] || {};
  const prev = data.measurements[data.measurements.length - 2] || latest;
  
  const weightDiff = Number(latest.weight || 0) - Number(prev.weight || 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-display flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-brand-glow">
              <TrendingUp className="w-6 h-6 text-brand-orange" />
            </div>
            Evolution <span className="text-brand-orange">Tracker</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1 font-medium">Your journey in numbers. Every gram counts.</p>
        </div>
        
        <div className="flex bg-surface-elevated p-1 rounded-2xl border border-border">
          <button 
            onClick={() => setActiveTab("metrics")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === "metrics" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
            )}
          >
            Metrics
          </button>
          <button 
            onClick={() => setActiveTab("photos")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === "photos" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
            )}
          >
            Photos
          </button>
          <button 
            onClick={() => setActiveTab("goals")}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              activeTab === "goals" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
            )}
          >
            Goals
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "metrics" ? (
          <motion.div 
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                label="Current Weight" 
                value={`${latest.weight || "--"} kg`} 
                trend={weightDiff} 
                unit="kg"
                icon={<Scale className="w-6 h-6" />}
                color="orange"
              />
              <StatCard 
                label="Body Fat" 
                value={`${latest.bodyFat || "--"} %`} 
                trend={0} 
                unit="%"
                icon={<Activity className="w-6 h-6" />}
                color="info"
              />
              <StatCard 
                label="Chest" 
                value={`${latest.chest || "--"} cm`} 
                trend={0} 
                unit="cm"
                icon={<Ruler className="w-6 h-6" />}
                color="purple"
              />
              <StatCard 
                label="Waist" 
                value={`${latest.waist || "--"} cm`} 
                trend={0} 
                unit="cm"
                icon={<Ruler className="w-6 h-6" />}
                color="success"
              />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 surface-card p-8 rounded-[2.5rem] border border-border/50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                      <Activity className="w-5 h-5 text-brand-orange" /> Weight Evolution
                    </h3>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5">
                         <div className="w-3 h-3 rounded-full bg-brand-orange" />
                         <span className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">Weight</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F26522" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F26522" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#666" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#666" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          domain={['dataMin - 2', 'dataMax + 2']}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#F26522' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#F26522" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorWeight)" 
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               {/* Right Panel: Recent Logs Table */}
               <div className="surface-card p-8 rounded-[2.5rem] flex flex-col">
                  <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5 text-brand-orange" /> Log History
                  </h3>
                  <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                    {data.measurements.slice().reverse().map((m, i) => (
                      <div key={m.id} className="p-4 rounded-2xl bg-surface-sunken/50 border border-border/50 flex items-center justify-between group hover:border-brand-orange/30 transition-all">
                        <div>
                          <p className="text-xs font-bold text-foreground">{m.weight} kg</p>
                          <p className="text-[10px] text-txt-tertiary font-medium">
                            {formatDate(m.createdAt)}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-surface-elevated text-txt-tertiary group-hover:text-brand-orange transition-colors">
                           <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="mt-6 w-full py-4 rounded-2xl bg-brand-orange text-white font-bold text-sm shadow-lg shadow-brand-orange/10 hover:bg-brand-orange-dark transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Measurement
                  </button>
               </div>
            </div>
          </motion.div>
        ) : activeTab === "photos" ? (
          <motion.div 
            key="photos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center bg-surface-sunken/50 p-6 rounded-[2rem] border border-border/50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                     <ImageIcon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-foreground">Transformation Archive</h3>
                     <p className="text-xs text-txt-tertiary font-medium">Analyze your evolution with our side-by-side comparison engine.</p>
                  </div>
               </div>
               <Button 
                 onClick={() => setShowComparison(true)}
                 className="bg-brand-orange hover:bg-brand-orange-dark font-bold rounded-2xl h-12 px-8 shadow-lg shadow-brand-orange/20 transition-all active:scale-95"
               >
                 Compare Progress
               </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               <div 
                 onClick={() => setShowPhotoModal(true)}
                 className="aspect-[3/4] rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4 hover:border-brand-orange/50 transition-all cursor-pointer group"
               >
                  <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-txt-tertiary group-hover:text-brand-orange transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">Upload Progress</p>
                    <p className="text-xs text-txt-tertiary">Keep visual track of gains</p>
                  </div>
               </div>
               {data.photos.map((photo, idx) => (
                  <div key={photo.id} className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-surface-sunken relative group shadow-xl">
                    <img src={photo.photoUrl} alt="Progress" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                      <p className="text-xs font-bold text-brand-orange uppercase tracking-widest">{photo.photoType}</p>
                      <p className="text-xl font-bold text-white">{photo.weight} kg</p>
                      <p className="text-xs text-white/60 font-medium">{formatDate(photo.createdAt)}</p>
                    </div>
                    <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                      {formatDate(photo.createdAt, "MMM yyyy")}
                    </div>
                  </div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="goals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {data.goals.map((goal, idx) => {
              const progress = Math.min((Number(goal.currentValue) / Number(goal.targetValue)) * 100, 100);
              return (
                <div key={goal.id} className="surface-card p-8 rounded-[2.5rem] border border-border/50 flex flex-col group hover:border-brand-orange/30 transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Trophy className={cn("w-7 h-7", goal.isAchieved ? "text-success" : "text-brand-orange")} />
                    </div>
                    {goal.isAchieved && (
                      <span className="px-4 py-1.5 rounded-full bg-success-soft text-success text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        Goal Achieved
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 mb-8">
                    <h3 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">{goal.title}</h3>
                    <p className="text-sm text-txt-secondary font-medium">{goal.description || "Specific target set for your fitness journey."}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-4xl font-display font-bold text-foreground">
                          {goal.currentValue} <span className="text-lg text-txt-tertiary font-medium">{goal.unit}</span>
                        </p>
                        <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Current Progress</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{goal.targetValue} {goal.unit}</p>
                        <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mt-1">Target</p>
                      </div>
                    </div>

                    <div className="h-3 w-full bg-surface-sunken rounded-full overflow-hidden border border-border/30">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full shadow-lg", goal.isAchieved ? "bg-success shadow-success/20" : "bg-brand-orange shadow-brand-orange/20")}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-border/30">
                       <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest">
                         Ends {goal.deadline ? formatDate(goal.deadline) : "No Deadline"}
                       </p>
                       <p className="text-xs font-bold text-brand-orange flex items-center gap-1">
                         {Math.round(progress)}% Complete
                       </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="aspect-square sm:aspect-auto rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4 hover:border-brand-orange/50 transition-all cursor-pointer group p-12">
               <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Plus className="w-8 h-8 text-txt-tertiary group-hover:text-brand-orange transition-colors" />
               </div>
               <div className="text-center">
                 <p className="font-bold text-foreground">Set New Goal</p>
                 <p className="text-xs text-txt-tertiary">Define your next milestone</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MeasurementModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        latest={latest}
      />

      <PhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        latestWeight={latest.weight}
      />

      {showComparison && (
        <ComparisonTool 
          photos={data.photos} 
          onClose={() => setShowComparison(false)} 
        />
      )}
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 8v4l3 3" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
  );
}
