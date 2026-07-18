"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SavedFilterPreset {
  id: string;
  name: string;
  filters: {
    search: string;
    branchId?: string;
  };
}

interface SavedFiltersProps {
  storageKey: string;
  currentFilters: {
    search: string;
    branchId?: string;
  };
  onApplyFilters: (filters: { search: string; branchId: string }) => void;
}

export function SavedFilters({ storageKey, currentFilters, onApplyFilters }: SavedFiltersProps) {
  const [presets, setPresets] = useState<SavedFilterPreset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState("");

  // Load presets from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load saved filter presets:", err);
    }
  }, [storageKey]);

  // Save presets to LocalStorage
  const savePresets = (newPresets: SavedFilterPreset[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPresets));
      setPresets(newPresets);
    } catch (err) {
      console.error("Failed to save filter presets:", err);
      toast.error("Failed to save preset");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) {
      toast.error("Please enter a preset name");
      return;
    }

    const newPreset: SavedFilterPreset = {
      id: Math.random().toString(36).substring(2, 9),
      name: presetName.trim(),
      filters: {
        search: currentFilters.search,
        branchId: currentFilters.branchId,
      },
    };

    const updated = [newPreset, ...presets];
    savePresets(updated);
    setPresetName("");
    setIsOpen(false);
    toast.success(`Filter preset "${newPreset.name}" saved!`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter((p) => p.id !== id);
    savePresets(updated);
    toast.success("Filter preset deleted");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Save Current Filter Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 text-xs font-semibold transition-all hover:bg-surface-elevated/40 active:scale-[0.98]",
            isOpen
              ? "border-brand-orange/40 bg-brand-orange/5 text-brand-orange"
              : "border-border text-txt-secondary",
          )}
        >
          <Bookmark className="h-3.5 w-3.5" />
          Save Active Filter
        </button>

        {/* Saved Filter Badges */}
        {presets.map((preset) => (
          <div
            key={preset.id}
            onClick={() =>
              onApplyFilters({
                search: preset.filters.search,
                branchId: preset.filters.branchId || "ALL",
              })
            }
            className="group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-surface-sunken bg-surface-card px-3 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-brand-orange/30 hover:bg-brand-orange/5 hover:text-brand-orange active:scale-[0.98]"
          >
            <span>{preset.name}</span>
            <button
              onClick={(e) => handleDelete(preset.id, e)}
              className="text-txt-tertiary opacity-60 transition-opacity hover:text-red-500 hover:opacity-100"
              aria-label={`Delete preset ${preset.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Save Input Inline Form */}
      {isOpen && (
        <form
          onSubmit={handleSave}
          className="surface-card relative z-10 flex max-w-sm items-center gap-2 rounded-xl border border-surface-sunken p-2.5 shadow-sm duration-200 animate-in fade-in slide-in-from-top-1"
        >
          <input
            type="text"
            placeholder="Preset Name (e.g. Morning Rush)"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="flex-1 bg-transparent px-2 text-xs font-medium text-foreground outline-none placeholder:text-txt-tertiary"
            autoFocus
          />
          <button
            type="submit"
            className="inline-flex h-7 items-center justify-center rounded-lg bg-brand-orange px-2.5 text-xs font-bold text-white transition-all hover:bg-brand-orange/90 active:scale-[0.98]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border text-txt-secondary hover:bg-surface-elevated/40"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
