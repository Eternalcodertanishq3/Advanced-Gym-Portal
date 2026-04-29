import { Attendance, Member } from "@prisma/client";

export interface AttendanceWithMember extends Attendance {
  member: Member;
}

export interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
}