import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect /account routes - require login
  if (pathname.startsWith("/account")) {
    if (!req.auth?.user) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes - require admin login
  if (pathname.startsWith("/admin")) {
    // Allow login page without auth
    if (pathname === "/admin/login") {
      return;
    }

    if (!req.auth?.user) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin role
    if (!(req.auth.user as any).isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
