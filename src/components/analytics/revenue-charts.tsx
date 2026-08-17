"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Layers } from "lucide-react";

interface RevenueChartsProps {
  monthlyRevenue: { month: string; subscriptions: number; retail: number; total: number }[];
  methodDistribution: { name: string; value: number }[];
}

export function RevenueInteractiveCharts({
  monthlyRevenue,
  methodDistribution,
}: RevenueChartsProps) {
  const tooltipStyle = {
    backgroundColor: "hsl(var(--background))",
    borderColor: "hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Monthly Revenue Growth Area Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Monthly Gross Revenue Inflow Curve
          </CardTitle>
          <CardDescription>
            Gross revenue generated from online subscriptions and front-desk POS collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyRevenue}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Gross Revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Revenue Stream Composition Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-primary" />
            Revenue by Channel
          </CardTitle>
          <CardDescription>Subscription plans vs. retail POS merchandise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue.slice(-4)}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }} />
                <Bar
                  dataKey="subscriptions"
                  name="Subscriptions"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="retail" name="POS Retail" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            {methodDistribution.map((item) => (
              <div key={item.name} className="flex flex-col">
                <span>{item.name}</span>
                <span className="font-semibold text-foreground">
                  ₹{item.value.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
