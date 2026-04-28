import Link from "next/link";

import { Container } from "@/components/Container";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHATSAPP_LINK } from "@/lib/site";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
        </div>

        <Container>
          <SectionHeading
            eyebrow="Contact"
            title="Talk to Softsinc"
            subtitle="For orders, recommendations, and support—WhatsApp is the fastest way to reach us."
          />
          <div className="mt-8 flex justify-center">
            <WhatsAppButton />
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <div className="text-lg font-semibold tracking-tight">
                Send a message
              </div>
              <p className="mt-2 text-sm leading-6 text-ss-text/70">
                This form is a placeholder. In production you can connect it to
                email, a CRM, or an API route.
              </p>

              <form className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-ss-text/80">
                    Full name
                  </span>
                  <input
                    className="h-11 rounded-2xl border border-transparent bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-ss-primary/25 dark:bg-white/95 dark:text-zinc-900 dark:placeholder:text-zinc-500"
                    placeholder="Your name"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-ss-text/80">
                    WhatsApp / Phone
                  </span>
                  <input
                    className="h-11 rounded-2xl border border-transparent bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-500 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-ss-primary/25 dark:bg-white/95 dark:text-zinc-900 dark:placeholder:text-zinc-500"
                    placeholder="+92..."
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-ss-text/80">
                    What do you need?
                  </span>
                  <textarea
                    className="min-h-28 rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-ss-primary/25 dark:bg-white/95 dark:text-zinc-900 dark:placeholder:text-zinc-500"
                    placeholder="E.g., Cursor Pro for 1 month, or recommend a tool for learning AI…"
                  />
                </label>

                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-ss-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-ss-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg"
                  >
                    Message on WhatsApp instead
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-6 py-3 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
                  >
                    Submit (placeholder)
                  </button>
                </div>
              </form>
            </Card>

            <div className="grid gap-5">
              <Card className="p-6">
                <div className="text-sm font-semibold text-ss-primary">
                  WhatsApp
                </div>
                <div className="mt-2 text-base font-semibold tracking-tight">
                  Fastest response
                </div>
                <p className="mt-2 text-sm leading-6 text-ss-text/70">
                  Tap to order or ask questions. We reply as quickly as possible.
                </p>
                <div className="mt-5">
                  <WhatsAppButton className="w-full" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm font-semibold text-ss-primary">
                  Business hours
                </div>
                <p className="mt-2 text-sm leading-6 text-ss-text/70">
                  Available daily. Response times vary depending on demand.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

