import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestPasswordReset } from "@/lib/users";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    // Check if a non-admin user exists with this email
    const user = await prisma.user.findFirst({
      where: { email: normalized, isAdmin: false },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email does not exist" },
        { status: 404 }
      );
    }

    const { allowed } = await checkRateLimit(`reset:${normalized}`, 5, 60 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    await requestPasswordReset(normalized);

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
