"use client";

import { useState } from "react";
import { Plus, Search, Calendar as CalendarIcon, Clock, Users, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react";
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
import { deleteClass } from "@/server/actions/class-actions";

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
      case "YOGA": return "bg-purple-100 text-purple-800 border-purple-200";
      case "CROSSFIT": return "bg-orange-100 text-orange-800 border-orange-200";
      case "HIIT": return "bg-red-100 text-red-800 border-red-200";
      case "SPINNING": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-surface-base text-obsidian-700 border-surface-sunken";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class? This will also remove all associated schedules.")) return;
    
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Class <span className="text-brand-orange">Schedule</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Manage group workouts, trainer assignments, and capacities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface-card border-surface-sunken">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          <Button 
            className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            onClick={() => router.push("/admin/classes/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card rounded-2xl p-4 border border-surface-sunken shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
          <Input
            placeholder="Search classes by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-base border-surface-sunken focus-visible:ring-brand-orange"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-card rounded-2xl p-6 border border-surface-sunken">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))
        ) : classesList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-surface-card rounded-2xl border border-surface-sunken">
            <CalendarIcon className="w-12 h-12 text-obsidian-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-obsidian-900">No classes found</h3>
            <p className="text-obsidian-500">Adjust your search or create a new class.</p>
          </div>
        ) : (
          classesList.map((cls: any) => {
            const booked = cls._count?.ClassBooking || 0;
            const percentFull = Math.min(100, Math.round((booked / cls.maxCapacity) * 100));
            
            return (
              <div key={cls.id} className="bg-surface-card rounded-2xl p-6 border border-surface-sunken shadow-sm hover:shadow-md transition-all group relative flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn("font-medium", getCategoryColor(cls.category))}>
                    {cls.category}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-obsidian-400 group-hover:text-obsidian-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-surface-card border-surface-sunken">
                      <DropdownMenuItem onClick={() => router.push(`/admin/classes/${cls.id}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Class
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                        disabled={isDeleting === cls.id}
                        onClick={() => handleDelete(cls.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> 
                        {isDeleting === cls.id ? "Deleting..." : "Delete Class"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-display text-xl font-bold text-obsidian-950 mb-1">{cls.name}</h3>
                <p className="text-sm text-obsidian-500 mb-6 line-clamp-2 min-h-[40px]">
                  {cls.description || "No description provided."}
                </p>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center text-sm text-obsidian-700">
                    <Clock className="w-4 h-4 mr-3 text-obsidian-400" />
                    {cls.duration} mins
                  </div>
                  <div className="flex items-center text-sm text-obsidian-700">
                    <Users className="w-4 h-4 mr-3 text-brand-orange" />
                    {cls.trainer?.user ? `${cls.trainer.user.firstName} ${cls.trainer.user.lastName}` : "TBA"}
                  </div>
                  <div className="flex items-center text-sm text-obsidian-700">
                    <MapPin className="w-4 h-4 mr-3 text-obsidian-400" />
                    Studio A
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-auto pt-4 border-t border-surface-sunken">
                  <div className="flex justify-between text-xs font-medium text-obsidian-700 mb-1.5">
                    <span>{booked} Booked</span>
                    <span>{cls.maxCapacity} Max</span>
                  </div>
                  <div className="w-full bg-surface-base rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        percentFull >= 100 ? "bg-red-500" : percentFull >= 80 ? "bg-brand-orange" : "bg-green-500"
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
        <div className="p-4 rounded-2xl border border-surface-sunken bg-surface-card flex items-center justify-between">
          <span className="text-sm text-obsidian-500">
            Showing page {meta.page} of {meta.pages}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-surface-card"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
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
