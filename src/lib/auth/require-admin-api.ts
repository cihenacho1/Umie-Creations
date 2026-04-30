import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";

export async function requireAdminApi(): Promise<{ ok: true } | Response> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!(await verifyAdminSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { ok: true };
}
