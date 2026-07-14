import { Payment, Member } from "@prisma/client";

export interface PaymentWithMember extends Payment {
  member: Member;
}
