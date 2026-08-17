/* eslint-disable no-console */
// ═══════════════════════════════════════════════════════════════
// 🦅 GymFlow SaaS — Structured Multi-Tenant Observability Logger
// Lightweight, low-overhead JSON telemetry tagging tenantId & branchId
// ═══════════════════════════════════════════════════════════════

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogContext {
  tenantId?: string;
  branchId?: string;
  userId?: string;
  path?: string;
  durationMs?: number;
  [key: string]: unknown;
}

function normalizeArgs(arg1: unknown, arg2?: unknown): { msg: string; ctx?: LogContext } {
  if (typeof arg1 === "string") {
    return {
      msg: arg1,
      ctx: typeof arg2 === "object" && arg2 !== null ? (arg2 as LogContext) : undefined,
    };
  }
  if (typeof arg1 === "object" && arg1 !== null) {
    const msg = typeof arg2 === "string" ? arg2 : "Log event";
    return {
      msg,
      ctx: arg1 as LogContext,
    };
  }
  return { msg: String(arg1), ctx: undefined };
}

function formatLog(level: LogLevel, arg1: unknown, arg2?: unknown) {
  const timestamp = new Date().toISOString();
  const { msg, ctx } = normalizeArgs(arg1, arg2);

  const entry = {
    timestamp,
    level,
    message: msg,
    ...ctx,
  };

  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }

  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const tenantTag = ctx?.tenantId ? ` [tenant:${ctx.tenantId}]` : "";
  const branchTag = ctx?.branchId ? ` [branch:${ctx.branchId}]` : "";
  return `${prefix}${tenantTag}${branchTag} ${msg}`;
}

export const logger = {
  info(arg1: unknown, arg2?: unknown) {
    console.log(formatLog("info", arg1, arg2));
  },
  warn(arg1: unknown, arg2?: unknown) {
    console.warn(formatLog("warn", arg1, arg2));
  },
  error(arg1: unknown, arg2?: unknown, arg3?: unknown) {
    if (arg1 instanceof Error) {
      const errCtx = {
        errorName: arg1.name,
        errorMessage: arg1.message,
        stack: arg1.stack,
        ...(typeof arg2 === "object" && arg2 !== null ? (arg2 as object) : {}),
      };
      const msg = typeof arg2 === "string" ? arg2 : typeof arg3 === "string" ? arg3 : arg1.message;
      console.error(formatLog("error", msg, errCtx));
    } else {
      console.error(formatLog("error", arg1, arg2));
    }
  },
  debug(arg1: unknown, arg2?: unknown) {
    if (process.env.NODE_ENV !== "production" || process.env.DEBUG === "true") {
      console.debug(formatLog("debug", arg1, arg2));
    }
  },
};

export default logger;
