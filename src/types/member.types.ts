import { Member, User, Subscription, Payment, Attendance, Progress, ClassBooking, Goal, DietPlan, WorkoutLog } from "@prisma/client";

export interface MemberWithUser extends Member {
  user: User;
}

export interface MemberDetail extends MemberWithUser {
  subscription?: Subscription | null;
  payments: Payment[];
  attendance: Attendance[];
  progress: Progress[];
  classBookings: ClassBooking[];
  goals: Goal[];
  dietPlans?: DietPlan[];
  workouts?: WorkoutLog[];
}