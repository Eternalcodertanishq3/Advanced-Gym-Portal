"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Building2, Users, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BranchMetric {
  name: string;
  members: number;
  revenue: number;
}

interface Props {
  data: BranchMetric[];
}

export function GlobalComparisonCharts({ data }: Props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!data || data.length === 0) {
    return (
      <div className="surface-card flex h-[400px] flex-col items-center justify-center border border-border p-6">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground/20" />
        <p className="text-sm text-muted-foreground">No branch data available for comparison.</p>
      </div>
    );
  }

  const COLORS = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Revenue Comparison */}
      <div className="glass-card group relative overflow-hidden rounded-3xl border border-border p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.03),transparent_70%)]" />

        <div className="relative z-10 mb-8 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <IndianRupee className="h-5 w-5 text-brand-orange" />
              Revenue per Branch
            </h3>
            <p className="text-xs text-muted-foreground">
              Comparative financial performance across locations
            </p>
          </div>
        </div>

        <div className="relative z-10 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border/20"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 10 }}
                className="text-muted-foreground/60"
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
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                formatter={(value: number) => [formatCurrency(value), "Revenue"]}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Distribution */}
      <div className="glass-card group relative overflow-hidden rounded-3xl border border-border p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.03),transparent_70%)]" />

        <div className="relative z-10 mb-8 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Users className="h-5 w-5 text-blue-400" />
              Member Distribution
            </h3>
            <p className="text-xs text-muted-foreground">
              Active member count comparison between branches
            </p>
          </div>
        </div>

        <div className="relative z-10 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border/20"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 10 }}
                className="text-muted-foreground/60"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 10 }}
                className="text-muted-foreground/60"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                formatter={(value: number) => [value, "Active Members"]}
              />
              <Bar dataKey="members" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[(index + 2) % COLORS.length]}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
