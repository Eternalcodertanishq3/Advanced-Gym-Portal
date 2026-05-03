"use client";

import { useRouter } from "next/navigation";
import { Plus, Search, Star, Users, Dumbbell, MoreHorizontal, MessageSquare, Edit } from "lucide-react";
import { formatCurrency, getInitials, getAvatarColor, cn } from "@/lib/utils";
import { useTrainers } from "@/hooks/use-trainers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function TrainersPage() {
  const router = useRouter();
  const { data, isLoading } = useTrainers();
  const [search, setSearch] = useState("");

  const trainers = data?.data || [];

  const filteredTrainers = trainers.filter((t: any) => 
    t.user.firstName.toLowerCase().includes(search.toLowerCase()) || 
    t.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    t.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Trainers <span className="text-brand-orange">Roster</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Manage your coaching staff and their assigned clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white" onClick={() => router.push("/admin/trainers/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Trainer
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card rounded-2xl p-4 border border-surface-sunken shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
          <Input
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-base border-surface-sunken focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-card p-6 rounded-2xl border border-surface-sunken">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))
        ) : filteredTrainers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-surface-card rounded-2xl border border-surface-sunken">
            <Users className="w-12 h-12 text-obsidian-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-obsidian-900">No trainers found</h3>
            <p className="text-obsidian-500">Add a trainer to get started or clear your search.</p>
          </div>
        ) : (
          filteredTrainers.map((trainer: any) => {
            const name = `${trainer.user.firstName} ${trainer.user.lastName}`;
            const initials = getInitials(name);
            const avatarColor = getAvatarColor(name);

            return (
              <div key={trainer.id} className="bg-surface-card p-6 rounded-2xl border border-surface-sunken shadow-sm hover:shadow-md transition-shadow group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold", avatarColor)}>
                    {initials}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-obsidian-400 group-hover:text-obsidian-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-surface-card border-surface-sunken">
                      <DropdownMenuItem onClick={() => router.push(`/admin/trainers/${trainer.id}`)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" /> Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <h3 className="font-semibold text-obsidian-950 text-lg truncate">{name}</h3>
                  <p className="text-sm text-obsidian-500 font-medium">{trainer.specialization || "General Fitness"}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-surface-base text-obsidian-700 border border-surface-sunken font-medium">
                    <Star className="w-3 h-3 mr-1 text-gold-500" fill="currentColor" />
                    {trainer.rating || "New"}
                  </Badge>
                  <Badge variant="secondary" className="bg-surface-base text-obsidian-700 border border-surface-sunken font-medium">
                    <Users className="w-3 h-3 mr-1 text-brand-navy" />
                    {trainer._count?.assignedMembers || 0} Clients
                  </Badge>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-sunken flex justify-between items-center text-sm">
                  <span className="text-obsidian-500">Exp. {trainer.experience || 1} years</span>
                  <span className="font-semibold text-obsidian-900">{formatCurrency(trainer.salary)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
