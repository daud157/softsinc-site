import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import { cloudinaryBrandingLogoDeliveryUrl } from "@/lib/cloudinaryBrandingUrl";
import { loadServices } from "@/lib/loadServices";
import { NAV_LINKS, SOCIAL_URLS, WHATSAPP_LINK } from "@/lib/site";

function socialPillClass(active: boolean) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition-colors",
    active
      ? "bg-white text-zinc-800 ring-black/10 hover:bg-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:ring-white/20"
      : "cursor-default bg-ss-bg-soft/50 text-ss-text/45 ring-black/5 dark:ring-white/10"
  );
}

export async function Footer({ siteLogoUrl }: { siteLogoUrl?: string | null }) {
  const services = await loadServices();
  const logoUrl = siteLogoUrl?.trim() || undefined;
  /** Same order as the public catalog (admin-controlled). */
  const featuredServices = services.slice(0, 6);
  const hasSocial =
    Boolean(SOCIAL_URLS.facebook) || Boolean(SOCIAL_URLS.instagram);

  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/10 dark:bg-zinc-950">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex flex-wrap items-center gap-4">
              {logoUrl ? (
                <span className="relative z-[1] block h-10 w-28 shrink-0 -translate-x-7 overflow-visible bg-transparent md:-translate-x-10 lg:-translate-x-12">
                  <Image
                    src={cloudinaryBrandingLogoDeliveryUrl(logoUrl)}
                    alt="Softsinc"
                    fill
                    sizes="(max-width: 767px) 220px, 360px"
                    className="origin-left scale-[1.58] object-contain object-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] md:scale-[2.08] lg:scale-[2.22] xl:scale-[2.35] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                  />
                </span>
              ) : null}
              <div className="text-base font-semibold tracking-tight text-ss-text">
                Softsinc
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-ss-text/70">
              Premium digital tools and subscriptions at affordable prices—clear
              guidance, WhatsApp-first support, and warranty-minded delivery.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ss-text/55">
              <Link href="/about" className="font-medium text-ss-primary/90 hover:text-ss-primary">
                About us
              </Link>
              <span className="mx-2 text-ss-text/35">·</span>
              <Link
                href="/contact"
                className="font-medium text-ss-primary/90 hover:text-ss-primary"
              >
                Contact
              </Link>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 transition hover:bg-[#20bd5a] hover:shadow-md"
              >
                WhatsApp
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-800 ring-1 ring-black/10 hover:bg-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:ring-white/20"
              >
                Browse services
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-ss-text">Quick links</div>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ss-text/70 hover:text-ss-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-ss-text">
              Featured services
            </div>
            {featuredServices.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm">
                {featuredServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/product/${encodeURIComponent(s.slug)}`}
                      className="text-ss-text/70 hover:text-ss-text"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-ss-text/55">Catalog coming soon.</p>
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-ss-text">Get help</div>
            <ul className="mt-4 space-y-3 text-sm text-ss-text/70">
              <li>
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ss-primary hover:text-ss-accent"
                >
                  Message us on WhatsApp →
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ss-text">
                  Contact page
                </Link>
              </li>
              <li className="text-xs leading-relaxed text-ss-text/55">
                Pricing varies by plan and duration. We confirm availability on
                WhatsApp before you pay.
              </li>
            </ul>

            <div className="mt-6">
              <div className="text-sm font-semibold text-ss-text">Social</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIAL_URLS.facebook ? (
                  <Link
                    href={SOCIAL_URLS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialPillClass(true)}
                  >
                    Facebook
                  </Link>
                ) : (
                  <span className={socialPillClass(false)}>Facebook</span>
                )}
                {SOCIAL_URLS.instagram ? (
                  <Link
                    href={SOCIAL_URLS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialPillClass(true)}
                  >
                    Instagram
                  </Link>
                ) : (
                  <span className={socialPillClass(false)}>Instagram</span>
                )}
              </div>
              {!hasSocial ? (
                <p className="mt-2 text-xs text-ss-text/50">
                  Social profiles coming soon—follow us here once we publish.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-black/5 pt-6 text-sm text-ss-text/60 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Softsinc. All rights reserved.</span>
          <span className="text-ss-text/50">
            Pakistan · Digital subscriptions and tools
          </span>
        </div>
      </Container>
    </footer>
  );
}
