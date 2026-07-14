"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Clock,
  User,
  MoreVertical,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useDocuments } from "@/hooks/use-documents";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: documents, isLoading, removeDocument } = useDocuments();

  const filteredDocuments =
    documents?.filter(
      (doc: any) =>
        doc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doc.user?.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    ) || [];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      removeDocument.mutate(id, {
        onSuccess: () => toast.success("Document deleted successfully"),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const getDocIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-obsidian-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Document <span className="text-brand-orange">Vault</span>
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage waivers, contracts, and identity documents for all members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-brand-navy text-white hover:bg-brand-navy/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-sunken bg-surface-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-400" />
          <Input
            placeholder="Search by document name or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-surface-sunken bg-surface-base pl-9 focus-visible:ring-brand-navy"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="cursor-pointer border-brand-navy/20 bg-brand-navy/5 text-brand-navy hover:bg-brand-navy/10"
          >
            All Documents
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer border-surface-sunken bg-surface-base text-obsidian-600 hover:bg-surface-sunken"
          >
            Waivers
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer border-surface-sunken bg-surface-base text-obsidian-600 hover:bg-surface-sunken"
          >
            Contracts
          </Badge>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <Table>
          <TableHeader className="bg-surface-base">
            <TableRow>
              <TableHead className="font-semibold text-obsidian-900">Document Name</TableHead>
              <TableHead className="font-semibold text-obsidian-900">Member</TableHead>
              <TableHead className="font-semibold text-obsidian-900">Date Uploaded</TableHead>
              <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-obsidian-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-10 w-48 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-8 w-24 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <FileText className="mx-auto mb-3 h-10 w-10 text-obsidian-200" />
                  <p className="font-medium text-obsidian-500">
                    No documents found matching your search.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc: any) => (
                <TableRow key={doc.id} className="transition-colors hover:bg-surface-base/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border border-surface-sunken bg-surface-base p-2">
                        {getDocIcon(doc.type || "pdf")}
                      </div>
                      <div>
                        <p className="font-semibold text-obsidian-950">{doc.name}</p>
                        <p className="text-xs uppercase tracking-tight text-obsidian-500">
                          {doc.category || "General"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-navy/10">
                        <User className="h-3 w-3 text-brand-navy" />
                      </div>
                      <span className="text-sm font-medium text-obsidian-700">
                        {doc.user?.name || "Public"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-obsidian-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-obsidian-400" />
                      {formatDate(doc.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="border-green-100 bg-green-50 text-green-700 shadow-none">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-obsidian-400 hover:bg-brand-navy/5 hover:text-brand-navy"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-obsidian-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-surface-sunken bg-surface-card"
                        >
                          <DropdownMenuItem className="flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4" /> View Online
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-700"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
