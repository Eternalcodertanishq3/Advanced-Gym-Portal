"use client";

import { useState } from "react";
import { Download, Filter, Receipt, TrendingUp, CreditCard, ArrowUpRight, Clock } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { usePayments, usePaymentStats } from "@/hooks/use-payments";
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

export default function SuperAdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const limit = 15;
  const { data, isLoading } = usePayments(page, limit);
  const { data: stats, isLoading: statsLoading } = usePaymentStats();

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
    exportToCSV(exportData, `global_payments_export_${new Date().getTime()}.csv`);
    toast.success("Global payments exported successfully!");
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
          <h1 className="font-display text-3xl font-bold text-foreground">
            Global <span className="text-brand-orange">Finance Control</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor revenue and transactions across all branches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-surface-card border-surface-sunken" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="surface-card-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Revenue</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-green-500" /></div>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-2xl font-bold text-foreground">{formatCurrency(stats?.totalRevenue || 0)}</div>
            )}
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> All branches included
            </p>
          </CardContent>
        </Card>
        <Card className="surface-card-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Pending</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg"><Clock className="w-4 h-4 text-orange-500" /></div>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-2xl font-bold text-foreground">{formatCurrency(stats?.pendingDues || 0)}</div>
            )}
            <p className="text-xs text-orange-500 flex items-center mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card className="surface-card-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
            <div className="p-2 bg-brand-orange/10 rounded-lg"><CreditCard className="w-4 h-4 text-brand-orange" /></div>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-2xl font-bold text-foreground">{stats?.totalTransactions || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Successful transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <div className="surface-card-static rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-semibold text-foreground">Multi-Branch Transactions</h2>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Member</TableHead>
                <TableHead className="font-semibold">Branch</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No transactions found across branches.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: any) => {
                  const fullName = `${payment.member?.user?.firstName || ""} ${payment.member?.user?.lastName || ""}`.trim() || "Unknown Member";
                  const branchName = payment.branch?.name || "Global";
                  return (
                    <TableRow key={payment.id} className="hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{payment.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="border-white/10 text-xs font-normal">
                           {branchName}
                         </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{payment.method}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
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
          <div className="p-4 border-t border-white/5 bg-white/5 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/5"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                disabled={page === meta.pages}
                className="bg-white/5"
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
