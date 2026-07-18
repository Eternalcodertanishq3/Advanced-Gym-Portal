import { Role, UserStatus } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      firstName: string;
      lastName: string;
      status: UserStatus;
      impersonatorId?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: Role;
    firstName: string;
    lastName: string;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    firstName: string;
    lastName: string;
  }
}
