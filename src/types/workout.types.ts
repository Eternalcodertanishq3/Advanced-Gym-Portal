import { WorkoutPlan, Exercise, WorkoutLog, Trainer, Member } from "@prisma/client";

export interface WorkoutPlanWithExercises extends WorkoutPlan {
  exercises: Exercise[];
  trainer?: Trainer | null;
}

export interface WorkoutLogWithDetails extends WorkoutLog {
  workoutPlan: WorkoutPlan;
  member: Member;
}
