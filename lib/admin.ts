import { NextRequest } from "next/server";

export function verifyAdminAuth(request: NextRequest): boolean {
  const adminKey = request.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    console.error("ADMIN_KEY environment variable not set");
    return false;
  }

  return adminKey === expectedKey;
}
