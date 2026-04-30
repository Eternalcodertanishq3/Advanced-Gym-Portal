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
  Megaphone
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

  const filteredNotifications = notifications?.filter((n: any) => 
    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    n.message.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  const handleSend = () => {
    if (!title || !message) {
      toast.error("Title and message are required");
      return;
    }
    
    broadcast.mutate({ title, message, type }, {
      onSuccess: () => {
        toast.success("Broadcast sent to all members!");
        setTitle("");
        setMessage("");
        setIsOpen(false);
      },
      onError: (err) => toast.error(err.message)
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'URGENT': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'INFO': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-obsidian-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Member <span className="text-brand-orange">Broadcast</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Send global announcements, reminders, and urgent alerts to all members.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy hover:bg-brand-navy/90 text-white">
              <Megaphone className="w-4 h-4 mr-2" />
              New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-brand-navy border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold text-white">Compose Broadcast</DialogTitle>
              <DialogDescription className="text-white/50">
                This message will be sent to all active members of the gym.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Announcement Title</label>
                <Input 
                  placeholder="E.g. Holiday Schedule Update" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Message Details</label>
                <Textarea 
                  placeholder="Type your message here..." 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-orange/50 transition-all rounded-xl resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Priority Level</label>
                <div className="flex gap-2">
                  {['INFO', 'SUCCESS', 'URGENT'].map((t) => (
                    <Button 
                      key={t}
                      type="button"
                      variant="outline" 
                      className={cn(
                        "flex-1 text-[10px] font-black h-9 rounded-xl transition-all",
                        type === t 
                          ? "bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20" 
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl">Cancel</Button>
              <Button 
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-brand-orange/20"
                onClick={handleSend}
                disabled={broadcast.isPending}
              >
                {broadcast.isPending ? "Sending..." : "Send Broadcast"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-sunken shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-obsidian-500 uppercase tracking-tight">Reach</p>
            <h3 className="text-2xl font-bold text-obsidian-950">1,245 Members</h3>
          </div>
        </div>
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-sunken shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-obsidian-500 uppercase tracking-tight">Total Sent</p>
            <h3 className="text-2xl font-bold text-obsidian-950">{notifications?.length || 0} Broadcasts</h3>
          </div>
        </div>
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-sunken shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-obsidian-500 uppercase tracking-tight">Active Alerts</p>
            <h3 className="text-2xl font-bold text-obsidian-950">3 Live Alerts</h3>
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-sunken overflow-hidden">
        <div className="p-6 border-b border-surface-sunken flex items-center justify-between bg-surface-base/30">
          <h2 className="text-xl font-display font-bold text-obsidian-950 flex items-center gap-2">
            <History className="w-5 h-5 text-brand-orange" /> Broadcast History
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
            <Input
              placeholder="Filter history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-surface-card border-surface-sunken h-9 text-sm"
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
                <TableHead className="text-right w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-64 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
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
                  <TableRow key={n.id} className="hover:bg-surface-base/50 transition-colors">
                    <TableCell className="max-w-md py-4">
                      <p className="font-bold text-obsidian-950">{n.title}</p>
                      <p className="text-sm text-obsidian-600 line-clamp-1 mt-0.5">{n.message}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium text-xs">
                        {getTypeIcon(n.type)}
                        <span className={cn(
                          n.type === 'URGENT' ? 'text-red-600' : n.type === 'SUCCESS' ? 'text-green-600' : 'text-blue-600'
                        )}>
                          {n.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-obsidian-700">
                      {n.user?.name || 'Admin System'}
                    </TableCell>
                    <TableCell className="text-sm text-obsidian-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-obsidian-400" />
                        {formatDate(n.createdAt, "MMM d, h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-obsidian-400">
                        <MoreVertical className="w-4 h-4" />
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
