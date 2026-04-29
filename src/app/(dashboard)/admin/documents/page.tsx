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
  MoreVertical
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

  const filteredDocuments = documents?.filter((doc: any) => 
    doc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    doc.user?.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      removeDocument.mutate(id, {
        onSuccess: () => toast.success("Document deleted successfully"),
        onError: (err) => toast.error(err.message)
      });
    }
  };

  const getDocIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-obsidian-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Document <span className="text-brand-orange">Vault</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Manage waivers, contracts, and identity documents for all members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-brand-navy hover:bg-brand-navy/90 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card rounded-2xl p-4 border border-surface-sunken shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
          <Input
            placeholder="Search by document name or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-base border-surface-sunken focus-visible:ring-brand-navy"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-brand-navy/5 text-brand-navy border-brand-navy/20 cursor-pointer hover:bg-brand-navy/10">
            All Documents
          </Badge>
          <Badge variant="outline" className="bg-surface-base text-obsidian-600 border-surface-sunken cursor-pointer hover:bg-surface-sunken">
            Waivers
          </Badge>
          <Badge variant="outline" className="bg-surface-base text-obsidian-600 border-surface-sunken cursor-pointer hover:bg-surface-sunken">
            Contracts
          </Badge>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-sunken overflow-hidden">
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
                  <TableCell><Skeleton className="h-10 w-48 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-32 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <FileText className="w-10 h-10 text-obsidian-200 mx-auto mb-3" />
                  <p className="text-obsidian-500 font-medium">No documents found matching your search.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc: any) => (
                <TableRow key={doc.id} className="hover:bg-surface-base/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface-base rounded-lg border border-surface-sunken">
                        {getDocIcon(doc.type || 'pdf')}
                      </div>
                      <div>
                        <p className="font-semibold text-obsidian-950">{doc.name}</p>
                        <p className="text-xs text-obsidian-500 uppercase tracking-tight">{doc.category || 'General'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-navy/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-brand-navy" />
                      </div>
                      <span className="text-sm font-medium text-obsidian-700">{doc.user?.name || 'Public'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-obsidian-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-obsidian-400" />
                      {formatDate(doc.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-50 text-green-700 border-green-100 shadow-none">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-obsidian-400 hover:text-brand-navy hover:bg-brand-navy/5">
                        <Download className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-obsidian-400">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-surface-card border-surface-sunken">
                          <DropdownMenuItem className="flex items-center">
                            <ExternalLink className="w-4 h-4 mr-2" /> View Online
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
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
