import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "wv-admin-session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  return secret && new TextEncoder().encode(secret).byteLength >= 32
    ? new TextEncoder().encode(secret)
    : null;
}

async function getAdminToken(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { isAdmin?: boolean };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin/")) {
    if (req.method === "OPTIONS" || pathname.startsWith("/api/admin/auth/")) {
      return NextResponse.next();
    }
    if (!getSecret()) {
      return NextResponse.json({ error: "Authentication is unavailable" }, { status: 503 });
    }
    const adminToken = await getAdminToken(req);
    if (!adminToken?.isAdmin) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // Allow admin login page without auth
    if (pathname === "/admin/login") {
      const adminToken = await getAdminToken(req);
      if (adminToken?.isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Allow admin demo page without auth (public demo info)
    if (pathname === "/admin/demo") {
      return NextResponse.next();
    }

    // Allow admin auth API routes without auth check
    if (pathname.startsWith("/api/admin/auth")) {
      return NextResponse.next();
    }

    // For all other admin routes, require admin auth
    const adminToken = await getAdminToken(req);
    if (!adminToken || !adminToken.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
