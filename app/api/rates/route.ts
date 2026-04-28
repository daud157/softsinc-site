import { NextResponse } from "next/server";

import {
  FALLBACK_RATES_FROM_PKR,
  type CurrencyCode,
} from "@/lib/currency";

export const revalidate = 3600;

type ErResponse = {
  result?: string;
  conversion_rates?: Record<string, number>;
};

function pickRates(raw: Record<string, number> | undefined) {
  const keys: CurrencyCode[] = ["PKR", "USD", "EUR", "GBP", "AED"];
  const out: Partial<Record<CurrencyCode, number>> = {};
  if (!raw) return null;
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) out[k] = v;
  }
  if (typeof out.PKR !== "number") out.PKR = 1;
  return out.USD ? (out as Record<CurrencyCode, number>) : null;
}

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/PKR", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as ErResponse;
    if (data.result !== "success" || !data.conversion_rates) {
      throw new Error("bad payload");
    }
    const picked = pickRates(data.conversion_rates);
    if (picked) {
      return NextResponse.json({
        rates: picked,
        source: "er-api",
        updatedAt: Date.now(),
      });
    }
  } catch {
    /* fall through */
  }

  return NextResponse.json({
    rates: FALLBACK_RATES_FROM_PKR,
    source: "fallback",
    updatedAt: null as number | null,
  });
}
