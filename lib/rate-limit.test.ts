import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./prisma", () => ({
  prisma: {
    rateLimit: { findUnique: vi.fn(), upsert: vi.fn(), update: vi.fn() },
  },
}));

import { prisma } from "./prisma";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows the first request in a new window", async () => {
    (prisma.rateLimit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.rateLimit.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("resets the counter once the window has elapsed", async () => {
    (prisma.rateLimit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      key: "key",
      count: 5,
      windowStart: new Date(Date.now() - 120_000),
    });
    (prisma.rateLimit.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(prisma.rateLimit.upsert).toHaveBeenCalled();
  });

  it("denies requests once the limit is reached within the window", async () => {
    (prisma.rateLimit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      key: "key",
      count: 5,
      windowStart: new Date(),
    });

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("increments the counter for allowed requests within the window", async () => {
    (prisma.rateLimit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      key: "key",
      count: 2,
      windowStart: new Date(),
    });
    (prisma.rateLimit.update as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const result = await checkRateLimit("key", 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(prisma.rateLimit.update).toHaveBeenCalledWith({
      where: { key: "key" },
      data: { count: 3 },
    });
  });
});
