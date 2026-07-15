import { NextRequest, NextResponse } from "next/server";
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

    const { allowed } = await checkRateLimit(`verify:${normalized}`, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    await resendVerificationEmail(normalized);

    return NextResponse.json({
      message: "If an account with that email exists and is unverified, a verification link has been sent.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
