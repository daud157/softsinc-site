import { timingSafeEqual } from "node:crypto";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionSecret,
  getEffectiveAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/adminSession";

/**
 * Optional admin auth gate.
 *
 * If an effective admin password exists (env `ADMIN_PASSWORD`, or the dev-only
 * fallback in `next dev`), mutating routes require either:
 * - Valid signed session cookie (from POST /api/admin/login), or
 * - `x-admin-password` header matching that password, or
 * - `Authorization: Bearer <password>` (for scripts).
 *
 * If no effective password (production without env), all requests are accepted.
 */
function timingSafeEqualUtf8(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function getSessionCookieFromRequest(request: Request): string | undefined {
  const raw = request.headers.get("cookie");
  if (!raw) return undefined;
  for (const segment of raw.split(";")) {
    const part = segment.trim();
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    if (name === ADMIN_SESSION_COOKIE) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const expected = getEffectiveAdminPassword();
  if (!expected) return true;

  const provided =
    request.headers.get("x-admin-password") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (provided && timingSafeEqualUtf8(provided, expected)) {
    return true;
  }

  const secret = getAdminSessionSecret();
  if (!secret) return false;

  const token = getSessionCookieFromRequest(request);
  return verifyAdminSessionToken(secret, token);
}

export const ADMIN_HEADER = "x-admin-password";
