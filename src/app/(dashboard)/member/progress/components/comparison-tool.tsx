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
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 p-8 text-center backdrop-blur-xl">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border/50 bg-surface-card">
          <Zap className="h-10 w-10 text-brand-orange" />
        </div>
        <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
          Insufficient Intelligence
        </h2>
        <p className="mb-8 max-w-sm font-medium text-txt-tertiary">
          You need at least two progress photos to initialize the comparison engine.
        </p>
        <button
          onClick={onClose}
          className="rounded-2xl bg-brand-orange px-8 py-3 font-bold text-white shadow-xl shadow-brand-orange/20"
        >
          Back to Hangar
        </button>
      </div>
    );
  }

  const weightDiff = (rightPhoto.weight || 0) - (leftPhoto.weight || 0);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background p-4 duration-500 animate-in fade-in md:p-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border/50 bg-surface-elevated p-3 text-txt-tertiary transition-all hover:text-foreground"
            aria-label="Go back"
            title="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Evolution <span className="text-brand-orange">Analysis</span>
            </h2>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-txt-tertiary">
              Comparing Transformation Cycles
            </p>
          </div>
        </div>

        <div className="flex rounded-2xl border border-border/50 bg-surface-elevated p-1.5">
          <button
            onClick={() => setMode("slider")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              mode === "slider"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Slider
          </button>
          <button
            onClick={() => setMode("side-by-side")}
            className={cn(
              "rounded-xl px-6 py-2 text-xs font-bold transition-all",
              mode === "side-by-side"
                ? "bg-brand-orange text-white shadow-lg"
                : "text-txt-tertiary hover:text-foreground",
            )}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 overflow-hidden lg:flex-row">
        {/* Comparison Area */}
        <div className="group relative flex-1 overflow-hidden rounded-[3rem] border border-border/50 bg-surface-sunken shadow-2xl">
          {mode === "slider" ? (
            <div className="relative h-full w-full select-none">
              {/* Before Image (Left) */}
              <img
                src={leftPhoto.photoUrl}
                alt="Before"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* After Image (Right) */}
              <div
                className="absolute inset-0 h-full w-full overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` } as any}
              >
                <img
                  src={rightPhoto.photoUrl}
                  alt="After"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              {/* Slider Handle */}
              <div
                className="absolute bottom-0 top-0 z-10 w-1 cursor-ew-resize bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                style={{ left: `${sliderPos}%` } as any}
              >
                <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-brand-orange bg-white shadow-xl">
                  <div className="flex gap-1">
                    <div className="h-3 w-0.5 rounded-full bg-brand-orange" />
                    <div className="h-3 w-0.5 rounded-full bg-brand-orange" />
                  </div>
                </div>
                <div className="absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-4 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
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
                className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
                aria-label="Comparison slider"
                title="Adjust comparison"
              />

              {/* Labels */}
              <div className="absolute bottom-10 left-10 z-10 flex flex-col gap-2">
                <div className="rounded-full border border-white/10 bg-brand-navy/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                  Baseline: {formatDate(leftPhoto.createdAt)}
                </div>
              </div>
              <div className="absolute bottom-10 right-10 z-10 flex flex-col items-end gap-2">
                <div className="rounded-full border border-white/10 bg-brand-orange/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                  Current: {formatDate(rightPhoto.createdAt)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full gap-1">
              <div className="relative flex-1">
                <img src={leftPhoto.photoUrl} alt="Before" className="h-full w-full object-cover" />
                <div className="absolute bottom-8 left-8 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
                  <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/60">
                    Baseline
                  </p>
                  <p className="text-sm font-bold text-white">{formatDate(leftPhoto.createdAt)}</p>
                </div>
              </div>
              <div className="relative flex-1">
                <img src={rightPhoto.photoUrl} alt="After" className="h-full w-full object-cover" />
                <div className="absolute bottom-8 right-8 rounded-2xl border border-white/10 bg-brand-orange/80 p-4 text-right backdrop-blur-md">
                  <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/60">
                    Target
                  </p>
                  <p className="text-sm font-bold text-white">{formatDate(rightPhoto.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="flex w-full flex-col space-y-8 lg:w-96">
          {/* Metric Comparison Card */}
          <div className="surface-card rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-surface-card to-surface-sunken p-8 shadow-xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10">
                <Scale className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Analytics</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-txt-tertiary">
                    Net Change
                  </p>
                  <p
                    className={cn(
                      "font-display text-4xl font-bold",
                      weightDiff > 0 ? "text-danger" : "text-success",
                    )}
                  >
                    {weightDiff > 0 ? `+${weightDiff}` : weightDiff}{" "}
                    <span className="text-sm">kg</span>
                  </p>
                </div>
                <div className="rounded-xl bg-surface-sunken p-3 text-txt-tertiary">
                  {weightDiff > 0 ? (
                    <Zap className="h-5 w-5 text-danger" />
                  ) : (
                    <Zap className="h-5 w-5 text-success" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/50 bg-surface-sunken p-4">
                  <p className="mb-1 text-xs font-bold uppercase text-txt-tertiary">Initial</p>
                  <p className="text-xl font-bold text-foreground">{leftPhoto.weight || "--"} kg</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-surface-sunken p-4">
                  <p className="mb-1 text-xs font-bold uppercase text-txt-tertiary">Latest</p>
                  <p className="text-xl font-bold text-foreground">
                    {rightPhoto.weight || "--"} kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Selectors */}
          <div className="flex min-h-0 flex-1 flex-col space-y-6">
            <h4 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-txt-tertiary">
              Baseline Selection
            </h4>
            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setLeftPhotoIdx(idx)}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border p-3 transition-all",
                    leftPhotoIdx === idx
                      ? "border-brand-orange/50 bg-brand-navy shadow-lg"
                      : "border-border/50 bg-surface-sunken/50 hover:border-border",
                  )}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                    <img src={p.photoUrl} alt="Thumb" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">
                      {formatDate(p.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-tighter text-txt-tertiary">
                      {p.weight} kg • {p.photoType}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="ml-1 text-[10px] font-black uppercase tracking-[0.3em] text-txt-tertiary">
              Target Selection
            </h4>
            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setRightPhotoIdx(idx)}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border p-3 transition-all",
                    rightPhotoIdx === idx
                      ? "border-brand-orange bg-brand-orange/20 shadow-lg shadow-brand-orange/5"
                      : "border-border/50 bg-surface-sunken/50 hover:border-border",
                  )}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                    <img src={p.photoUrl} alt="Thumb" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">
                      {formatDate(p.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-tighter text-txt-tertiary">
                      {p.weight} kg • {p.photoType}
                    </p>
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
