import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAttendanceHistory, getAttendanceStats } from "@/actions/member/attendance-actions";
import { AttendanceCalendar } from "./components/attendance-calendar";

export const metadata = {
  title: "Attendance History | Eagle Gym",
  description: "Track your gym visits and maintain your consistency streak.",
};

export default async function AttendancePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [historyRes, statsRes] = await Promise.all([getAttendanceHistory(), getAttendanceStats()]);

  const logs = historyRes.success ? historyRes.data : [];
  const stats = statsRes.success ? statsRes.data : { total: 0, thisMonth: 0, streak: 0 };

  return (
    <div className="mx-auto h-full w-full max-w-7xl p-2 md:p-6">
      <AttendanceCalendar initialLogs={logs as any} stats={stats} />
    </div>
  );
}
