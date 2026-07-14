"use client";

import { useState } from "react";
import {
  Download,
  Filter,
  Receipt,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Clock,
} from "lucide-react";
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
      Member:
        `${p.member?.user?.firstName || ""} ${p.member?.user?.lastName || ""}`.trim() || "Unknown",
      Amount: p.amount,
      Method: p.method,
      Status: p.status,
      Date: formatDate(p.createdAt),
      Reference: p.receiptNo || "N/A",
    }));
    exportToCSV(exportData, `global_payments_export_${new Date().getTime()}.csv`);
    toast.success("Global payments exported successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="border-0 bg-green-100 text-green-800 shadow-none hover:bg-green-100">
            Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="border-0 bg-orange-100 text-orange-800 shadow-none hover:bg-orange-100">
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="border-0 bg-red-100 text-red-800 shadow-none hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Global <span className="text-brand-orange">Finance Control</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor revenue and transactions across all branches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-surface-sunken bg-surface-card"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="surface-card-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Global Revenue
            </CardTitle>
            <div className="rounded-lg bg-green-500/10 p-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats?.totalRevenue || 0)}
              </div>
            )}
            <p className="mt-1 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" /> All branches included
            </p>
          </CardContent>
        </Card>
        <Card className="surface-card-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Global Pending
            </CardTitle>
            <div className="rounded-lg bg-orange-500/10 p-2">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats?.pendingDues || 0)}
              </div>
            )}
            <p className="mt-1 flex items-center text-xs text-orange-500">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card className="surface-card-static">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Volume
            </CardTitle>
            <div className="rounded-lg bg-brand-orange/10 p-2">
              <CreditCard className="h-4 w-4 text-brand-orange" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {stats?.totalTransactions || 0}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <div className="surface-card-static overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <h2 className="font-semibold text-foreground">Multi-Branch Transactions</h2>
          <Button variant="outline" size="sm" className="border-white/5 bg-white/5">
            <Filter className="mr-2 h-4 w-4" />
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
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-24" />
                    </TableCell>
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
                  const fullName =
                    `${payment.member?.user?.firstName || ""} ${payment.member?.user?.lastName || ""}`.trim() ||
                    "Unknown Member";
                  const branchName = payment.branch?.name || "Global";
                  return (
                    <TableRow key={payment.id} className="transition-colors hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{payment.id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{fullName}</div>
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
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
          <div className="flex items-center justify-between border-t border-white/5 bg-white/5 p-4">
            <span className="text-sm text-muted-foreground">
              Showing page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/5"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
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
