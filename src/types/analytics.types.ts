export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  attendanceRate: number;
  activeClasses: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  expenses?: number;
}
