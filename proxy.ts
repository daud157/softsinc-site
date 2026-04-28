import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionSecret,
  getEffectiveAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/adminSession";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const expectedPw = getEffectiveAdminPassword();
  const secret = expectedPw ? getAdminSessionSecret() : "";

  if (pathname === "/admin/login") {
    if (expectedPw && secret) {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (await verifyAdminSessionToken(secret, token)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  if (!expectedPw) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifyAdminSessionToken(secret, token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
