import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");
const ADMIN_COOKIE = "wv-admin-session";

async function getAdminToken(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { isAdmin?: boolean };
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  matcher: ["/admin/:path*", "/api/admin/auth/:path*"],
};
