import { NextResponse } from "next/server";

/** Maps Mongo/driver network failures to a 503 + message; otherwise null. */
export function nextResponseForMongoNetworkError(err: unknown): NextResponse | null {
  const msg = err instanceof Error ? err.message : String(err);
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: unknown }).code)
      : "";
  const isNet =
    code === "ETIMEOUT" ||
    code === "ENOTFOUND" ||
    code === "ESERVFAIL" ||
    code === "ETIMEDOUT" ||
    /ETIMEOUT|ETIMEDOUT|queryTxt|MongoServerSelectionError|getaddrinfo|ECONNRESET|ENOTFOUND/i.test(
      msg
    );
  if (!isNet) return null;
  return NextResponse.json(
    {
      error:
        "Database unreachable (network or DNS timeout). Check your connection/VPN and MongoDB Atlas → Network Access (allow your IP, or 0.0.0.0/0 for development only).",
    },
    { status: 503 }
  );
}

export function nextResponseForMongoOr500(
  err: unknown,
  fallbackMessage: string
): NextResponse {
  const net = nextResponseForMongoNetworkError(err);
  if (net) return net;
  const msg = err instanceof Error ? err.message : fallbackMessage;
  return NextResponse.json({ error: msg }, { status: 500 });
}
