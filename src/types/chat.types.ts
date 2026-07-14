import { Message, User } from "@prisma/client";

export interface MessageWithUsers extends Message {
  sender: User;
  receiver: User;
}
