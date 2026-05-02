import type { ReactNode } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Visual frame for product logos — tuned for transparent PNGs on the storefront.
 * Drop any logo URL into {@link ProductLogoImage} or wrap custom content in {@link ProductLogoTile}.
 */
export type ProductLogoTileVariant = "card" | "compact" | "featured" | "detail";

const variantLayout: Record<
  ProductLogoTileVariant,
  { aspect: string; rounded: string; innerPad: string }
> = {
  card: {
    aspect: "aspect-square",
    rounded: "rounded-2xl",
    innerPad: "p-6 sm:p-8",
  },
  compact: {
    aspect: "aspect-square",
    rounded: "rounded-2xl",
    innerPad: "p-3 sm:p-4",
  },
  featured: {
    aspect: "aspect-[4/3] sm:aspect-square",
    rounded: "rounded-3xl",
    innerPad: "p-8 sm:p-10",
  },
  /** Product detail hero — fixed 4:3 to match gallery layout */
  detail: {
    aspect: "aspect-[4/3]",
    rounded: "rounded-2xl",
    innerPad: "p-4 sm:p-6",
  },
};

function LogoBackdrop() {
  return (
    <>
      {/* Base wash — matches page bg + soft violet lift */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ss-bg via-ss-bg-soft/55 to-ss-bg dark:from-ss-bg dark:via-[color-mix(in_srgb,var(--ss-primary)_12%,transparent)] dark:to-ss-bg-soft/35"
      />
      {/* Brand orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-ss-primary/22 blur-3xl dark:bg-ss-primary/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-ss-accent/18 blur-3xl dark:bg-ss-accent/20"
      />
      {/* Fine radial accents — uses theme vars so dark/light track globals.css */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.72] dark:opacity-80"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 76% 24%, color-mix(in srgb, var(--ss-primary) 26%, transparent), transparent 58%)",
            "radial-gradient(circle at 22% 78%, color-mix(in srgb, var(--ss-accent) 22%, transparent), transparent 56%)",
          ].join(","),
        }}
      />
      {/* Subtle corner highlight — lavender paper feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-ss-bg-soft/25 dark:to-[color-mix(in_srgb,var(--ss-primary)_8%,transparent)]"
      />
    </>
  );
}

export function ProductLogoTile({
  variant = "card",
  className,
  children,
  hoverGlow = false,
  overlay,
}: {
  variant?: ProductLogoTileVariant;
  className?: string;
  children: ReactNode;
  /** When true, pairs with a parent `group` link/card for hover elevation + violet glow */
  hoverGlow?: boolean;
  /** Rendered above the logo area (e.g. sale badge), absolutely positioned on the tile */
  overlay?: ReactNode;
}) {
  const v = variantLayout[variant];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-ss-bg/95 shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--ss-primary)_12%,transparent)] ring-1 ring-ss-primary/12 dark:bg-ss-bg-soft/40 dark:shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--ss-primary)_18%,transparent)] dark:ring-ss-primary/25",
        v.aspect,
        v.rounded,
        hoverGlow &&
          "transition-shadow duration-300 group-hover:shadow-[0_18px_55px_-28px_color-mix(in_srgb,var(--ss-primary)_42%,transparent)] dark:group-hover:shadow-[0_18px_52px_-26px_color-mix(in_srgb,var(--ss-primary)_38%,transparent)]",
        className
      )}
    >
      <LogoBackdrop />
      {overlay}
      <div
        className={cn(
          "absolute inset-0 grid place-items-center",
          v.innerPad
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ProductLogoImage({
  src,
  alt,
  variant = "card",
  sizes,
  className,
  tileClassName,
  hoverGlow,
  overlay,
}: {
  src: string;
  alt: string;
  variant?: ProductLogoTileVariant;
  sizes?: string;
  /** Passed to the inner `Image` */
  className?: string;
  /** Passed to {@link ProductLogoTile} wrapper */
  tileClassName?: string;
  hoverGlow?: boolean;
  overlay?: ReactNode;
}) {
  const defaultSizes =
    variant === "compact"
      ? "160px"
      : variant === "detail"
        ? "(max-width: 1024px) 100vw, 600px"
        : "(min-width: 1024px) 220px, (min-width: 640px) 30vw, 50vw";

  return (
    <ProductLogoTile
      variant={variant}
      className={tileClassName}
      hoverGlow={hoverGlow}
      overlay={overlay}
    >
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? defaultSizes}
          className={cn("object-contain", className)}
        />
      </div>
    </ProductLogoTile>
  );
}
