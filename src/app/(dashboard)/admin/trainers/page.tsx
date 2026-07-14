"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Star,
  Users,
  Dumbbell,
  MoreHorizontal,
  MessageSquare,
  Edit,
} from "lucide-react";
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

  const filteredTrainers = trainers.filter(
    (t: any) =>
      t.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      t.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Trainers <span className="text-brand-orange">Roster</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage your coaching staff and their assigned clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={() => router.push("/admin/trainers/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Trainer
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-surface-sunken bg-surface-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="mb-6 h-4 w-1/2" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))
        ) : filteredTrainers.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-surface-sunken bg-surface-card py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-obsidian-300" />
            <h3 className="text-lg font-semibold text-obsidian-900">No trainers found</h3>
            <p className="text-obsidian-500">Add a trainer to get started or clear your search.</p>
          </div>
        ) : (
          filteredTrainers.map((trainer: any) => {
            const name = `${trainer.user.firstName} ${trainer.user.lastName}`;
            const initials = getInitials(name);
            const avatarColor = getAvatarColor(name);

            return (
              <div
                key={trainer.id}
                className="group relative rounded-2xl border border-surface-sunken bg-surface-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold",
                      avatarColor,
                    )}
                  >
                    {initials}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-obsidian-400 group-hover:text-obsidian-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 border-surface-sunken bg-surface-card"
                    >
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/trainers/${trainer.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" /> Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <h3 className="truncate text-lg font-semibold text-obsidian-950">{name}</h3>
                  <p className="text-sm font-medium text-obsidian-500">
                    {trainer.specialization || "General Fitness"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="border border-surface-sunken bg-surface-base font-medium text-obsidian-700"
                  >
                    <Star className="text-gold-500 mr-1 h-3 w-3" fill="currentColor" />
                    {trainer.rating || "New"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="border border-surface-sunken bg-surface-base font-medium text-obsidian-700"
                  >
                    <Users className="mr-1 h-3 w-3 text-brand-navy" />
                    {trainer._count?.assignedMembers || 0} Clients
                  </Badge>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-surface-sunken pt-4 text-sm">
                  <span className="text-obsidian-500">Exp. {trainer.experience || 1} years</span>
                  <span className="font-semibold text-obsidian-900">
                    {formatCurrency(trainer.salary)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
