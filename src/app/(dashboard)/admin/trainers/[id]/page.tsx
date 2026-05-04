"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Star, Users, Briefcase, Mail, Phone, Calendar, Dumbbell, Award, Clock } from "lucide-react";
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
      <div className="space-y-6 max-w-5xl mx-auto p-4 animate-pulse">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/trainers" className="flex items-center text-sm text-obsidian-500 hover:text-obsidian-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trainers
        </Link>
        <Button 
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
          onClick={() => router.push(`/admin/trainers/${id}/edit`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="surface-card p-8 rounded-3xl flex flex-col items-center text-center">
          <div className={cn("w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-6 shadow-xl", avatarColor)}>
            {initials}
          </div>
          <h1 className="text-2xl font-display font-bold text-obsidian-950">{name}</h1>
          <p className="text-obsidian-500 font-medium mb-4">{trainer.specialization.join(", ") || "General Fitness"}</p>
          <Badge className="bg-green-100 text-green-800 border-green-200 mb-6">
            Active Trainer
          </Badge>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-surface-base p-3 rounded-2xl border border-surface-sunken">
              <p className="text-[10px] uppercase font-bold text-obsidian-400 tracking-wider mb-1">Experience</p>
              <p className="text-lg font-bold text-obsidian-950">{trainer.experience} Yrs</p>
            </div>
            <div className="bg-surface-base p-3 rounded-2xl border border-surface-sunken">
              <p className="text-[10px] uppercase font-bold text-obsidian-400 tracking-wider mb-1">Rating</p>
              <div className="flex items-center justify-center text-lg font-bold text-obsidian-950">
                <Star className="w-4 h-4 text-gold-500 mr-1" fill="currentColor" />
                {trainer.rating || "New"}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats & Bio */}
        <div className="md:col-span-2 space-y-6">
          <div className="surface-card p-8 rounded-3xl">
            <h3 className="text-lg font-display font-bold text-obsidian-950 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-3 text-brand-orange" />
              Professional Background
            </h3>
            <p className="text-obsidian-600 leading-relaxed mb-8 italic">
              {trainer.bio || "No professional bio provided yet. Update the profile to add a biography."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-semibold text-obsidian-900">{trainer.user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-obsidian-900">{trainer.user.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-widest mb-1">Monthly Salary</p>
                  <p className="text-sm font-bold text-obsidian-900">{formatCurrency(trainer.salary)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-widest mb-1">Joined Since</p>
                  <p className="text-sm font-semibold text-obsidian-900">{formatDate(trainer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="surface-card p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-navy" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-obsidian-950">{trainer._count?.members || 0}</p>
                  <p className="text-xs font-medium text-obsidian-500">Assigned Clients</p>
                </div>
              </div>
            </div>
            <div className="surface-card p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-obsidian-950">{trainer.availableFrom} - {trainer.availableTo}</p>
                  <p className="text-xs font-medium text-obsidian-500">Shift Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Skills (Placeholder for now) */}
      <div className="surface-card p-8 rounded-3xl">
        <h3 className="text-lg font-display font-bold text-obsidian-950 mb-6 flex items-center">
          <Award className="w-5 h-5 mr-3 text-brand-orange" />
          Certifications & Specialized Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {trainer.certifications?.length > 0 ? (
            trainer.certifications.map((cert: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="bg-surface-base text-obsidian-700 px-4 py-2 border-surface-sunken">
                {cert}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-obsidian-500 italic">No certifications listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
