"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Scale, Calendar, Zap, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Photo {
  id: string;
  photoUrl: string;
  photoType: string;
  weight: number | null;
  createdAt: Date;
}

interface Props {
  photos: Photo[];
  onClose: () => void;
}

export function ComparisonTool({ photos, onClose }: Props) {
  const [leftPhotoIdx, setLeftPhotoIdx] = useState(photos.length > 1 ? photos.length - 1 : 0);
  const [rightPhotoIdx, setRightPhotoIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState<"side-by-side" | "slider">("slider");

  const leftPhoto = photos[leftPhotoIdx];
  const rightPhoto = photos[rightPhotoIdx];

  if (photos.length < 2) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-surface-card border border-border/50 flex items-center justify-center mb-6">
           <Zap className="w-10 h-10 text-brand-orange" />
        </div>
        <h2 className="text-3xl font-display font-bold text-foreground mb-4">Insufficient Intelligence</h2>
        <p className="text-txt-tertiary max-w-sm mb-8 font-medium">You need at least two progress photos to initialize the comparison engine.</p>
        <button onClick={onClose} className="px-8 py-3 rounded-2xl bg-brand-orange text-white font-bold shadow-xl shadow-brand-orange/20">Back to Hangar</button>
      </div>
    );
  }

  const weightDiff = (rightPhoto.weight || 0) - (leftPhoto.weight || 0);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col p-4 md:p-8 overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-6">
           <button 
             onClick={onClose}
             className="p-3 rounded-2xl bg-surface-elevated text-txt-tertiary hover:text-foreground transition-all border border-border/50"
             aria-label="Go back"
             title="Back"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
           <div>
              <h2 className="text-2xl font-display font-bold text-foreground uppercase tracking-tight">Evolution <span className="text-brand-orange">Analysis</span></h2>
              <p className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.3em] mt-1">Comparing Transformation Cycles</p>
           </div>
        </div>

        <div className="flex bg-surface-elevated p-1.5 rounded-2xl border border-border/50">
           <button 
             onClick={() => setMode("slider")}
             className={cn(
               "px-6 py-2 rounded-xl text-xs font-bold transition-all",
               mode === "slider" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
             )}
           >
             Slider
           </button>
           <button 
             onClick={() => setMode("side-by-side")}
             className={cn(
               "px-6 py-2 rounded-xl text-xs font-bold transition-all",
               mode === "side-by-side" ? "bg-brand-orange text-white shadow-lg" : "text-txt-tertiary hover:text-foreground"
             )}
           >
             Side-by-Side
           </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Comparison Area */}
        <div className="flex-1 relative rounded-[3rem] overflow-hidden bg-surface-sunken border border-border/50 shadow-2xl group">
           {mode === "slider" ? (
             <div className="w-full h-full relative select-none">
                {/* Before Image (Left) */}
                <img 
                  src={leftPhoto.photoUrl} 
                  alt="Before" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* After Image (Right) */}
                <div 
                  className="absolute inset-0 w-full h-full overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` } as any}
                >
                  <img 
                    src={rightPhoto.photoUrl} 
                    alt="After" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ left: `${sliderPos}%` } as any}
                >
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-4 border-brand-orange flex items-center justify-center shadow-xl">
                      <div className="flex gap-1">
                        <div className="w-0.5 h-3 bg-brand-orange rounded-full" />
                        <div className="w-0.5 h-3 bg-brand-orange rounded-full" />
                      </div>
                   </div>
                   <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                      Slide to Analyze
                   </div>
                </div>

                {/* Invisible input to handle slider */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPos} 
                  onChange={(e) => setSliderPos(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  aria-label="Comparison slider"
                  title="Adjust comparison"
                />

                {/* Labels */}
                <div className="absolute bottom-10 left-10 z-10 flex flex-col gap-2">
                   <div className="px-4 py-1.5 rounded-full bg-brand-navy/90 text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                      Baseline: {formatDate(leftPhoto.createdAt)}
                   </div>
                </div>
                <div className="absolute bottom-10 right-10 z-10 flex flex-col gap-2 items-end">
                   <div className="px-4 py-1.5 rounded-full bg-brand-orange/90 text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                      Current: {formatDate(rightPhoto.createdAt)}
                   </div>
                </div>
             </div>
           ) : (
             <div className="w-full h-full flex gap-1">
                <div className="flex-1 relative">
                   <img src={leftPhoto.photoUrl} alt="Before" className="w-full h-full object-cover" />
                   <div className="absolute bottom-8 left-8 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                      <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1">Baseline</p>
                      <p className="text-sm font-bold text-white">{formatDate(leftPhoto.createdAt)}</p>
                   </div>
                </div>
                <div className="flex-1 relative">
                   <img src={rightPhoto.photoUrl} alt="After" className="w-full h-full object-cover" />
                   <div className="absolute bottom-8 right-8 p-4 rounded-2xl bg-brand-orange/80 backdrop-blur-md border border-white/10 text-right">
                      <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1">Target</p>
                      <p className="text-sm font-bold text-white">{formatDate(rightPhoto.createdAt)}</p>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-96 space-y-8 flex flex-col">
           {/* Metric Comparison Card */}
           <div className="surface-card p-8 rounded-[2.5rem] border border-border/50 shadow-xl bg-gradient-to-br from-surface-card to-surface-sunken">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-brand-orange" />
                 </div>
                 <h3 className="text-xl font-display font-bold text-foreground">Analytics</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-bold text-txt-tertiary uppercase tracking-widest mb-1">Net Change</p>
                       <p className={cn(
                         "text-4xl font-display font-bold",
                         weightDiff > 0 ? "text-danger" : "text-success"
                       )}>
                         {weightDiff > 0 ? `+${weightDiff}` : weightDiff} <span className="text-sm">kg</span>
                       </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-sunken text-txt-tertiary">
                       {weightDiff > 0 ? <Zap className="w-5 h-5 text-danger" /> : <Zap className="w-5 h-5 text-success" />}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-surface-sunken border border-border/50">
                       <p className="text-xs font-bold text-txt-tertiary uppercase mb-1">Initial</p>
                       <p className="text-xl font-bold text-foreground">{leftPhoto.weight || "--"} kg</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-sunken border border-border/50">
                       <p className="text-xs font-bold text-txt-tertiary uppercase mb-1">Latest</p>
                       <p className="text-xl font-bold text-foreground">{rightPhoto.weight || "--"} kg</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Photo Selectors */}
           <div className="flex-1 space-y-6 flex flex-col min-h-0">
              <h4 className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.3em] ml-1">Baseline Selection</h4>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                 {photos.map((p, idx) => (
                    <div 
                      key={p.id}
                      onClick={() => setLeftPhotoIdx(idx)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer",
                        leftPhotoIdx === idx 
                          ? "bg-brand-navy border-brand-orange/50 shadow-lg" 
                          : "bg-surface-sunken/50 border-border/50 hover:border-border"
                      )}
                    >
                       <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-elevated shrink-0">
                          <img src={p.photoUrl} alt="Thumb" className="w-full h-full object-cover" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{formatDate(p.createdAt)}</p>
                          <p className="text-[9px] font-bold text-txt-tertiary uppercase tracking-tighter mt-0.5">{p.weight} kg • {p.photoType}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <h4 className="text-[10px] font-black text-txt-tertiary uppercase tracking-[0.3em] ml-1">Target Selection</h4>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                 {photos.map((p, idx) => (
                    <div 
                      key={p.id}
                      onClick={() => setRightPhotoIdx(idx)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer",
                        rightPhotoIdx === idx 
                          ? "bg-brand-orange/20 border-brand-orange shadow-lg shadow-brand-orange/5" 
                          : "bg-surface-sunken/50 border-border/50 hover:border-border"
                      )}
                    >
                       <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-elevated shrink-0">
                          <img src={p.photoUrl} alt="Thumb" className="w-full h-full object-cover" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{formatDate(p.createdAt)}</p>
                          <p className="text-[9px] font-bold text-txt-tertiary uppercase tracking-tighter mt-0.5">{p.weight} kg • {p.photoType}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
