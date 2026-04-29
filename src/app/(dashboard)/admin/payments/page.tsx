"use client";

import { useState } from "react";
import { Download, Filter, Receipt, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { usePayments } from "@/hooks/use-payments";
import { exportToCSV } from "@/lib/export-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const limit = 15;
  const { data, isLoading } = usePayments(page, limit);

  const payments = data?.payments || [];
  const meta = data?.pagination;

  const handleExport = () => {
    if (!payments.length) {
      toast.error("No data to export");
      return;
    }
    const exportData = payments.map((p: any) => ({
      ID: p.id,
      Member: `${p.member?.user?.firstName || ""} ${p.member?.user?.lastName || ""}`.trim() || "Unknown",
      Amount: p.amount,
      Method: p.method,
      Status: p.status,
      Date: formatDate(p.createdAt),
      Reference: p.receiptNo || "N/A"
    }));
    exportToCSV(exportData, `payments_export_${new Date().getTime()}.csv`);
    toast.success("Payments exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "COMPLETED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shadow-none border-0">Completed</Badge>;
      case "PENDING": return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 shadow-none border-0">Pending</Badge>;
      case "FAILED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 shadow-none border-0">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-obsidian-950">
            Finance <span className="text-brand-orange">Hub</span>
          </h1>
          <p className="text-sm text-obsidian-600 mt-1">
            Track revenue, manage invoices, and collect pending payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface-card border-surface-sunken" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-brand-navy hover:bg-brand-navy/90 text-white">
            <Receipt className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-card border-surface-sunken shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-obsidian-600">Total Revenue</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-4 h-4 text-green-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-obsidian-950">₹1,24,500</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-card border-surface-sunken shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-obsidian-600">Pending Dues</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg"><Clock className="w-4 h-4 text-orange-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-obsidian-950">₹12,450</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              45 members with pending dues
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface-card border-surface-sunken shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-obsidian-600">Transactions</CardTitle>
            <div className="p-2 bg-brand-navy/10 rounded-lg"><CreditCard className="w-4 h-4 text-brand-navy" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-obsidian-950">342</div>
            <p className="text-xs text-obsidian-500 mt-1">Successful transactions this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-sunken overflow-hidden">
        <div className="p-4 border-b border-surface-sunken flex justify-between items-center bg-surface-base/50">
          <h2 className="font-semibold text-obsidian-950">Recent Transactions</h2>
          <Button variant="outline" size="sm" className="bg-surface-base border-surface-sunken">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-surface-base">
              <TableRow>
                <TableHead className="font-semibold text-obsidian-900">Transaction ID</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Member</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Amount</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Method</TableHead>
                <TableHead className="font-semibold text-obsidian-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-obsidian-900">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-obsidian-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: any) => {
                  const fullName = `${payment.member?.user?.firstName || ""} ${payment.member?.user?.lastName || ""}`.trim() || "Unknown Member";
                  return (
                    <TableRow key={payment.id} className="hover:bg-surface-base/50 transition-colors">
                      <TableCell className="font-mono text-xs text-obsidian-500">
                        #{payment.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-obsidian-950">
                          {fullName}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-obsidian-900">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-obsidian-600">{payment.method}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-obsidian-600">
                        {formatDate(payment.createdAt, "dd MMM yyyy, hh:mm a")}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        
        {/* Pagination Footer */}
        {meta && meta.pages > 1 && (
          <div className="p-4 border-t border-surface-sunken bg-surface-base/30 flex items-center justify-between">
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
    </div>
  );
}
