import { Trainer, User, Member, GymClass, PTSession } from "@prisma/client";

export interface TrainerWithUser extends Trainer {
  user: User;
}

export interface TrainerDetail extends TrainerWithUser {
  members: Member[];
  classes: GymClass[];
  sessions: PTSession[];
}