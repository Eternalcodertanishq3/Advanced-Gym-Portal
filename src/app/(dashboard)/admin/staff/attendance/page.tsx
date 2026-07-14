import React from "react";
import { getStaffAttendance } from "@/actions/admin/staff-management-actions";
import { StaffAttendanceClient } from "./components/staff-attendance-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Staff Attendance | Eagle Gym",
  description: "Monitor employee presence and shift timings.",
};

export default async function StaffAttendancePage() {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  const res = await getStaffAttendance(50);

  if (!res.success) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-foreground">Failed to load attendance</h2>
        <p className="mt-2 text-sm text-txt-secondary">{res.error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <StaffAttendanceClient attendance={res.data || []} />
    </div>
  );
}
