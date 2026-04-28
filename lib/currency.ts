export type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "AED";

export const CURRENCY_ORDER: CurrencyCode[] = ["PKR", "USD", "EUR", "GBP", "AED"];

export const CURRENCY_FLAGS: Record<CurrencyCode, string> = {
  PKR: "🇵🇰",
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  AED: "🇦🇪",
};

/** Multiplier: foreign = amountPKR * rate (same shape as open.er-api `conversion_rates`). */
export const FALLBACK_RATES_FROM_PKR: Record<CurrencyCode, number> = {
  PKR: 1,
  USD: 0.00358,
  EUR: 0.00328,
  GBP: 0.00276,
  AED: 0.01315,
};

export function normalizeRates(
  raw: Record<string, number> | null | undefined
): Record<CurrencyCode, number> {
  const out = { ...FALLBACK_RATES_FROM_PKR };
  if (!raw) return out;
  for (const c of CURRENCY_ORDER) {
    const v = raw[c];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) out[c] = v;
  }
  return out;
}

/**
 * Format a PKR-denominated amount in the selected currency.
 * All catalog prices in the DB are treated as PKR.
 */
export function formatFromPkr(
  amountPkr: number,
  code: CurrencyCode,
  rates: Record<CurrencyCode, number>
): string {
  const rate = rates[code] ?? FALLBACK_RATES_FROM_PKR[code];
  const n = Number(amountPkr);
  if (!Number.isFinite(n)) return "—";

  if (code === "PKR") {
    return `Rs. ${new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 0,
    }).format(Math.round(n))}`;
  }

  const foreign = n * rate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: foreign < 1 ? 2 : foreign < 100 ? 2 : 0,
    minimumFractionDigits: 0,
  }).format(foreign);
}
