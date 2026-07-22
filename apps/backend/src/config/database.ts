/**
 * @file database.ts
 * @description Prisma Client singleton — prevents multiple instances during
 * hot-reload in development (Next.js / tsx watch pattern).
 */

import { PrismaClient } from '@prisma/client';
import { config } from './env';

declare global {
  // Allow reuse of the prisma instance across hot-reloads in development
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Creates a Prisma client with appropriate logging levels.
 * In production we only log warnings and errors.
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: config.isDevelopment
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
    errorFormat: config.isDevelopment ? 'pretty' : 'minimal',
  });
}

// Use the global singleton pattern to prevent connection pool exhaustion
export const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

if (config.isDevelopment) {
  global.__prisma = prisma;
}

/**
 * Gracefully disconnect from the database.
 * Should be called on process shutdown signals.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
