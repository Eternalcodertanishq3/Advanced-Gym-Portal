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
        "relative w-full max-w-2xl aspect-[4/5] sm:aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl group bg-obsidian-900",
        className
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
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
        
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white/90 font-mono border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-400" />
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
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ width: '100%', maxWidth: 'none' }}
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
        
        <div className="absolute top-4 right-4 bg-brand-orange/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white font-mono font-bold shadow-lg shadow-brand-orange/20 flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
          AFTER: {afterDate}
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 w-1 bg-white/80 shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <motion.div 
          className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gold-400 text-obsidian-900 absolute"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          <MoveHorizontal className="w-4 h-4" />
        </motion.div>
      </div>
      
      {/* Instructional text (fades out on hover/drag) */}
      <div className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white/80 border border-white/5 transition-opacity duration-300",
        isDragging || "group-hover:opacity-0"
      )}>
        Drag to compare
      </div>
    </div>
  );
}
