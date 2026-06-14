import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loadServices } from "@/lib/loadServices";
import { WHATSAPP_LINK } from "@/lib/site";
import {
  breadcrumbItemsForRoute,
  buildPageJsonLd,
  buildServiceListJsonLd,
  publicPageMetadata,
  routeByPath,
} from "@/lib/seo";

export const metadata = publicPageMetadata("/services");

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const route = routeByPath("/services");
  const services = await loadServices();
  return (
    <div>
      <JsonLd
        id="softsinc-services-webpage-jsonld"
        data={buildPageJsonLd(route)}
      />
      {services.length > 0 ? (
        <JsonLd
          id="softsinc-services-catalog-jsonld"
          data={buildServiceListJsonLd({
            services,
            path: "/services",
            name: "Softsinc premium subscription services in Pakistan",
          })}
        />
      ) : null}
      <Breadcrumbs items={breadcrumbItemsForRoute(route)} className="pt-5" />
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
        </div>

        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
              Premium subscriptions • Tools • Support
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Premium Subscription Services in Pakistan
            </h1>
            <p className="mt-4 text-pretty text-lg leading-8 text-ss-text/70">
              Browse Softsinc premium digital subscriptions in Pakistan — AI,
              design, productivity, learning, business and security tools at
              affordable prices. Tap WhatsApp to order and get setup help.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton href={WHATSAPP_LINK} />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-6 py-3 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Catalog"
            title="Pick the tool you need"
            subtitle="Each service includes guidance, support, and a clean ordering experience."
          />
          <ServicesCatalog services={services} />
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <Card className="p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                  Need help choosing?
                </div>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Tell us your use case and we’ll recommend the best option
                </h2>
                <p className="mt-3 text-sm leading-6 text-ss-text/70 sm:text-base">
                  Share your goals (learning, AI, productivity, business), and
                  we’ll guide you to the right tool and plan.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <WhatsAppButton className="w-full" />
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-6 py-3 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}

