import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/users";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit(`register:${ip}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { email, password, fullName, nickname } = body;

    if (!email?.trim() || !password || !fullName?.trim()) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 });
    }

    const result = await registerUser({ email, password, fullName, nickname });

    return NextResponse.json(
      { message: "Registration successful. Please check your email to verify your account.", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
