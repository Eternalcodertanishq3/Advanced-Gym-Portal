"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-orange/20" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="surface-card flex h-full min-h-[350px] flex-col items-center justify-center p-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <TrendingUp className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-bold text-foreground/60">No revenue data yet</h3>
          <p className="text-xs text-muted-foreground/40">
            Analytics will appear once payments are recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[400px] w-full flex-col pt-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Revenue Growth Analysis</h3>
          <p className="text-xs text-muted-foreground">
            Monthly income trajectory across all branches
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
              Live Revenue
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E85D26" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E85D26" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-border/30"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 10 }}
              className="text-muted-foreground/60"
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 10 }}
              className="text-muted-foreground/60"
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "hsl(var(--primary))" }}
              formatter={(value: number) => [formatCurrency(value), "Revenue"]}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#E85D26"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
