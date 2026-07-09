import { NextRequest, NextResponse } from "next/server";
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
    const { allowed } = await checkRateLimit(`reset:${normalized}`, 5, 60 * 60 * 1000);

    // Always return a generic success response, even when rate-limited or the
    // account doesn't exist, so this endpoint can't be used to enumerate emails.
    if (allowed) {
      await requestPasswordReset(normalized);
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
