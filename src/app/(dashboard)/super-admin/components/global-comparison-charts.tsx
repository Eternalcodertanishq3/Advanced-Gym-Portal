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
  Cell
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
      <div className="surface-card p-6 h-[400px] flex flex-col items-center justify-center border border-border">
        <Building2 className="w-12 h-12 text-muted-foreground/20 mb-4" />
        <p className="text-sm text-muted-foreground">No branch data available for comparison.</p>
      </div>
    );
  }

  const COLORS = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Revenue Comparison */}
      <div className="glass-card p-6 rounded-2xl border border-border relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.03),transparent_70%)]" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-brand-orange" />
              Revenue per Branch
            </h3>
            <p className="text-xs text-muted-foreground">Comparative financial performance across locations</p>
          </div>
        </div>

        <div className="h-[300px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
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
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: number) => [formatCurrency(value), "Revenue"]}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Distribution */}
      <div className="glass-card p-6 rounded-2xl border border-border relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.03),transparent_70%)]" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Member Distribution
            </h3>
            <p className="text-xs text-muted-foreground">Active member count comparison between branches</p>
          </div>
        </div>

        <div className="h-[300px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
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
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: number) => [value, "Active Members"]}
              />
              <Bar dataKey="members" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
