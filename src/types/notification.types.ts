import { Notification, User } from "@prisma/client";

export interface NotificationWithUser extends Notification {
  user: User;
}
