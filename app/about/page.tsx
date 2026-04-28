import { Container } from "@/components/Container";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
        </div>

        <Container>
          <SectionHeading
            eyebrow="About Softsinc"
            title="A premium, reliable way to access digital tools"
            subtitle="We help customers get trusted access to premium subscriptions and productivity tools—backed by responsive support and a clean ordering experience."
          />
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Our mission",
                desc: "Make premium tools accessible through trusted delivery, clear guidance, and real support.",
              },
              {
                title: "What we deliver",
                desc: "Digital subscriptions across learning, AI, productivity, business, and creative categories.",
              },
              {
                title: "How we support you",
                desc: "WhatsApp-first support that stays with you for setup, warranty, and questions.",
              },
            ].map((c) => (
              <Card key={c.title} className="p-6">
                <div className="text-lg font-semibold tracking-tight">
                  {c.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-ss-text/70">
                  {c.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <Card className="p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                  Get in touch
                </div>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Need a recommendation or pricing?
                </h2>
                <p className="mt-3 text-sm leading-6 text-ss-text/70 sm:text-base">
                  Tell us the tool you’re looking for and the duration you want.
                  We’ll respond quickly with options and next steps.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <WhatsAppButton className="w-full" />
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}

