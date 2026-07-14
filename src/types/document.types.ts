import { Document, Member } from "@prisma/client";

export interface DocumentWithMember extends Document {
  member: Member;
}
