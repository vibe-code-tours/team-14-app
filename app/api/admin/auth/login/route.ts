import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminSession, setAdminSessionCookie } from "@/lib/admin-auth";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Rate limiting for admin login
    const ip = getClientIp(req);
    const rateKey = `admin:login:${email}:${ip}`;

    const { allowed } = await checkRateLimit(rateKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await verifyAdminCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials or not an admin account" }, { status: 401 });
    }

    const token = await createAdminSession(user);
    const cookie = setAdminSessionCookie(token);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        isAdmin: true,
        isSuperAdmin: user.isSuperAdmin,
      },
    });

    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
