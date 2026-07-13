import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    verificationToken: { create: vi.fn(), findUnique: vi.fn(), delete: vi.fn() },
    passwordResetToken: { create: vi.fn(), findUnique: vi.fn(), deleteMany: vi.fn() },
  },
}));

vi.mock("./email", () => ({
  sendVerificationEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

import { prisma } from "./prisma";
import {
  registerUser,
  getPublicDisplayName,
  verifyEmail,
  resetPassword,
} from "./users";

describe("getPublicDisplayName", () => {
  it("returns the nickname when set", () => {
    expect(getPublicDisplayName({ nickname: "Sunshine", fullName: "Aye Aye" })).toBe(
      "Sunshine"
    );
  });

  it("falls back to fullName when no nickname is set", () => {
    expect(getPublicDisplayName({ nickname: null, fullName: "Aye Aye" })).toBe("Aye Aye");
  });
});

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a password shorter than 8 characters", async () => {
    await expect(
      registerUser({ email: "a@b.com", password: "short", fullName: "Aye Aye" })
    ).rejects.toThrow();
  });

  it("requires a full name", async () => {
    await expect(
      registerUser({ email: "a@b.com", password: "longenough", fullName: "" })
    ).rejects.toThrow();
  });

  it("rejects duplicate emails", async () => {
    (prisma.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "1" });

    await expect(
      registerUser({ email: "a@b.com", password: "longenough", fullName: "Aye Aye" })
    ).rejects.toThrow("already exists");
  });

  it("creates a user without requiring a nickname", async () => {
    (prisma.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "1",
      email: "a@b.com",
      fullName: "Aye Aye",
      nickname: null,
    });
    (prisma.verificationToken.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const result = await registerUser({
      email: "a@b.com",
      password: "longenough",
      fullName: "Aye Aye",
    });

    expect(result.nickname).toBeNull();
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nickname: null }),
      })
    );
  });

  it("treats an empty-string nickname the same as an omitted one", async () => {
    (prisma.user.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "1",
      email: "a@b.com",
      fullName: "Aye Aye",
      nickname: null,
    });
    (prisma.verificationToken.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    // A registration form always submits a `nickname` field, even when the
    // worker leaves it blank — this must not be rejected as invalid input.
    await expect(
      registerUser({
        email: "a@b.com",
        password: "longenough",
        fullName: "Aye Aye",
        nickname: "",
      })
    ).resolves.not.toThrow();

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nickname: null }),
      })
    );
  });
});

describe("verifyEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when the token has expired", async () => {
    (prisma.verificationToken.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      identifier: "a@b.com",
      token: "hashed",
      expires: new Date(Date.now() - 1000),
    });

    await expect(verifyEmail("rawtoken", "a@b.com")).rejects.toThrow(/invalid or has expired/);
  });

  it("throws when no matching token exists", async () => {
    (prisma.verificationToken.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(verifyEmail("rawtoken", "a@b.com")).rejects.toThrow(/invalid or has expired/);
  });
});

describe("resetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a password shorter than 8 characters", async () => {
    await expect(resetPassword("token", "short")).rejects.toThrow(/at least 8/);
  });

  it("throws when the reset token has expired", async () => {
    (prisma.passwordResetToken.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      userId: "1",
      token: "hashed",
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(resetPassword("token", "longenough")).rejects.toThrow(/invalid or has expired/);
  });
});
