"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { WHATSAPP_LINK } from "@/lib/site";

/** WhatsApp chat-bubble mark (official-style glyph), inherits `currentColor` */
export function WhatsAppLogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.03-1.38l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

export function WhatsAppButton({
  href = WHATSAPP_LINK,
  label = "Order on WhatsApp",
  className,
  variant = "primary",
  iconOnly = false,
  "aria-label": ariaLabel,
}: {
  href?: string;
  label?: string;
  className?: string;
  variant?: "primary" | "ghost" | "white" | "brand";
  /** Brand variant only: circular WhatsApp-green control with logo only (no visible text). */
  iconOnly?: boolean;
  "aria-label"?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg";

  const variants: Record<NonNullable<typeof variant>, string> = {
    primary:
      "gap-2 bg-[#25D366] text-white shadow-[0_2px_10px_rgba(37,211,102,0.38)] ring-1 ring-white/25 hover:bg-[#20bd5a] hover:shadow-[0_4px_16px_rgba(37,211,102,0.45)] active:bg-[#1da851] focus-visible:ring-white/50 dark:focus-visible:ring-offset-zinc-950",
    ghost:
      "bg-transparent text-ss-text ring-1 ring-black/10 hover:bg-black/5 active:bg-black/10 dark:ring-white/15 dark:hover:bg-white/8 focus-visible:ring-ss-primary/35",
    white:
      "bg-white text-zinc-900 shadow-sm ring-1 ring-black/10 hover:bg-zinc-50 active:bg-zinc-100 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:ring-black/15 focus-visible:ring-zinc-400/40",
    brand:
      "gap-2 bg-[#25D366] px-4 py-2.5 text-white shadow-[0_2px_12px_rgba(37,211,102,0.35)] ring-1 ring-white/25 hover:bg-[#20bd5a] hover:shadow-[0_4px_16px_rgba(37,211,102,0.45)] active:bg-[#1da851] focus-visible:ring-white/50 dark:focus-visible:ring-offset-zinc-950",
  };

  const brandIconOnlyLayout =
    variant === "brand" && iconOnly
      ? "aspect-square !gap-0 !px-0 !py-0 h-11 w-11 shrink-0 sm:h-11 sm:w-11"
      : "";

  const iconAria =
    variant === "brand" && iconOnly
      ? { "aria-label": ariaLabel ?? label ?? "Chat on WhatsApp" }
      : {};

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], brandIconOnlyLayout, className)}
        {...iconAria}
      >
        {variant === "brand" ? (
          iconOnly ? (
            <WhatsAppLogoGlyph className="h-7 w-7 shrink-0 text-white" />
          ) : (
            <>
              <WhatsAppLogoGlyph className="h-[1.35rem] w-[1.35rem] shrink-0 text-white sm:h-5 sm:w-5" />
              <span>{label}</span>
            </>
          )
        ) : variant === "primary" ? (
          <>
            <WhatsAppLogoGlyph className="h-5 w-5 shrink-0 text-white" />
            <span>{label}</span>
          </>
        ) : (
          label
        )}
      </Link>
    </motion.div>
  );
}
