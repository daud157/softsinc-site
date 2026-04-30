"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cloudinaryBrandingLogoDeliveryUrl } from "@/lib/cloudinaryBrandingUrl";
import { cn } from "@/lib/cn";
import { NAV_LINKS, WHATSAPP_LINK } from "@/lib/site";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM20 20l-4.2-4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 8V6a4 4 0 118 0v2M5 9h14l-1 11H6L5 9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.03-1.38l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

function NavbarBrandMark({
  siteLogoUrl,
  variant,
}: {
  siteLogoUrl?: string | null;
  variant: "default" | "product";
}) {
  if (siteLogoUrl) {
    return (
      <span
        className={cn(
          // Fixed slot keeps layout stable; scale() draws larger. Translate nudges paint only (no reflow).
          "relative isolate z-[1] h-10 w-[min(7.5rem,36vw)] shrink-0 overflow-visible bg-transparent",
          variant === "product"
            ? "-translate-x-7 rounded-full md:-translate-x-5 lg:-translate-x-6"
            : "-translate-x-7 rounded-xl md:-translate-x-11 lg:-translate-x-14 xl:-translate-x-[4rem]",
        )}
      >
        <Image
          src={cloudinaryBrandingLogoDeliveryUrl(siteLogoUrl)}
          alt="Softsinc"
          fill
          sizes="(max-width: 767px) 220px, 360px"
          className={cn(
            "object-contain object-center p-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]",
            variant === "product"
              ? "origin-center scale-[1.58] md:origin-left md:scale-[2.08] lg:scale-[2.22] xl:scale-[2.35]"
              : "origin-left scale-[1.58] md:scale-[2.08] lg:scale-[2.22] xl:scale-[2.35]"
          )}
        />
      </span>
    );
  }
  if (variant === "product") {
    return (
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ss-primary to-ss-accent text-[10px] font-bold text-white shadow-sm">
        si
      </span>
    );
  }
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-[10px] font-bold text-white shadow-sm ring-1 ring-[#7C3AED]/20">
      S
    </span>
  );
}

/** Site wordmark next to the logo — gradient + weight aligned with hero branding */
function NavbarWordmark({ compact }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "truncate bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] bg-clip-text font-extrabold tracking-tight text-transparent",
        "dark:from-ss-primary dark:via-purple-400 dark:to-ss-accent",
        compact ? "text-sm sm:text-base md:text-lg" : "text-[17px] leading-none sm:text-lg md:text-xl lg:text-2xl"
      )}
    >
      Softsinc
    </span>
  );
}

export function Navbar({ siteLogoUrl }: { siteLogoUrl?: string | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);
  const isProductStore = pathname?.startsWith("/product/") ?? false;

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      document.body.style.overflow = mq.matches ? "hidden" : "";
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.button
            key="nav-scrim"
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-50 max-md:pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-0 md:border-b md:border-black/[0.06] bg-ss-bg/85 text-ss-text backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-ss-bg/70 dark:md:border-white/[0.08] dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/75 dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
      <Container
        className={cn(
          "flex min-h-16 items-center md:min-h-[4.25rem]",
          isProductStore
            ? "w-full justify-between gap-2 sm:gap-3 md:gap-5 lg:gap-6"
            : "justify-between gap-4 md:gap-6 lg:gap-8"
        )}
      >
        {isProductStore ? (
          <>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ss-text ring-1 ring-black/8 hover:bg-ss-bg-soft/80 active:scale-95 md:hidden dark:bg-zinc-900/95 dark:text-zinc-100 dark:ring-white/12 dark:hover:bg-zinc-800"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {mobileOpen ? "✕" : "☰"}
              </span>
            </button>
            <Link
              href="/"
              className="group flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3 md:flex-none md:justify-start md:gap-5 lg:gap-6"
              onClick={closeMenu}
            >
              <NavbarBrandMark siteLogoUrl={siteLogoUrl} variant="product" />
              <NavbarWordmark compact />
            </Link>
            <div className="flex min-w-0 shrink-0 items-center justify-end gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2">
              <ThemeToggle />
              <Link
                href="/services"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ss-text/80 hover:bg-black/[0.06] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                aria-label="Search services"
              >
                <SearchIcon className="h-5 w-5" />
              </Link>
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ss-text/80 hover:bg-black/[0.06] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                aria-label="Order on WhatsApp"
              >
                <BagIcon className="h-5 w-5" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="group inline-flex min-w-0 items-center gap-3 md:gap-5 lg:gap-6 md:shrink-0"
              onClick={closeMenu}
            >
              <NavbarBrandMark siteLogoUrl={siteLogoUrl} variant="default" />
              <NavbarWordmark />
            </Link>

            <nav
              className="hidden min-h-0 min-w-0 flex-1 items-center justify-center gap-0.5 px-2 md:flex md:px-4 lg:gap-1 lg:px-6"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-sm font-semibold text-ss-text/80 transition-colors hover:text-ss-text md:px-4 md:py-2.5 lg:px-5",
                      active && "text-ss-text"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-ss-bg-soft ring-1 ring-ss-primary/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5">
              <ThemeToggle className="hidden md:inline-flex" />
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/12 text-[#25D366] ring-1 ring-[#25D366]/20 transition hover:bg-[#25D366]/16 md:hidden"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppGlyph className="h-6 w-6" />
              </Link>
              <div className="hidden md:block">
                <WhatsAppButton />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ss-text shadow-md shadow-black/[0.06] ring-1 ring-black/[0.07] transition hover:bg-ss-bg-soft/90 active:scale-[0.98] dark:bg-zinc-900/95 dark:text-zinc-100 dark:shadow-black/30 dark:ring-white/10 dark:hover:bg-zinc-800 md:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  {mobileOpen ? "✕" : "☰"}
                </span>
              </button>
            </div>
          </>
        )}

      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "relative grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "bg-ss-bg/98 text-ss-text dark:bg-ss-bg",
          "max-md:rounded-b-2xl",
          "max-md:shadow-[0_20px_50px_-20px_rgba(17,24,39,0.18),0_0_0_1px_rgba(124,58,237,0.1)]",
          "dark:max-md:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.5),0_0_0_1px_rgba(167,139,250,0.12)]",
          !isProductStore && "md:hidden",
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ss-primary/30 to-transparent dark:via-ss-primary/35" />
        <div className="min-h-0 max-h-[min(75vh,520px)] overflow-y-auto overflow-x-hidden overscroll-contain">
          <Container className="relative px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-4">
            <nav className="space-y-0.5" aria-label="Mobile navigation">
              {NAV_LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeMenu}
                    className={cn(
                      "-mx-1 flex items-center rounded-xl px-3 py-3.5 text-lg font-semibold tracking-tight transition-colors sm:text-xl",
                      "active:bg-black/[0.05] dark:active:bg-white/[0.07]",
                      active
                        ? "bg-ss-primary/10 text-ss-primary dark:bg-ss-primary/20 dark:text-zinc-50"
                        : "text-ss-text/90 hover:bg-black/[0.04] dark:text-ss-text/90 dark:hover:bg-white/[0.07] dark:hover:text-ss-text"
                    )}
                  >
                    <span
                      className={cn(
                        "mr-3 h-7 w-1 shrink-0 rounded-full bg-transparent transition-colors",
                        active && "bg-gradient-to-b from-[#7C3AED] to-[#A855F7] dark:from-ss-primary dark:to-ss-accent"
                      )}
                      aria-hidden
                    />
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 space-y-3 border-t border-black/[0.08] pt-5 dark:border-white/10">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/[0.04] px-4 py-3 dark:bg-white/[0.06]">
                <span className="text-sm font-medium text-ss-text/75 dark:text-ss-text/80">Theme</span>
                <ThemeToggle />
              </div>
              <WhatsAppButton className="w-full !rounded-2xl py-3.5" />
            </div>
          </Container>
        </div>
      </div>
    </header>
    </>
  );
}
