import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { cloudinaryBrandingLogoDeliveryUrl } from "@/lib/cloudinaryBrandingUrl";
import { loadServices } from "@/lib/loadServices";
import { NAV_LINKS, WHATSAPP_LINK } from "@/lib/site";

export async function Footer({ siteLogoUrl }: { siteLogoUrl?: string | null }) {
  const services = await loadServices();
  const logoUrl = siteLogoUrl?.trim() || undefined;
  // Show up to 6 footer links; prefer popular products first.
  const topServices = [...services]
    .sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)))
    .slice(0, 6);

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
              <div className="text-base font-semibold tracking-tight text-ss-text">Softsinc</div>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-ss-text/70">
              Premium digital tools and subscriptions at affordable prices, with
              reliable support and warranty.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-4 py-2 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
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
            <div className="text-sm font-semibold text-ss-text">Top services</div>
            {topServices.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm">
                {topServices.map((s) => (
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
              <p className="mt-4 text-xs text-ss-text/55">
                Catalog coming soon.
              </p>
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-ss-text">Contact</div>
            <ul className="mt-4 space-y-3 text-sm text-ss-text/70">
              <li>
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ss-text"
                >
                  Chat on WhatsApp
                </Link>
              </li>
              <li className="text-xs text-ss-text/60">
                Final price depends on plan, duration, and availability.
              </li>
            </ul>

            <div className="mt-6">
              <div className="text-sm font-semibold text-ss-text">Social</div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 font-semibold text-zinc-800 ring-1 ring-black/10 hover:bg-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:ring-white/20"
                >
                  Facebook
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 font-semibold text-zinc-800 ring-1 ring-black/10 hover:bg-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:ring-white/20"
                >
                  Instagram
                </Link>
              </div>
              <div className="mt-2 text-xs text-ss-text/50">
                (Add real social links when ready.)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-black/5 pt-6 text-sm text-ss-text/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Softsinc. All rights reserved.</span>
          <span>Built for a premium, clean experience.</span>
        </div>
      </Container>
    </footer>
  );
}
