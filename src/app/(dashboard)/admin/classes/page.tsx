"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useClasses } from "@/hooks/use-classes";
import { useDebounce } from "@/hooks/use-debounce";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteClass } from "@/actions/admin/class-actions";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Class Schedule Management
// ═══════════════════════════════════════════════════════════════

export default function ClassesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const limit = 12;

  const { data, isLoading, refetch } = useClasses(page, limit, debouncedSearch);
  const classesList = data?.classes || [];
  const meta = data?.pagination;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "YOGA":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "CROSSFIT":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "HIIT":
        return "bg-red-100 text-red-800 border-red-200";
      case "SPINNING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-surface-base text-obsidian-700 border-surface-sunken";
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this class? This will also remove all associated schedules.",
      )
    )
      return;

    setIsDeleting(id);
    try {
      const res = await deleteClass(id);
      if (res.success) {
        toast.success("Class deleted successfully");
        refetch();
      } else {
        toast.error(res.error || "Failed to delete class");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Class <span className="text-brand-orange">Schedule</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage group workouts, trainer assignments, and capacities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-surface-sunken bg-surface-card">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={() => router.push("/admin/classes/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search classes by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-surface-sunken bg-surface-card p-6">
              <Skeleton className="mb-3 h-6 w-3/4" />
              <Skeleton className="mb-6 h-4 w-1/2" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))
        ) : classesList.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-surface-sunken bg-surface-card py-16 text-center">
            <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-obsidian-300" />
            <h3 className="text-lg font-semibold text-obsidian-900">No classes found</h3>
            <p className="text-obsidian-500">Adjust your search or create a new class.</p>
          </div>
        ) : (
          classesList.map((cls: any) => {
            const booked = cls._count?.ClassBooking || 0;
            const percentFull = Math.min(100, Math.round((booked / cls.maxCapacity) * 100));

            return (
              <div
                key={cls.id}
                className="group relative flex flex-col rounded-2xl border border-surface-sunken bg-surface-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className={cn("font-medium", getCategoryColor(cls.category))}
                  >
                    {cls.category}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-2 -mt-2 h-8 w-8 text-obsidian-400 group-hover:text-obsidian-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-surface-sunken bg-surface-card"
                    >
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/classes/${cls.id}/edit`)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Class
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                        disabled={isDeleting === cls.id}
                        onClick={() => handleDelete(cls.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting === cls.id ? "Deleting..." : "Delete Class"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="mb-1 font-display text-xl font-bold text-obsidian-950">
                  {cls.name}
                </h3>
                <p className="mb-6 line-clamp-2 min-h-[40px] text-sm text-obsidian-500">
                  {cls.description || "No description provided."}
                </p>

                <div className="mb-6 flex-1 space-y-3">
                  <div className="flex items-center text-sm text-obsidian-700">
                    <Clock className="mr-3 h-4 w-4 text-obsidian-400" />
                    {cls.duration} mins
                  </div>
                  <div className="flex items-center text-sm text-obsidian-700">
                    <Users className="mr-3 h-4 w-4 text-brand-orange" />
                    {cls.trainer?.user
                      ? `${cls.trainer.user.firstName} ${cls.trainer.user.lastName}`
                      : "TBA"}
                  </div>
                  <div className="flex items-center text-sm text-obsidian-700">
                    <MapPin className="mr-3 h-4 w-4 text-obsidian-400" />
                    Studio A
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-auto border-t border-surface-sunken pt-4">
                  <div className="mb-1.5 flex justify-between text-xs font-medium text-obsidian-700">
                    <span>{booked} Booked</span>
                    <span>{cls.maxCapacity} Max</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-base">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        percentFull >= 100
                          ? "bg-red-500"
                          : percentFull >= 80
                            ? "bg-brand-orange"
                            : "bg-green-500",
                      )}
                      style={{ width: `${percentFull}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-surface-sunken bg-surface-card p-4">
          <span className="text-sm text-obsidian-500">
            Showing page {meta.page} of {meta.pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-surface-card"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              disabled={page === meta.pages}
              className="bg-surface-card"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
