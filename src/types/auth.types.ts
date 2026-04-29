import { Role, UserStatus } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: Role;
  status: UserStatus;
  avatar?: string | null;
  phone?: string | null;
}
