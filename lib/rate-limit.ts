import type { NextRequest } from "next/server";
import { isIP } from "node:net";
import { Prisma } from "../src/generated/prisma/client";
import { prisma } from "./prisma";

export function getClientIp(request: NextRequest): string | null {
  const candidates = [
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0],
  ];
  for (const candidate of candidates) {
    const ip = candidate?.trim();
    if (ip && isIP(ip)) return ip;
  }
  return null;
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
  const cutoff = new Date(now.getTime() - windowMs);
  const rows = await prisma.$queryRaw<Array<{ count: number }>>(Prisma.sql`
    INSERT INTO "rate_limits" ("key", "count", "window_start")
    VALUES (${key}, 1, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "rate_limits"."window_start" <= ${cutoff} THEN 1
        WHEN "rate_limits"."count" <= ${limit} THEN "rate_limits"."count" + 1
        ELSE "rate_limits"."count"
      END,
      "window_start" = CASE
        WHEN "rate_limits"."window_start" <= ${cutoff} THEN ${now}
        ELSE "rate_limits"."window_start"
      END
    RETURNING "count"
  `);

  const count = rows[0]?.count;
  if (count === undefined) throw new Error("Rate limit update returned no row");

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}
