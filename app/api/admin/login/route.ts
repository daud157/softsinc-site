import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieMaxAgeSec,
  getAdminSessionSecret,
  getEffectiveAdminPassword,
  signAdminSession,
} from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expected = getEffectiveAdminPassword();
  if (!expected) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD is not set. Set it in the server environment to enable admin login.",
      },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const secret = getAdminSessionSecret();
  const token = await signAdminSession(secret);

  const res = NextResponse.json({ ok: true }, { status: 200 });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: adminSessionCookieMaxAgeSec(),
  });
  return res;
}
