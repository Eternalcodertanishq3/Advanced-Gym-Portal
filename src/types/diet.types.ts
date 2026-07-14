import { DietPlan, Trainer, Member, DietLog } from "@prisma/client";

export interface DietPlanWithRelations extends DietPlan {
  trainer?: Trainer | null;
  member?: Member | null;
}

export interface DietLogWithDetails extends DietLog {
  member: Member;
}
