import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestPasswordReset } from "@/lib/users";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const genericResponse = () => NextResponse.json({
    message: "If an account with that email exists, a password reset link has been sent.",
  });

  try {
    const body = await request.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    const ip = getClientIp(request);
    if (!ip) return genericResponse();
    const [ipLimit, accountLimit] = await Promise.all([
      checkRateLimit(`reset:ip:${ip}`, 30, 60 * 60 * 1000),
      checkRateLimit(`reset:account:${normalized}`, 5, 60 * 60 * 1000),
    ]);
    if (!ipLimit.allowed || !accountLimit.allowed) return genericResponse();

    // Check if a non-admin user exists with this email
    const user = await prisma.user.findFirst({
      where: { email: normalized, isAdmin: false },
    });

    if (user) await requestPasswordReset(normalized);
    return genericResponse();
  } catch (error) {
    console.error("Password reset request failed:", error);
    return genericResponse();
  }
}
