import type { NextRequest } from "next/server";
import { prisma } from "./prisma";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

// Fixed-window rate limiter backed by Postgres so limits hold correctly
// across multiple app instances (an in-memory counter would not).
// Uses atomic operations to prevent race conditions.
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();

  // Use a transaction to ensure atomic check-and-update
  return prisma.$transaction(async (tx) => {
    const existing = await tx.rateLimit.findUnique({ where: { key } });

    // If no record exists or window has expired, create/reset
    if (!existing || now.getTime() - existing.windowStart.getTime() >= windowMs) {
      await tx.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });
      return { allowed: true, remaining: limit - 1 };
    }

    // If at limit, reject
    if (existing.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    // Atomically increment and return new count
    const updated = await tx.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
      select: { count: true },
    });

    return { allowed: true, remaining: Math.max(0, limit - updated.count) };
  });
}
