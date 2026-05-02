import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Softsinc brings trusted access to premium digital subscriptions—learning, AI, productivity, and more—with WhatsApp-first support and clear pricing.",
};

function IconSpark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 2l1.09 4.26L17 7l-4.26 1.09L12 12l-1.09-4.91L7 7l3.91-.74L12 2z"
        className="fill-ss-primary/90"
      />
      <path
        d="M19 13l.68 2.64 2.64.68-2.64.68L19 19l-.68-2.64-2.64-.68 2.64-.68L19 13zM5 15l.55 2.14 2.14.55-2.14.55L5 20l-.55-2.14-2.14-.55 2.14-.55L5 15z"
        className="fill-ss-accent/80"
      />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2l8 4v6c0 5-3.5 9.5-8 10.5-4.5-1-8-5.5-8-10.5V6l8-4z"
        className="stroke-ss-primary"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        className="stroke-emerald-600 dark:stroke-emerald-400"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-5l-4 3v-3H6a2 2 0 01-2-2V6z"
        className="stroke-ss-primary"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 12h5"
        className="stroke-ss-text/40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCatalog({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 5h6v14H4V5zm10 0h6v8h-6V5z"
        className="stroke-ss-primary"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 16h6v3h-6v-3z"
        className="stroke-ss-accent"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const pillars = [
  {
    title: "Our mission",
    desc: "Make premium tools easier to access through trusted delivery, honest guidance, and support that actually replies.",
    icon: IconSpark,
  },
  {
    title: "What we offer",
    desc: "Curated digital subscriptions across learning, AI, productivity, business, creative tools, and security—aligned to what customers ask for most.",
    icon: IconCatalog,
  },
  {
    title: "How we support you",
    desc: "WhatsApp-first help for recommendations, setup, warranty questions, and follow-ups—so you are never guessing what happens next.",
    icon: IconChat,
  },
  {
    title: "Trust and clarity",
    desc: "We focus on clear plan options, availability checks before payment, and expectations that match how these products actually work.",
    icon: IconShield,
  },
] as const;

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
          <div className="absolute -bottom-32 right-[-120px] h-[380px] w-[380px] rounded-full bg-ss-primary/[0.07] blur-3xl dark:bg-ss-primary/10" />
        </div>

        <Container>
          <SectionHeading
            eyebrow="About Softsinc"
            title="Premium tools, priced fairly, supported properly"
            subtitle="We help people and teams get legitimate access to the subscriptions they need—without confusing checkout flows or abandoned tickets. Tell us what you want on WhatsApp; we guide you from selection to activation."
          />
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full bg-ss-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ss-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/35"
            >
              Browse the catalog
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ss-text ring-1 ring-black/10 transition hover:bg-ss-bg-soft dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15"
            >
              Read reviews
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/[0.06] bg-ss-bg-soft/40 py-14 dark:border-white/10 dark:bg-white/[0.03] sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-ss-text sm:text-3xl">
              Built around how you actually buy software
            </h2>
            <p className="mt-3 text-pretty text-sm leading-7 text-ss-text/70 sm:text-base">
              No noisy marketplace—just the tools we can stand behind, explained in plain language, with a single channel when you need a human.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {pillars.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className="p-6 sm:p-7">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-ss-primary/15 dark:bg-zinc-900 dark:ring-ss-primary/25">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-semibold tracking-tight text-ss-text">
                        {c.title}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-ss-text/70">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <Card className="overflow-hidden p-0 ring-ss-primary/15">
            <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
              <div className="p-8 sm:p-10">
                <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                  Get in touch
                </div>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-ss-text sm:text-3xl">
                  Need a recommendation or a quote?
                </h2>
                <p className="mt-3 text-sm leading-7 text-ss-text/70 sm:text-base">
                  Share the product name, plan length, and anything we should
                  know about your account or region. We reply on WhatsApp with
                  options, timing, and next steps—usually the same day.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-ss-text/75">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary" />
                    Not sure which tier fits? Ask—we map plans to real use cases.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ss-primary" />
                    Prefer email-style detail? Use our{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-ss-primary hover:text-ss-accent"
                    >
                      contact page
                    </Link>{" "}
                    and we still route you to the same team.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center gap-4 border-t border-black/[0.06] bg-ss-bg-soft/50 p-8 sm:p-10 md:border-l md:border-t-0 dark:border-white/10 dark:bg-white/[0.04]">
                <WhatsAppButton className="w-full justify-center sm:w-auto" />
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-ss-text ring-1 ring-black/10 transition hover:bg-white/90 dark:bg-zinc-900 dark:text-white dark:ring-white/15"
                >
                  View all services
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
