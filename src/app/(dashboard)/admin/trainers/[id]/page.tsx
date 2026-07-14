"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Star,
  Users,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Dumbbell,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrainerById } from "@/actions/admin/trainer-actions";
import { formatCurrency, formatDate, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Trainer Profile View
// ═══════════════════════════════════════════════════════════════

export default function TrainerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [trainer, setTrainer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrainer() {
      try {
        const res = await getTrainerById(id as string);
        if (res.success) {
          setTrainer(res.data);
        } else {
          toast.error(res.error || "Trainer not found");
          router.push("/admin/trainers");
        }
      } catch (error) {
        toast.error("Failed to load trainer details");
      } finally {
        setIsLoading(false);
      }
    }
    loadTrainer();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-6 p-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!trainer) return null;

  const name = `${trainer.user.firstName} ${trainer.user.lastName}`;
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/trainers"
          className="flex items-center text-sm text-obsidian-500 transition-colors hover:text-obsidian-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trainers
        </Link>
        <Button
          className="bg-brand-orange text-white hover:bg-brand-orange/90"
          onClick={() => router.push(`/admin/trainers/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Basic Info Card */}
        <div className="surface-card flex flex-col items-center rounded-3xl p-8 text-center">
          <div
            className={cn(
              "mb-6 flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold shadow-xl",
              avatarColor,
            )}
          >
            {initials}
          </div>
          <h1 className="font-display text-2xl font-bold text-obsidian-950">{name}</h1>
          <p className="mb-4 font-medium text-obsidian-500">
            {trainer.specialization.join(", ") || "General Fitness"}
          </p>
          <Badge className="mb-6 border-green-200 bg-green-100 text-green-800">
            Active Trainer
          </Badge>

          <div className="mt-auto grid w-full grid-cols-2 gap-4">
            <div className="rounded-2xl border border-surface-sunken bg-surface-base p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-obsidian-400">
                Experience
              </p>
              <p className="text-lg font-bold text-obsidian-950">{trainer.experience} Yrs</p>
            </div>
            <div className="rounded-2xl border border-surface-sunken bg-surface-base p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-obsidian-400">
                Rating
              </p>
              <div className="flex items-center justify-center text-lg font-bold text-obsidian-950">
                <Star className="text-gold-500 mr-1 h-4 w-4" fill="currentColor" />
                {trainer.rating || "New"}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats & Bio */}
        <div className="space-y-6 md:col-span-2">
          <div className="surface-card rounded-3xl p-8">
            <h3 className="mb-6 flex items-center font-display text-lg font-bold text-obsidian-950">
              <Award className="mr-3 h-5 w-5 text-brand-orange" />
              Professional Background
            </h3>
            <p className="mb-8 italic leading-relaxed text-obsidian-600">
              {trainer.bio ||
                "No professional bio provided yet. Update the profile to add a biography."}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-obsidian-400">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-obsidian-900">{trainer.user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-obsidian-400">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-obsidian-900">
                    {trainer.user.phone || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-obsidian-400">
                    Monthly Salary
                  </p>
                  <p className="text-sm font-bold text-obsidian-900">
                    {formatCurrency(trainer.salary)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-obsidian-400">
                    Joined Since
                  </p>
                  <p className="text-sm font-semibold text-obsidian-900">
                    {formatDate(trainer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="surface-card flex items-center justify-between rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/5">
                  <Users className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-obsidian-950">
                    {trainer._count?.members || 0}
                  </p>
                  <p className="text-xs font-medium text-obsidian-500">Assigned Clients</p>
                </div>
              </div>
            </div>
            <div className="surface-card flex items-center justify-between rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <Clock className="h-6 w-6 text-brand-orange" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-obsidian-950">
                    {trainer.availableFrom} - {trainer.availableTo}
                  </p>
                  <p className="text-xs font-medium text-obsidian-500">Shift Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Skills (Placeholder for now) */}
      <div className="surface-card rounded-3xl p-8">
        <h3 className="mb-6 flex items-center font-display text-lg font-bold text-obsidian-950">
          <Award className="mr-3 h-5 w-5 text-brand-orange" />
          Certifications & Specialized Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {trainer.certifications?.length > 0 ? (
            trainer.certifications.map((cert: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="border-surface-sunken bg-surface-base px-4 py-2 text-obsidian-700"
              >
                {cert}
              </Badge>
            ))
          ) : (
            <p className="text-sm italic text-obsidian-500">No certifications listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
