"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductLogoTile } from "@/components/ProductLogoTile";
import { Container } from "@/components/Container";
import { useMoney } from "@/components/providers/CurrencyProvider";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ReviewsGallery } from "@/components/ReviewsGallery";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { Product } from "@/data/services";
import type { ApiPlan } from "@/data/products";
import type { ReviewItem } from "@/data/reviews";
import { CURRENCY_FLAGS, type CurrencyCode } from "@/lib/currency";
import { SITE_URL, buildWhatsAppPrefillUrl } from "@/lib/site";

function calcDiscountPercent(originalPrice?: number, offerPrice?: number) {
  if (!originalPrice || !offerPrice) return undefined;
  if (originalPrice <= 0) return undefined;
  if (offerPrice >= originalPrice) return undefined;
  return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
}

function planKey(p: ApiPlan, idx: number) {
  return `${p.name}|${p.duration}|${idx}`;
}

/** Single-line label for duration pills (reference-style). */
function planPillLabel(p: ApiPlan) {
  const name = p.name?.trim() || "Plan";
  const dur = p.duration?.trim();
  if (dur && name) return `${dur} (${name})`;
  return name || dur || "Plan";
}

/** Stable pseudo “live checkout” count from slug (3–10). */
function liveCheckoutViewers(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h + slug.charCodeAt(i) * (i + 1)) % 997;
  }
  return 3 + (h % 8);
}

function breadcrumbTitle(title: string, max = 42) {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function WorksOnIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes("web"))
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <circle cx="12" cy="12" r="10" className="fill-none stroke-ss-primary" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4" ry="10" className="fill-none stroke-ss-primary/50" strokeWidth="1.25" />
        <path d="M2 12h20" className="stroke-ss-primary/40" strokeWidth="1.25" />
      </svg>
    );
  if (p.includes("windows"))
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path className="fill-ss-primary" d="M3 5.5l7-1v6.5H3V5.5zm0 7.5h7V20l-7-1.2V13zm8.5-8.3L21 3v7.5h-9.5V4.7zm0 8.8H21V21l-9.5-1.4V13.5z" />
      </svg>
    );
  if (p.includes("mac"))
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-ss-primary" aria-hidden>
        <path
          fill="currentColor"
          d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
        />
      </svg>
    );
  if (p.includes("android"))
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-ss-primary" aria-hidden>
        <path
          fill="currentColor"
          d="M17.6 9.48l1.84-1.29c.48-.34.57-.99.19-1.45-.37-.46-1.08-.51-1.52-.15l-1.74 1.23C14.84 6.95 13.5 6.5 12 6.5c-1.5 0-2.84.45-3.89 1.12L6.37 6.4c-.44-.36-1.15-.31-1.52.15-.38.46-.29 1.11.19 1.45L6.4 9.48C4.8 10.8 3.8 12.7 3.8 15H20.2c0-2.3-1-4.2-2.6-5.52zM7.5 12.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM7.5 16h9v3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V17h-2v2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V16z"
        />
      </svg>
    );
  if (p.includes("ios") || p.includes("iphone") || p.includes("ipad"))
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-ss-primary" aria-hidden>
        <path
          fill="currentColor"
          d="M16.5 3c.3 0 .6.1.8.3.5.4.8 1 .8 1.7 0 .6-.2 1.2-.6 1.6-.4.5-1 .8-1.6.8-.3 0-.6-.1-.9-.2-.4-.2-.7-.5-.9-.9-.2-.3-.3-.7-.3-1.1 0-.7.3-1.3.8-1.7.2-.2.6-.3 1-.3zm2.2 6.2c.9 1.1 1.4 2.5 1.4 4 0 2.8-1.5 5.3-3.8 6.6-.7.4-1.4.6-2.1.6-.5 0-1-.1-1.4-.4-.5-.3-1-.4-1.5-.4-.6 0-1.2.1-1.7.4-.4.2-.9.4-1.4.4-.8 0-1.5-.2-2.2-.7-2.4-1.4-3.8-3.8-3.8-6.5 0-2.6 1.3-4.8 3.3-5.8.6-.3 1.2-.5 1.9-.5.6 0 1.2.2 1.7.5.4.3.9.4 1.4.4.4 0 .8-.1 1.2-.3.6-.3 1.3-.5 2-.5.7 0 1.4.2 2 .6z"
        />
      </svg>
    );
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-ss-bg-soft text-xs font-bold text-ss-primary ring-1 ring-ss-primary/15">
      {platform.slice(0, 2).toUpperCase()}
    </span>
  );
}

/**
 * Native `<input type="radio">` + `<label>` with a full-bleed invisible input (not
 * `sr-only`): Chrome on Android (incl. Pixel) can mis-hit clipped/off-screen radios.
 */
function PlanDurationPill({
  plan,
  planKeyValue,
  active,
  onSelect,
  groupName,
}: {
  plan: ApiPlan;
  planKeyValue: string;
  active: boolean;
  onSelect: (key: string) => void;
  groupName: string;
}) {
  return (
    <label
      className={cn(
        "relative z-10 flex min-h-[52px] w-full cursor-pointer touch-manipulation select-none items-center justify-center rounded-full border px-4 py-3 text-center text-sm font-medium leading-snug transition-colors active:scale-[0.99] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-zinc-900/25 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ss-bg dark:has-[:focus-visible]:ring-offset-zinc-950",
        active
          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/80 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-white/25 dark:hover:bg-zinc-800/80"
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span className="pointer-events-none text-pretty">{planPillLabel(plan)}</span>
      {/*
        Avoid sr-only (clip/off-screen): Chrome on Android can mis-map taps to the
        hidden input. A full-bleed opacity-0 radio keeps the native hit target aligned
        with the visible pill.
      */}
      <input
        type="radio"
        name={groupName}
        value={planKeyValue}
        checked={active}
        onChange={() => onSelect(planKeyValue)}
        className="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none rounded-full opacity-0"
      />
    </label>
  );
}

function ProductCurrencySwitch({
  currency,
  onCycle,
  className,
}: {
  currency: CurrencyCode;
  onCycle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onCycle}
      className={cn(
        "inline-flex touch-manipulation items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-800 shadow-md backdrop-blur transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg dark:border-white/15 dark:bg-zinc-900/95 dark:text-zinc-100 dark:shadow-black/30 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950 sm:px-3 sm:py-2 sm:text-xs",
        className
      )}
      aria-label={`Display currency ${currency}. Tap to switch currency.`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {CURRENCY_FLAGS[currency]}
      </span>
      <span>{currency}</span>
      <span className="text-zinc-400 dark:text-zinc-500" aria-hidden="true">
        ↻
      </span>
    </button>
  );
}

export function ProductDetailClient({
  product,
  reviews = [],
}: {
  product: Product;
  reviews?: ReviewItem[];
}) {
  const { format, currency, cycleCurrency } = useMoney();
  const heroImage = product.images?.[0] ?? "";
  const [activeImg, setActiveImg] = useState(heroImage);

  const [selectedKey, setSelectedKey] = useState<string | null>(
    product.plans.length > 0 ? planKey(product.plans[0], 0) : null
  );
  const [qty, setQty] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">(
    "idle"
  );
  const [showStickyCta, setShowStickyCta] = useState(false);
  const mainCtaRef = useRef<HTMLAnchorElement>(null);

  const selectedPlan = useMemo<ApiPlan | null>(() => {
    if (!selectedKey) return null;
    const idx = product.plans.findIndex(
      (p, i) => planKey(p, i) === selectedKey
    );
    return idx === -1 ? null : product.plans[idx];
  }, [selectedKey, product.plans]);

  // Effective pricing: if a plan is selected, show its price; otherwise top-level.
  const displayOffer = selectedPlan
    ? Number(selectedPlan.offerPrice)
    : product.offerPrice;
  const displayOriginal = selectedPlan
    ? selectedPlan.originalPrice
    : product.originalPrice;
  const displaySuffix =
    (selectedPlan?.priceSuffix && selectedPlan.priceSuffix.trim()) ||
    product.priceSuffix ||
    "/month";

  const computedDiscount = calcDiscountPercent(displayOriginal, displayOffer);
  const discount = product.discountPercent ?? computedDiscount;
  const showSalePill =
    typeof discount === "number" && discount > 0 && typeof displayOriginal === "number";

  const liveViewers = useMemo(
    () => liveCheckoutViewers(product.slug),
    [product.slug]
  );

  const whatsappWithContext = useMemo(() => {
    const productUrl = `${SITE_URL}/product/${encodeURIComponent(product.slug)}`;
    const planBlock = selectedPlan
      ? [
          `Plan: ${planPillLabel(selectedPlan)}`,
          `Offer price: ${format(Number(selectedPlan.offerPrice) || 0)}${
            selectedPlan.priceSuffix?.trim() ? ` ${selectedPlan.priceSuffix.trim()}` : ""
          }`,
          typeof selectedPlan.originalPrice === "number"
            ? `Original: ${format(selectedPlan.originalPrice)}`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          `Offer (from listing): ${format(displayOffer)}${displaySuffix ? ` ${displaySuffix}` : ""}`,
        ].join("\n");

    const text = [
      `Hi! I'd like to order the following from Softsinc:`,
      ``,
      `Product: ${product.title}`,
      `Category: ${product.category}`,
      ``,
      planBlock,
      ``,
      `Quantity: ${qty}`,
      ``,
      `Product page: ${productUrl}`,
    ].join("\n");

    return buildWhatsAppPrefillUrl(text);
  }, [
    product.title,
    product.slug,
    product.category,
    selectedPlan,
    qty,
    format,
    displayOffer,
    displaySuffix,
  ]);

  const saveAmount =
    typeof displayOriginal === "number" &&
    Number.isFinite(displayOffer) &&
    displayOriginal > displayOffer
      ? displayOriginal - displayOffer
      : null;

  const planRadioGroupName = `softsinc-plan-${product.slug.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShowStickyCta(Boolean(e && !e.isIntersecting)),
      { root: null, rootMargin: "0px 0px -8px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const longDescription =
    (product.description?.length ?? 0) > 160 ||
    (product.description?.split("\n").length ?? 0) > 3;

  async function handleShareProduct() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text: product.title, url });
        setShareStatus("shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
      }
    } catch {
      setShareStatus("idle");
      return;
    }
    window.setTimeout(() => setShareStatus("idle"), 2200);
  }

  return (
    <div className="relative bg-zinc-50/40 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl dark:bg-ss-primary/15" />
      </div>

      <Container className="py-4 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/services" className="hover:text-zinc-800 dark:hover:text-zinc-200">
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span
              className="min-w-0 truncate font-medium text-zinc-700 dark:text-zinc-300"
              title={product.title}
            >
              {breadcrumbTitle(product.title)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void handleShareProduct()}
            className="touch-manipulation rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950"
          >
            {shareStatus === "copied"
              ? "Link copied"
              : shareStatus === "shared"
                ? "Shared"
                : "Share product"}
          </button>
        </div>

        {/* Plain div: Framer `motion` wrapper here was blocking taps on plan pills on some mobile browsers (same issue as PageLoad on /product/*). */}
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Gallery — store-style product image */}
          <div className="relative z-10 space-y-3">
            <ProductLogoTile variant="detail">
              {activeImg ? (
                <div className="relative h-full min-h-[200px] w-full sm:min-h-[240px]">
                  <Image
                    src={activeImg}
                    alt={`${product.title} preview`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="grid min-h-[200px] w-full place-items-center sm:min-h-[240px]">
                  <div className="grid h-28 w-28 place-items-center rounded-2xl bg-gradient-to-br from-ss-primary to-ss-accent text-2xl font-extrabold text-white shadow-lg">
                    {(product.iconLabel || product.title.slice(0, 2)).toUpperCase()}
                  </div>
                </div>
              )}
            </ProductLogoTile>
            {product.images.length > 1 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {product.images.map((src) => {
                  const act = src === activeImg;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImg(src)}
                      className={cn(
                        "relative z-10 touch-manipulation overflow-hidden rounded-xl border bg-ss-bg/90 transition-colors dark:bg-ss-bg-soft/40",
                        act
                          ? "border-ss-primary ring-2 ring-ss-primary/35 dark:border-ss-primary dark:ring-ss-primary/45"
                          : "border-black/10 hover:border-ss-primary/40 dark:border-white/12 dark:hover:border-ss-primary/45"
                      )}
                      aria-label="Change preview image"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 33vw, 200px"
                          className="object-contain p-2"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Buy column — z above fixed BackToTop (55) so controls stay tappable */}
          <div className="relative z-[60] min-w-0 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              {product.category}
            </p>
            <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {product.title}
            </h1>
            {product.description ? (
              <div>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-zinc-600 dark:text-zinc-300",
                    !descExpanded && longDescription && "line-clamp-3"
                  )}
                >
                  {product.description}
                </p>
                {longDescription ? (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    className="mt-1.5 text-xs font-semibold text-ss-primary hover:text-ss-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2"
                  >
                    {descExpanded ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-baseline gap-2.5">
              {typeof displayOriginal === "number" ? (
                <span className="text-sm font-medium text-zinc-400 line-through dark:text-zinc-500">
                  {format(displayOriginal)}
                </span>
              ) : null}
              <span className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {format(displayOffer)}
                <span className="ml-1 text-base font-semibold text-zinc-500 dark:text-zinc-400">
                  {displaySuffix}
                </span>
              </span>
              {showSalePill ? (
                <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white dark:bg-zinc-100 dark:text-zinc-900">
                  Sale
                </span>
              ) : null}
              {typeof discount === "number" && discount > 0 ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-700/40">
                  Save {discount}%
                </span>
              ) : null}
            </div>
            {saveAmount != null && saveAmount > 0 ? (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                You save {format(saveAmount)} on this selection
              </p>
            ) : null}
            <p
              aria-live="polite"
              className="text-xs text-zinc-500 transition-opacity duration-200 dark:text-zinc-400"
            >
              Final price depends on plan, duration, and availability.
              {selectedPlan ? (
                <>
                  {" "}
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">
                    Showing: {planPillLabel(selectedPlan)}.
                  </span>
                </>
              ) : null}
            </p>

            {product.plans.length > 0 ? (
              <fieldset className="relative isolate z-[1] min-w-0 space-y-2 border-0 p-0">
                <legend className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Duration
                  {product.plans.length > 1 ? (
                    <span className="font-normal text-zinc-400 dark:text-zinc-500">
                      {" "}
                      · {product.plans.length} options
                    </span>
                  ) : null}
                </legend>
                <div className="flex flex-col gap-2">
                  {product.plans.map((p, idx) => {
                    const k = planKey(p, idx);
                    const active = k === selectedKey;
                    return (
                      <PlanDurationPill
                        key={k}
                        plan={p}
                        planKeyValue={k}
                        active={active}
                        groupName={planRadioGroupName}
                        onSelect={setSelectedKey}
                      />
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {product.plans.length > 0 ? (
              <a
                href="#plan-breakdown"
                className="inline-flex text-xs font-semibold text-ss-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2"
              >
                Jump to full plan details ↓
              </a>
            ) : null}

            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Quantity
              </div>
              <div className="mt-2 inline-flex max-w-full items-stretch overflow-hidden rounded-full border border-zinc-200 bg-white dark:border-white/15 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="min-h-[48px] min-w-[48px] touch-manipulation text-lg font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="flex min-w-[3rem] items-center justify-center text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {qty}
                </div>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="min-h-[48px] min-w-[48px] touch-manipulation text-lg font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <p className="rounded-2xl bg-teal-50 px-4 py-3 text-center text-sm text-teal-900 ring-1 ring-teal-100 dark:bg-teal-950/40 dark:text-teal-100 dark:ring-teal-800/50">
              <span className="font-bold">{liveViewers}</span> people are checking
              out right now
            </p>

            <Link
              ref={mainCtaRef}
              href={whatsappWithContext}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full bg-[#4ade80] px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-[#3fc871] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2"
            >
              Check Availability on WhatsApp
            </Link>
            <div className="relative min-h-[2.75rem]">
              <p className="flex flex-wrap items-center justify-center gap-1.5 px-12 text-center text-[11px] leading-snug text-zinc-500 dark:text-zinc-400 sm:px-16">
                <span aria-hidden="true">🔒</span>
                <span>Digital delivery · guided on WhatsApp after you order</span>
              </p>
              <div className="pointer-events-auto absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-4">
                <ProductCurrencySwitch
                  currency={currency}
                  onCycle={cycleCurrency}
                />
              </div>
            </div>

            <div className="pt-2 text-center">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Shop with confidence
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { t: "100% satisfaction", s: "Guarantee", icon: "✓" },
                  { t: "Invoice", s: "Official receipt", icon: "📄" },
                  { t: "Expert advice", s: "WhatsApp support", icon: "💬" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-100 bg-white p-2.5 dark:border-white/10 dark:bg-zinc-900/60"
                  >
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-sm dark:bg-zinc-800"
                      aria-hidden
                    >
                      {x.icon}
                    </span>
                    <span className="text-[10px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-xs">
                      {x.t}
                    </span>
                    <span className="text-[9px] leading-tight text-zinc-500 dark:text-zinc-400 sm:text-[10px]">
                      {x.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.section
          id="plan-breakdown"
          className="scroll-mt-28"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          <PlanDetailsPanel plan={selectedPlan} productTitle={product.title} />
        </motion.section>

        {/* Below section */}
        <motion.div
          className="mt-14 grid gap-8 lg:grid-cols-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          <Card className="p-8">
            <div className="text-lg font-semibold tracking-tight">
              Product description
            </div>
            <p className="mt-3 text-sm leading-7 text-ss-text/70">
              {product.description} Choose the plan that fits your needs, then
              message us on WhatsApp to confirm availability and next steps.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ss-text/80">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-ss-bg-soft text-[10px] font-black text-ss-primary ring-1 ring-ss-primary/10">
                    ✓
                  </span>
                  <span className="leading-6">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl bg-ss-bg-soft/70 p-4 text-sm text-ss-text/70 ring-1 ring-ss-primary/10">
              Note: Final price depends on plan, duration, and availability.
            </div>
          </Card>

          <Card className="p-8">
            <div className="text-lg font-semibold tracking-tight">What you’ll get</div>
            <ul className="mt-4 space-y-3 text-sm text-ss-text/80">
              {product.whatYouGet.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-ss-bg-soft text-xs font-extrabold text-ss-primary ring-1 ring-ss-primary/10">
                    ✓
                  </span>
                  <span className="leading-6">{x}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div
          className="mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          <SectionHeading
            eyebrow="Compatibility"
            title="Works on"
            subtitle="Platforms vary by product. Ask us if you need help choosing."
          />
          <motion.div
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px 100px 0px" }}
          >
            {product.worksOn.map((p) => (
              <motion.div key={p} variants={fadeUp}>
                <Card className="group flex flex-col items-center gap-3 p-5 text-center transition-colors hover:ring-ss-primary/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ss-bg-soft to-white shadow-sm ring-1 ring-ss-primary/15 transition-transform group-hover:scale-[1.03] dark:from-zinc-900 dark:to-zinc-950 dark:ring-ss-primary/25">
                    <WorksOnIcon platform={p} />
                  </span>
                  <div className="text-sm font-semibold tracking-tight text-ss-text">
                    {p}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          <SectionHeading
            eyebrow="How it works"
            title="A simple flow from order to activation"
            subtitle="Designed for clarity and a smooth experience."
          />
          <motion.div
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px 100px 0px" }}
          >
            {[
              { step: "01", title: "Contact on WhatsApp", desc: "Share product, plan, and duration." },
              { step: "02", title: "Confirm & pay", desc: "We confirm availability and pricing." },
              { step: "03", title: "Activation", desc: "We guide you through setup steps." },
              { step: "04", title: "Enjoy", desc: "Use your tool with support as needed." },
            ].map((i) => (
              <motion.div key={i.step} variants={fadeUp}>
                <Card className="relative h-full overflow-hidden p-6 pt-7 ring-ss-primary/10 transition-shadow hover:shadow-md hover:ring-ss-primary/20">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-ss-primary/15 to-ss-accent/10 blur-2xl"
                  />
                  <div className="relative">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ss-primary to-ss-accent text-sm font-black tabular-nums text-white shadow-md ring-1 ring-white/25">
                      {i.step}
                    </span>
                    <div className="mt-4 text-base font-semibold tracking-tight text-ss-text">
                      {i.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ss-text/70">{i.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions"
            subtitle="If anything is unclear, message us on WhatsApp."
          />
          <div className="mt-10">
            <FaqAccordion items={product.faqs} />
          </div>
        </motion.div>

        {reviews.length > 0 ? (
          <motion.div
            className="mt-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px 100px 0px" }}
          >
            <SectionHeading
              eyebrow="Loved by customers"
              title="What clients say about Softsinc"
              subtitle="Real screenshots from real Softsinc customers — tap any card to see the full review."
            />
            <div className="mt-10">
              <ReviewsGallery reviews={reviews} limit={6} />
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-6 py-3 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
              >
                View all reviews
              </Link>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          className="mt-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 100px 0px" }}
        >
          <div className="rounded-3xl bg-gradient-to-br from-ss-primary/25 via-white/95 to-ss-accent/20 p-[1px] shadow-[0_24px_80px_-48px_rgba(124,58,237,0.45)] dark:from-ss-primary/35 dark:via-zinc-950/95 dark:to-ss-accent/25 dark:shadow-[0_24px_80px_-48px_rgba(124,58,237,0.35)]">
            <Card className="relative overflow-hidden border-0 bg-white/90 p-0 shadow-xl ring-1 ring-ss-primary/10 dark:bg-zinc-950/90 dark:ring-ss-primary/20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(124,58,237,0.12),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_0%_0%,rgba(167,139,250,0.12),transparent_55%)]"
              />
              <div className="relative grid gap-8 p-8 sm:p-10 md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-10">
                <div>
                  <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                    Still deciding?
                  </div>
                  <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-ss-text sm:text-3xl">
                    Message us about{" "}
                    <span className="text-ss-primary">{product.title}</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-ss-text/70 sm:text-base">
                    Share your plan choice from above—we reply with availability,
                    timing, and payment steps. No spam; just clear answers on
                    WhatsApp.
                  </p>
                  <ul className="mt-6 grid gap-2.5 text-sm text-ss-text/75">
                    <li className="flex gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary"
                        aria-hidden
                      />
                      Same-day replies during active hours
                    </li>
                    <li className="flex gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary"
                        aria-hidden
                      />
                      Guided activation after you confirm
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-ss-bg-soft/80 px-3 py-1 text-[11px] font-semibold text-ss-text/70 ring-1 ring-ss-primary/10 dark:bg-white/5 dark:text-ss-text/80">
                      Trusted checkout
                    </span>
                    <span className="rounded-full bg-ss-bg-soft/80 px-3 py-1 text-[11px] font-semibold text-ss-text/70 ring-1 ring-ss-primary/10 dark:bg-white/5 dark:text-ss-text/80">
                      Plan-aware quotes
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <WhatsAppButton
                    href={whatsappWithContext}
                    className="w-full justify-center py-3.5 text-base shadow-md"
                    label="Chat on WhatsApp"
                  />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Link
                      href="/services"
                      className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-4 py-2.5 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/15 transition hover:bg-ss-bg-soft/70"
                    >
                      More tools
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ss-text ring-1 ring-black/10 transition hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-white/15 dark:hover:bg-zinc-800"
                    >
                      About Softsinc
                    </Link>
                  </div>
                  <Link
                    href="/reviews"
                    className="text-center text-xs font-semibold text-ss-primary/90 underline-offset-4 hover:text-ss-primary hover:underline"
                  >
                    Read customer reviews →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </Container>

      {/* Mobile: WhatsApp + currency (right, inset from screen edge) */}
      {showStickyCta ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] pb-[max(0.65rem,env(safe-area-inset-bottom))] pl-3 pr-4 pt-2 sm:pr-5 md:hidden">
          <div className="mx-auto flex w-full max-w-lg items-stretch gap-2">
            <Link
              href={whatsappWithContext}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-600/25 bg-[#4ade80] px-3 py-2.5 text-center text-sm font-bold leading-snug text-zinc-950 shadow-lg backdrop-blur-sm transition hover:bg-[#3fc871] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/35 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg dark:border-emerald-500/35 dark:shadow-emerald-950/50 dark:focus-visible:ring-offset-zinc-950"
            >
              <span aria-hidden="true">💬</span>
              <span className="min-w-0 truncate">
                WhatsApp — {format(displayOffer)}
              </span>
            </Link>
            <ProductCurrencySwitch
              currency={currency}
              onCycle={cycleCurrency}
              className="pointer-events-auto shrink-0 self-center shadow-lg"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PlanDetailsPanel({
  plan,
  productTitle,
}: {
  plan: ApiPlan | null;
  productTitle: string;
}) {
  const { format } = useMoney();
  if (!plan) return null;

  const headline = plan.headline?.trim() || "";
  const note = plan.originalPriceNote?.trim() || "";
  const highlights = plan.keyHighlights ?? [];
  const benefits = plan.benefits ?? [];
  const requirements = plan.requirements ?? [];
  const activation = plan.activationSteps ?? [];
  const customHtml = plan.customContent?.trim() || "";
  const hasCustomHtml =
    customHtml.length > 0 &&
    customHtml.replace(/<[^>]*>/g, "").trim().length > 0;

  const hasContent =
    headline ||
    note ||
    highlights.length ||
    benefits.length ||
    requirements.length ||
    activation.length ||
    hasCustomHtml;

  if (!hasContent) return null;

  const offerLine = `${format(Number(plan.offerPrice) || 0)}${
    plan.priceSuffix || "/month"
  }`;

  return (
    <motion.div
      key={`${plan.name}-${plan.duration}`}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mt-10"
    >
      <CustomHeadingBanner heading={plan.customHeading} />

      <SectionHeading
        eyebrow="Selected plan"
        title={headline || `${productTitle} — ${plan.name}`}
        subtitle={
          plan.duration
            ? `Detailed breakdown for the ${plan.duration} ${plan.name} plan.`
            : `Detailed breakdown for the ${plan.name} plan.`
        }
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {highlights.length > 0 ? (
          <DetailCard
            icon="✦"
            title="Key highlights"
            items={highlights}
            tone="primary"
          />
        ) : null}

        {benefits.length > 0 ? (
          <DetailCard icon="✓" title="Benefits" items={benefits} tone="accent" />
        ) : null}

        {(note || typeof plan.originalPrice === "number") && (
          <Card className="p-6 lg:col-span-2">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ss-text/55">
                  Original price
                </div>
                {note ? (
                  <div className="mt-1 text-sm font-semibold text-ss-text/75">
                    {note}
                  </div>
                ) : typeof plan.originalPrice === "number" ? (
                  <div className="mt-1 text-sm font-semibold text-ss-text/55 line-through decoration-ss-primary/40">
                    {format(plan.originalPrice)}
                    <span className="font-medium">
                      {plan.priceSuffix || "/month"}
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-ss-text/45">—</div>
                )}
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-ss-text/55">
                  Offer price
                </div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight text-ss-primary">
                  {offerLine}
                </div>
              </div>
            </div>
          </Card>
        )}

        {requirements.length > 0 ? (
          <DetailCard
            icon="!"
            title="Requirements"
            items={requirements}
            tone="muted"
          />
        ) : null}

        {activation.length > 0 ? (
          <DetailCard
            icon="→"
            title="Activation process"
            items={activation}
            tone="accent"
            ordered
          />
        ) : null}
      </div>

      {hasCustomHtml ? (
        <Card className="mt-5 p-6 sm:p-8">
          <div
            className="prose-rich"
            dangerouslySetInnerHTML={{ __html: customHtml }}
          />
        </Card>
      ) : null}
    </motion.div>
  );
}

function CustomHeadingBanner({
  heading,
}: {
  heading?: ApiPlan["customHeading"];
}) {
  if (!heading) return null;
  const eyebrow = heading.eyebrow?.trim();
  const title = heading.title?.trim();
  const subtitle = heading.subtitle?.trim();
  if (!eyebrow && !title && !subtitle) return null;

  const tone = heading.tone ?? "primary";
  const bg =
    tone === "amber"
      ? "from-amber-500 via-orange-500 to-rose-500"
      : tone === "emerald"
        ? "from-emerald-500 via-teal-500 to-cyan-500"
        : tone === "accent"
          ? "from-ss-accent via-fuchsia-500 to-ss-primary"
          : "from-ss-primary via-violet-500 to-ss-accent";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br p-[1px] shadow-[0_18px_55px_-30px_rgba(124,58,237,0.55)]",
          bg
        )}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/95 p-5 sm:p-7 dark:bg-zinc-950/95">
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br opacity-25 blur-3xl",
              bg
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
              bg
            )}
          />

          <div className="relative">
            {eyebrow ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm ring-1 ring-white/20",
                  bg
                )}
              >
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-ss-text sm:text-3xl">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-6 text-ss-text/70 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailCard({
  icon,
  title,
  items,
  tone,
  ordered,
}: {
  icon: string;
  title: string;
  items: string[];
  tone: "primary" | "accent" | "muted";
  ordered?: boolean;
}) {
  const badgeStyles =
    tone === "primary"
      ? "bg-ss-primary/10 text-ss-primary ring-ss-primary/15"
      : tone === "accent"
        ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/25"
        : "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300 dark:ring-amber-400/25";

  const Tag = ordered ? "ol" : "ul";

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-2xl text-sm font-extrabold ring-1",
            badgeStyles
          )}
        >
          {icon}
        </span>
        <div className="text-base font-semibold tracking-tight">{title}</div>
      </div>
      <Tag
        className={cn(
          "mt-4 space-y-2.5 text-sm leading-6 text-ss-text/80",
          ordered ? "list-decimal pl-5 marker:text-ss-primary/70" : ""
        )}
      >
        {items.map((it, i) => (
          <li
            key={`${i}-${it.slice(0, 24)}`}
            className={cn(ordered ? "" : "flex gap-2")}
          >
            {!ordered ? (
              <span
                aria-hidden="true"
                className="mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-ss-bg-soft text-[10px] font-black text-ss-primary ring-1 ring-ss-primary/10"
              >
                {tone === "muted" ? "!" : "✓"}
              </span>
            ) : null}
            <span className="leading-6">{it}</span>
          </li>
        ))}
      </Tag>
    </Card>
  );
}
