import type { NextRequest } from "next/server";
import { prisma } from "./prisma";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

// Fixed-window rate limiter backed by Postgres so limits hold correctly
// across multiple app instances (an in-memory counter would not).
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();

  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() >= windowMs) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: existing.count + 1 },
  });

  return { allowed: true, remaining: limit - existing.count - 1 };
}
