"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useMoney } from "@/components/providers/CurrencyProvider";
import { ProductLogoTile } from "@/components/ProductLogoTile";
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
          {/* Image tile — shared template for transparent PNG logos */}
          <ProductLogoTile
            variant="card"
            hoverGlow
            overlay={
              isOnSale ? (
                <span className="absolute right-3 top-3 z-10 inline-flex items-center rounded-md bg-ss-text px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
                  Sale
                </span>
              ) : null
            }
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
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
          </ProductLogoTile>

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
