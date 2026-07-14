"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Send,
  History,
  Users,
  AlertTriangle,
  Info,
  CheckCircle2,
  MoreVertical,
  Clock,
  Megaphone,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function NotificationsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications, isLoading, broadcast } = useNotifications();

  const filteredNotifications =
    notifications?.filter(
      (n: any) =>
        n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        n.message.toLowerCase().includes(debouncedSearch.toLowerCase()),
    ) || [];

  const handleSend = () => {
    if (!title || !message) {
      toast.error("Title and message are required");
      return;
    }

    broadcast.mutate(
      { title, message, type },
      {
        onSuccess: () => {
          toast.success("Broadcast sent to all members!");
          setTitle("");
          setMessage("");
          setIsOpen(false);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "URGENT":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "SUCCESS":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "INFO":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-obsidian-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Member <span className="text-brand-orange">Broadcast</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Send global announcements, reminders, and urgent alerts to all members.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy text-white hover:bg-brand-navy/90">
              <Megaphone className="mr-2 h-4 w-4" />
              New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-brand-navy text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold text-white">
                Compose Broadcast
              </DialogTitle>
              <DialogDescription className="text-white/50">
                This message will be sent to all active members of the gym.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Announcement Title
                </label>
                <Input
                  placeholder="E.g. Holiday Schedule Update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Message Details
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-white/20 focus:border-brand-orange/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {["INFO", "SUCCESS", "URGENT"].map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-9 flex-1 rounded-xl text-[10px] font-black transition-all",
                        type === t
                          ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-brand-orange/20"
                          : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white",
                      )}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="rounded-xl text-white/50 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                className="h-11 rounded-xl bg-brand-orange px-6 font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/90"
                onClick={handleSend}
                disabled={broadcast.isPending}
              >
                {broadcast.isPending ? "Sending..." : "Send Broadcast"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-6 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-tight text-obsidian-500">Reach</p>
            <h3 className="text-2xl font-bold text-obsidian-950">1,245 Members</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-6 shadow-sm">
          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-tight text-obsidian-500">
              Total Sent
            </p>
            <h3 className="text-2xl font-bold text-obsidian-950">
              {notifications?.length || 0} Broadcasts
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-6 shadow-sm">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-tight text-obsidian-500">
              Active Alerts
            </p>
            <h3 className="text-2xl font-bold text-obsidian-950">3 Live Alerts</h3>
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-sunken bg-surface-base/30 p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-obsidian-950">
            <History className="h-5 w-5 text-brand-orange" /> Broadcast History
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
            <Input
              placeholder="Filter history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 border-surface-sunken bg-surface-card pl-9 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-base">
              <TableRow>
                <TableHead className="font-semibold text-obsidian-900">Announcement</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Type</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Sent By</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Sent Date</TableHead>
                <TableHead className="w-12 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-64 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-obsidian-400">
                    No broadcast history found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((n: any) => (
                  <TableRow key={n.id} className="transition-colors hover:bg-surface-base/50">
                    <TableCell className="max-w-md py-4">
                      <p className="font-bold text-obsidian-950">{n.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-obsidian-600">{n.message}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {getTypeIcon(n.type)}
                        <span
                          className={cn(
                            n.type === "URGENT"
                              ? "text-red-600"
                              : n.type === "SUCCESS"
                                ? "text-green-600"
                                : "text-blue-600",
                          )}
                        >
                          {n.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-obsidian-700">
                      {n.user?.name || "Admin System"}
                    </TableCell>
                    <TableCell className="text-sm text-obsidian-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-obsidian-400" />
                        {formatDate(n.createdAt, "MMM d, h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-obsidian-400">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
