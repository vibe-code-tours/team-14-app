import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resendVerificationEmail } from "@/lib/users";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    const { allowed } = await checkRateLimit(`check-verify:${normalized}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Check if user exists and is not verified
    const user = await prisma.user.findFirst({
      where: { email: normalized, isAdmin: false },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return NextResponse.json({ verified: false, emailNotVerified: false });
    }

    if (user.emailVerified) {
      return NextResponse.json({ verified: true, emailNotVerified: false });
    }

    // Email exists but is not verified - send verification email
    await resendVerificationEmail(normalized);

    return NextResponse.json({ verified: false, emailNotVerified: true });
  } catch (error) {
    console.error("Error checking email verification:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
