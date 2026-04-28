"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CURRENCY_ORDER,
  FALLBACK_RATES_FROM_PKR,
  formatFromPkr,
  normalizeRates,
  type CurrencyCode,
} from "@/lib/currency";

const STORAGE_KEY = "softsinc-currency";

type RatesState = Record<CurrencyCode, number>;

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  cycleCurrency: () => void;
  rates: RatesState;
  ratesSource: "api" | "fallback" | "loading";
  format: (amountPkr: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "PKR";
  try {
    const s = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (s && CURRENCY_ORDER.includes(s)) return s;
  } catch {
    /* ignore */
  }
  return "PKR";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("PKR");
  const [rates, setRates] = useState<RatesState>(FALLBACK_RATES_FROM_PKR);
  const [ratesSource, setRatesSource] = useState<"api" | "fallback" | "loading">(
    "loading"
  );
  const initCurrencyRef = useRef(false);

  useEffect(() => {
    if (!initCurrencyRef.current) {
      initCurrencyRef.current = true;
      setCurrencyState(readStoredCurrency());
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/rates", { cache: "no-store" });
        const j = (await res.json()) as {
          rates?: Record<string, number>;
          source?: string;
        };
        if (cancelled) return;
        const n = normalizeRates(j.rates ?? null);
        setRates(n);
        setRatesSource(j.source === "er-api" ? "api" : "fallback");
      } catch {
        if (!cancelled) {
          setRates(FALLBACK_RATES_FROM_PKR);
          setRatesSource("fallback");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const cycleCurrency = useCallback(() => {
    const i = CURRENCY_ORDER.indexOf(currency);
    const next = CURRENCY_ORDER[(i + 1) % CURRENCY_ORDER.length]!;
    setCurrency(next);
  }, [currency, setCurrency]);

  const format = useCallback(
    (amountPkr: number) => formatFromPkr(amountPkr, currency, rates),
    [currency, rates]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      cycleCurrency,
      rates,
      ratesSource,
      format,
    }),
    [currency, setCurrency, cycleCurrency, rates, ratesSource, format]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useMoney() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useMoney must be used within CurrencyProvider");
  }
  return ctx;
}
