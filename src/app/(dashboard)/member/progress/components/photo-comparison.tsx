"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MoveHorizontal } from "lucide-react";

interface PhotoComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeDate: string;
  afterDate: string;
  className?: string;
}

export function PhotoComparison({
  beforeImage,
  afterImage,
  beforeDate,
  afterDate,
  className,
}: PhotoComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(newPosition, 0), 100));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-[4/5] w-full max-w-2xl cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900 shadow-2xl sm:aspect-video",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Before Image (Base) */}
      <div className="absolute inset-0">
        <img
          src={beforeImage}
          alt="Before progress"
          className="pointer-events-none h-full w-full object-cover"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-white/90 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-zinc-400" />
          BEFORE: {beforeDate}
        </div>
      </div>

      {/* After Image (Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* We make this image absolute inset-0 and stretch to fill its container, 
            so it perfectly overlaps the before image. */}
        <img
          src={afterImage}
          alt="After progress"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ width: "100%", maxWidth: "none" }}
        />
        {/* Dark gradient overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

        <div className="absolute right-4 top-4 flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-orange/80 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-lg shadow-brand-orange/20 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
          AFTER: {afterDate}
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 flex w-1 cursor-ew-resize items-center justify-center bg-white/80 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <motion.div
          className="border-gold-400 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-obsidian-900 shadow-lg"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          <MoveHorizontal className="h-4 w-4" />
        </motion.div>
      </div>

      {/* Instructional text (fades out on hover/drag) */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/5 bg-black/50 px-4 py-2 text-xs text-white/80 backdrop-blur-sm transition-opacity duration-300",
          isDragging || "group-hover:opacity-0",
        )}
      >
        Drag to compare
      </div>
    </div>
  );
}
