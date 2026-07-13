import { NextResponse } from "next/server";
import { deleteAdminSession } from "@/lib/admin-auth";

export async function POST() {
  await deleteAdminSession();

  const response = NextResponse.json({ ok: true });
  return response;
}
