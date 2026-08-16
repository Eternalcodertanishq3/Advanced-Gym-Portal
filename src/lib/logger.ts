import pino from "pino";

/**
 * 🦅 GymFlow SaaS — Server Logging Engine
 * Configured synchronously to prevent Node.js worker thread crashes in Next.js HMR & Serverless runtimes.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    env: process.env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
});
