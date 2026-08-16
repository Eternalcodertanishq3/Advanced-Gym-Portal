"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, UserCheck, Loader2, Check, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { assignTrainerToMember } from "@/actions/admin/member-management-actions";
import { cn, getInitials } from "@/lib/utils";

interface Trainer {
  id: string;
  specialization?: string[] | string | null;
  experience?: number | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  _count?: {
    members: number;
  };
}

interface AssignTrainerModalProps {
  memberId: string;
  memberName: string;
  currentTrainerId?: string | null;
  trainers: Trainer[];
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerLabel?: string;
  className?: string;
}

export function AssignTrainerModal({
  memberId,
  memberName,
  currentTrainerId,
  trainers,
  triggerVariant = "outline",
  triggerLabel,
  className,
}: AssignTrainerModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(currentTrainerId || "none");
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedTrainerId(currentTrainerId || "none");
    }
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      const res = await assignTrainerToMember(memberId, selectedTrainerId);
      if (res.success) {
        if (selectedTrainerId === "none") {
          toast.success(`Removed trainer assignment from ${memberName}`);
        } else {
          const trainer = trainers.find((t) => t.id === selectedTrainerId);
          const trainerName = trainer
            ? `${trainer.user.firstName} ${trainer.user.lastName}`
            : "Trainer";
          toast.success(`Assigned ${trainerName} to ${memberName}`);
        }
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to assign trainer");
      }
    } catch (error) {
      toast.error("An error occurred while updating trainer assignment");
    } finally {
      setLoading(false);
    }
  };

  const isAssigned = !!currentTrainerId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={cn("w-full gap-2", className)}>
          <Dumbbell className="h-4 w-4 text-brand-orange" />
          {triggerLabel || (isAssigned ? "Change Trainer" : "Assign Trainer")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-orange/20 bg-brand-orange/10">
            <Dumbbell className="h-6 w-6 text-brand-orange" />
          </div>
          <DialogTitle className="text-center font-display text-xl font-bold">
            {isAssigned ? "Change Assigned Trainer" : "Assign Trainer"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Select a certified personal trainer for{" "}
            <span className="font-semibold text-foreground">{memberName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="trainer-select"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Select Trainer
            </Label>
            <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
              <SelectTrigger
                id="trainer-select"
                className="h-12 w-full rounded-xl border-surface-sunken bg-surface-card"
              >
                <SelectValue placeholder="Choose a trainer..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none" className="py-2.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserX className="h-4 w-4" />
                    <span>No Trainer (Unassign)</span>
                  </div>
                </SelectItem>
                {trainers.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange">
                        {getInitials(`${t.user.firstName} ${t.user.lastName}`)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-foreground">
                          {t.user.firstName} {t.user.lastName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {Array.isArray(t.specialization)
                            ? t.specialization.join(", ")
                            : t.specialization || "General Fitness"}
                          {t._count !== undefined && ` • ${t._count.members} active clients`}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTrainerId &&
            selectedTrainerId !== "none" &&
            (() => {
              const selectedTrainer = trainers.find((t) => t.id === selectedTrainerId);
              if (!selectedTrainer) return null;
              return (
                <div className="rounded-2xl border border-surface-sunken bg-surface-sunken/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange text-sm font-bold text-white shadow-sm">
                      {getInitials(
                        `${selectedTrainer.user.firstName} ${selectedTrainer.user.lastName}`,
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedTrainer.user.firstName} {selectedTrainer.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Array.isArray(selectedTrainer.specialization)
                          ? selectedTrainer.specialization.join(", ")
                          : selectedTrainer.specialization || "Personal Trainer"}
                        {selectedTrainer.experience
                          ? ` • ${selectedTrainer.experience} yrs exp`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={loading || selectedTrainerId === (currentTrainerId || "none")}
            className="rounded-xl bg-brand-orange text-white hover:bg-brand-orange/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Assignment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
