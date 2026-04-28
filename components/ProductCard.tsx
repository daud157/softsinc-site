"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useMoney } from "@/components/providers/CurrencyProvider";
import { cn } from "@/lib/cn";
import type { Service } from "@/lib/services";

const BRAND = "SOFTSINC";

function calcDiscountPercent(originalPrice?: number, offerPrice?: number) {
  if (!originalPrice || !offerPrice) return undefined;
  if (originalPrice <= 0) return undefined;
  if (offerPrice >= originalPrice) return undefined;
  return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
}

export function ProductCard({
  product,
  className,
}: {
  product: Service;
  className?: string;
}) {
  const { format } = useMoney();
  const suffix = product.priceSuffix ?? "/month";
  const computedDiscount = calcDiscountPercent(
    product.originalPrice,
    product.offerPrice
  );
  const discount = product.discountPercent ?? computedDiscount;
  const isOnSale = typeof discount === "number";
  const detailsHref = `/product/${encodeURIComponent(product.slug)}`;
  const initials = (product.iconLabel || product.title.slice(0, 2)).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 1, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 80px 0px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn("group h-full", className)}
    >
      <Link
        href={detailsHref}
        aria-label={`View details for ${product.title}`}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg dark:focus-visible:ring-offset-zinc-950"
      >
        <div className="flex h-full flex-col">
          {/* Image tile */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 transition-shadow group-hover:shadow-[0_18px_55px_-30px_rgba(124,58,237,0.45)] dark:bg-zinc-900/80 dark:ring-white/10 dark:group-hover:shadow-[0_18px_55px_-28px_rgba(124,58,237,0.35)]">
            {/* Soft gradient + decorative blobs */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-ss-bg-soft/40 to-white dark:from-zinc-900 dark:via-ss-primary/10 dark:to-zinc-900"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ss-primary/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -left-12 h-44 w-44 rounded-full bg-ss-accent/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 75% 25%, rgba(124,58,237,0.12), transparent 55%), radial-gradient(circle at 20% 85%, rgba(168,85,247,0.10), transparent 55%)",
              }}
            />

            {/* Sale badge */}
            {isOnSale ? (
              <span className="absolute right-3 top-3 z-10 inline-flex items-center rounded-md bg-ss-text px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
                Sale
              </span>
            ) : null}

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 grid place-items-center p-6 sm:p-8"
            >
              {product.logoUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={product.logoUrl}
                    alt={`${product.title} logo`}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 50vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-ss-primary to-ss-accent text-2xl font-extrabold text-white shadow-lg">
                  {initials}
                </div>
              )}
            </motion.div>
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-1 flex-col gap-1.5">
            <h3
              className="text-[15px] font-semibold leading-snug tracking-tight text-ss-text underline-offset-4 group-hover:underline sm:text-base"
              title={product.title}
            >
              {product.title}
            </h3>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ss-text/55">
              {BRAND}
            </div>

            {/* Price row */}
            <div
              className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1"
              suppressHydrationWarning
            >
              {typeof product.originalPrice === "number" &&
              product.originalPrice > product.offerPrice ? (
                <span className="text-[13px] font-medium text-ss-text/45 line-through decoration-ss-text/30">
                  {format(product.originalPrice)}
                </span>
              ) : null}
              <span className="text-[15px] font-semibold tracking-tight text-ss-text">
                <span className="font-medium text-ss-text/65">From </span>
                {format(product.offerPrice)}
              </span>
              {suffix && suffix !== "/month" ? (
                <span className="text-xs font-medium text-ss-text/55">
                  {suffix}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
