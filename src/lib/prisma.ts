import { PrismaClient } from "@prisma/client";
import type { AsyncLocalStorage as AsyncLocalStorageType } from "async_hooks";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Prisma Client Singleton with Multi-Tenancy
// ═══════════════════════════════════════════════════════════════

export const tenantStorage =
  typeof window === "undefined"
    ? new (require("async_hooks").AsyncLocalStorage as typeof AsyncLocalStorageType)<{
        tenantId: string;
      }>()
    : (null as any);

const globalForPrisma = globalThis as any as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const SOFT_DELETE_MODELS = [
  "user",
  "member",
  "payment",
  "subscription",
  "attendance",
  "message",
  "document",
] as const;

const TENANT_SCOPED_MODELS = [
  "branch",
  "user",
  "plan",
  "subscription",
  "payment",
  "attendance",
  "gymclass",
  "ptsession",
  "workoutplan",
  "dietplan",
  "equipment",
  "product",
  "sale",
  "task",
  "conversation",
  "notification",
  "document",
  "visitorpass",
  "gymsetting",
  "backup",
  "testimonial",
] as const;

export async function resolveTenantId(): Promise<string | undefined> {
  let tenantId = tenantStorage.getStore()?.tenantId;
  if (!tenantId) {
    try {
      const { headers } = require("next/headers");
      const headersList = await headers();
      tenantId = headersList.get("x-tenant-id") || undefined;
    } catch {
      // safe fallback for builds/scripts/initial nextauth loads
    }
  }
  return tenantId;
}

async function applyFilters(model: string, args: any) {
  const tenantId = await resolveTenantId();
  args.where = args.where || {};

  // Inject tenantId filter if in tenant context
  if (tenantId && TENANT_SCOPED_MODELS.includes(model.toLowerCase() as any)) {
    args.where = { ...args.where, tenantId };
  }

  // Inject soft-delete filter if applicable
  if (SOFT_DELETE_MODELS.includes(model.toLowerCase() as any)) {
    args.where = { ...args.where, deletedAt: null };
  }
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  return client.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          await applyFilters(model, args);
          return query(args);
        },
        async findFirst({ model, args, query }) {
          await applyFilters(model, args);
          return query(args);
        },
        async findFirstOrThrow({ model, args, query }) {
          await applyFilters(model, args);
          return query(args);
        },
        async findUnique({ model, args, query }) {
          const tenantId = await resolveTenantId();
          if (tenantId && TENANT_SCOPED_MODELS.includes(model.toLowerCase() as any)) {
            await applyFilters(model, args);
            return (client as any)[model].findFirst(args);
          }
          if (SOFT_DELETE_MODELS.includes(model.toLowerCase() as any)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
        async count({ model, args, query }) {
          await applyFilters(model, args);
          return query(args);
        },
        async update({ model, args, query }) {
          await applyFilters(model, args);
          return query(args);
        },
        async updateMany({ model, args, query }) {
          await applyFilters(model, args);
          return query(args);
        },
        async delete({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model.toLowerCase() as any)) {
            return (client as any)[model].update({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }
          await applyFilters(model, args);
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (SOFT_DELETE_MODELS.includes(model.toLowerCase() as any)) {
            return (client as any)[model].updateMany({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }
          await applyFilters(model, args);
          return query(args);
        },
        async create({ model, args, query }) {
          const tenantId = await resolveTenantId();
          if (tenantId && TENANT_SCOPED_MODELS.includes(model.toLowerCase() as any)) {
            args.data = { ...args.data, tenantId } as any;
          }
          return query(args);
        },
        async createMany({ model, args, query }) {
          const tenantId = await resolveTenantId();
          if (tenantId && TENANT_SCOPED_MODELS.includes(model.toLowerCase() as any)) {
            if (Array.isArray(args.data)) {
              args.data = args.data.map((item: any) => ({ ...item, tenantId })) as any;
            } else {
              args.data = { ...args.data, tenantId } as any;
            }
          }
          return query(args);
        },
        async upsert({ model, args, query }) {
          const tenantId = await resolveTenantId();
          if (tenantId && TENANT_SCOPED_MODELS.includes(model.toLowerCase() as any)) {
            args.where = { ...args.where, tenantId } as any;
            args.create = { ...args.create, tenantId } as any;
            args.update = { ...args.update, tenantId } as any;
          }
          return query(args);
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
