"use client";

import { useState } from "react";

import { useMoney } from "@/components/providers/CurrencyProvider";
import { cn } from "@/lib/cn";
import { CURRENCY_FLAGS, CURRENCY_ORDER } from "@/lib/currency";

export function CurrencyMenu({
  className,
  compact,
}: {
  className?: string;
  /** Narrow trigger for product navbar */
  compact?: boolean;
}) {
  const { currency, setCurrency, ratesSource } = useMoney();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "inline-flex touch-manipulation items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-sm transition hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)] dark:hover:bg-white/8 dark:focus-visible:ring-offset-zinc-950",
          compact && "h-11 px-2.5"
        )}
      >
        <span aria-hidden>{CURRENCY_FLAGS[currency]}</span>
        <span>{currency}</span>
        <span className="text-zinc-400 dark:text-zinc-500" aria-hidden>
          ▾
        </span>
        {ratesSource === "fallback" ? (
          <span className="sr-only">Using approximate exchange rates</span>
        ) : null}
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close currency menu"
            className="fixed inset-0 z-[100] cursor-default bg-black/25 dark:bg-black/50"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-[101] mt-2 min-w-[10.5rem] overflow-hidden rounded-2xl border border-black/10 bg-white py-1.5 text-sm shadow-xl ring-1 ring-black/5 dark:border-white/12 dark:bg-zinc-900 dark:ring-white/10"
          >
            {CURRENCY_ORDER.map((c) => (
              <li key={c} role="option" aria-selected={c === currency}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency(c);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left font-medium transition hover:bg-ss-bg-soft/80 dark:hover:bg-white/10",
                    c === currency && "bg-ss-bg-soft/90 dark:bg-white/10"
                  )}
                >
                  <span aria-hidden>{CURRENCY_FLAGS[c]}</span>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
