import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./prisma", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

import { prisma } from "./prisma";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows the first request in a new window", async () => {
    (prisma.$queryRaw as ReturnType<typeof vi.fn>).mockResolvedValue([{ count: 1 }]);

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("uses the atomic upsert query for an expired window", async () => {
    (prisma.$queryRaw as ReturnType<typeof vi.fn>).mockResolvedValue([{ count: 1 }]);

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("denies requests once the limit is reached within the window", async () => {
    (prisma.$queryRaw as ReturnType<typeof vi.fn>).mockResolvedValue([{ count: 6 }]);

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("increments the counter for allowed requests within the window", async () => {
    (prisma.$queryRaw as ReturnType<typeof vi.fn>).mockResolvedValue([{ count: 3 }]);

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });
});
