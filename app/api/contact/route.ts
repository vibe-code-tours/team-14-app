import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateKey = `contact:${ip}`;

    const { allowed } = await checkRateLimit(
      rateKey,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 255) {
      return NextResponse.json(
        { error: "Invalid name." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return NextResponse.json(
        { error: "Invalid email." },
        { status: 400 }
      );
    }

    if (typeof subject !== "string" || subject.length > 500) {
      return NextResponse.json(
        { error: "Invalid subject." },
        { status: 400 }
      );
    }

    if (typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message." },
        { status: 400 }
      );
    }

    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // Store in database
    await prisma.contactMessage.create({
      data: {
        name: escapeHtml(trimmed.name),
        email: escapeHtml(trimmed.email),
        subject: escapeHtml(trimmed.subject),
        message: escapeHtml(trimmed.message),
        ip,
      },
    });

    // Send notification email
    await sendContactEmail(trimmed);

    return NextResponse.json(
      { message: "Message sent successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
