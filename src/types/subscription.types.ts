import { Subscription, Plan, Member, Payment } from "@prisma/client";

export interface SubscriptionWithPlan extends Subscription {
  plan: Plan;
}

export interface SubscriptionDetail extends SubscriptionWithPlan {
  member: Member;
  payments: Payment[];
}
