/**
 * Signed admin session cookie (HMAC-SHA256, Web Crypto — works in Node + Edge).
 * Secret: ADMIN_SESSION_SECRET if set, else effective admin password.
 */

export const ADMIN_SESSION_COOKIE = "softsinc_admin_session";

/**
 * Production: set `ADMIN_PASSWORD` in the environment (never commit real values).
 * Development: if `ADMIN_PASSWORD` is unset, a fixed dev password is used so
 * `/admin` works out of the box — change the constant below for your machine.
 */
const DEV_ADMIN_PASSWORD_FALLBACK = "softsinc-dev-admin";

/** Resolved admin gate password (env wins; dev-only fallback otherwise). */
export function getEffectiveAdminPassword(): string {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return DEV_ADMIN_PASSWORD_FALLBACK;
  return "";
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function encoder() {
  return new TextEncoder();
}

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1) {
    bin += String.fromCharCode(bytes[i]!);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array | null {
  try {
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i)!;
    return out;
  } catch {
    return null;
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i += 1) {
    x |= a.charCodeAt(i)! ^ b.charCodeAt(i)!;
  }
  return x === 0;
}

async function hmacSign(secret: string, message: string): Promise<string> {
  const enc = encoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return base64UrlEncode(new Uint8Array(sig));
}

export function getAdminSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() || getEffectiveAdminPassword() || ""
  );
}

export async function signAdminSession(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const payloadB64 = base64UrlEncode(
    encoder().encode(JSON.stringify({ exp, v: 1 }))
  );
  const sig = await hmacSign(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifyAdminSessionToken(
  secret: string,
  token: string | undefined
): Promise<boolean> {
  if (!secret || !token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!payloadB64 || !sigB64) return false;

  const expectedSig = await hmacSign(secret, payloadB64);
  if (!timingSafeEqualStr(expectedSig, sigB64)) return false;

  const bytes = base64UrlToBytes(payloadB64);
  if (!bytes) return false;
  try {
    const json = JSON.parse(new TextDecoder().decode(bytes)) as { exp?: number };
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}

export function adminSessionCookieMaxAgeSec(): number {
  return Math.floor(SESSION_TTL_MS / 1000);
}
