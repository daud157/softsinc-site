import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import { FaqAccordion } from "@/components/FaqAccordion";
import { MotionInView } from "@/components/MotionInView";
import { ServicesCatalog } from "@/components/ServicesCatalog";
import { TrustBadges } from "@/components/TrustBadges";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ReviewsGallery } from "@/components/ReviewsGallery";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, slideRight, staggerContainer } from "@/lib/animations";
import { HERO_GIRL_DESKTOP_SRC, HERO_GIRL_MOBILE_SRC } from "@/lib/heroImages";
import { loadReviews } from "@/lib/loadReviews";
import { loadServices } from "@/lib/loadServices";
import { WHATSAPP_LINK } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [reviews, services] = await Promise.all([
    loadReviews(),
    loadServices(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#FAF9FF] dark:bg-ss-bg">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
          <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-ss-bg-soft blur-3xl" />
        </div>

        {/* Mobile — headline, then hero image with CTAs tucked at feet (first-screen clarity) */}
        <Container className="px-4 pt-2 pb-8 md:px-6 lg:hidden">
          <div className="mx-auto flex w-full max-w-[320px] flex-col items-center text-center">
            <h1 className="max-w-[17.5rem] text-[1.875rem] font-extrabold leading-[1.1] tracking-tight text-ss-text sm:max-w-[19rem] sm:text-[2.25rem]">
              <span className="block">Premium</span>
              <span className="block">Digital Tools</span>
              <span className="block font-extrabold text-ss-text">at</span>
              <span className="block bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text font-extrabold text-transparent dark:from-ss-primary dark:to-ss-accent">
                Affordable Prices
              </span>
            </h1>                                                                                                   
            <p className="mt-2 max-w-[20rem] text-sm leading-relaxed text-ss-text/75 dark:text-ss-text/85">
              Your trusted softsinc for AI, career, learning, and productivity.
            </p>

            <div className="relative mt-3 w-full max-w-[20rem]">
              <div
                className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[18rem] rounded-[2rem] opacity-90 shadow-[0_0_0_1px_rgba(124,58,237,0.08),0_18px_50px_-12px_rgba(124,58,237,0.45),0_0_80px_-20px_rgba(168,85,247,0.35)] dark:opacity-75 dark:shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_18px_50px_-12px_rgba(124,58,237,0.28),0_0_72px_-18px_rgba(192,132,252,0.18)]"
              />
              <div className="relative flex justify-center">
                <div className="ss-hero-float w-full">
                  <Image
                    src={HERO_GIRL_MOBILE_SRC}
                    alt="Softsinc — premium digital tools"
                    width={320}
                    height={400}
                    priority
                    sizes="(max-width: 400px) 80vw, 320px"
                    className="h-auto w-full max-w-[20rem] object-contain object-bottom [image-rendering:auto] drop-shadow-[0_4px_24px_rgba(124,58,237,0.2)] dark:drop-shadow-[0_4px_28px_rgba(167,139,250,0.2)]"
                  />
                </div>

                {/* CTAs sit on the lower hero, read at a glance on first mobile paint */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center">
                  <div
                    className={[
                      "pointer-events-auto w-full max-w-[20rem] px-0.5",
                      "bg-gradient-to-t from-[#FAF9FF] from-[18%] via-[#FAF9FF]/96 to-transparent",
                      "pt-14 pb-0.5 max-[380px]:pt-12",
                      "dark:from-ss-bg dark:via-ss-bg/96 dark:to-transparent",
                    ].join(" ")}
                  >
                    <div className="flex w-full flex-col gap-2.5">
                      <Link
                        href="/services"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:from-ss-primary dark:to-ss-accent dark:focus-visible:ring-ss-primary/50 dark:focus-visible:ring-offset-transparent"
                      >
                        Explore Tools
                      </Link>
                      <div className="grid w-full place-items-stretch">
                        <WhatsAppButton
                          href={WHATSAPP_LINK}
                          label="Chat on WhatsApp"
                          variant="white"
                          className="!rounded-2xl w-full min-w-0 py-3.5 text-sm shadow-md ring-emerald-600/25"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TrustBadges className="mt-5 w-full max-w-[20rem] justify-center gap-1.5" />
          </div>
        </Container>

        {/* Desktop — unchanged from prior 2-col hero */}
        <Container className="hidden py-14 sm:py-20 lg:block">
          <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] xl:grid-cols-[0.82fr_1.18fr]">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
              <MotionInView variants={slideRight}>
                <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                  Digital Subscriptions • Premium Tools • Warranty
                </div>
              </MotionInView>
              <MotionInView variants={slideRight} delay={0.05}>
                <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-ss-text sm:text-6xl">
                  Premium Digital Tools at Upto 90% Off
                </h1>
              </MotionInView>
              <MotionInView variants={fadeUp} delay={0.1}>
                <p className="mt-5 text-pretty text-lg leading-8 text-ss-text/70 sm:text-xl">
                  Get trusted access to top productivity, learning, AI, and
                  business tools with reliable support and warranty.
                </p>
              </MotionInView>

              <MotionInView variants={fadeUp} delay={0.15}>
                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center rounded-full bg-ss-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-ss-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ss-bg"
                  >
                    Explore Services
                  </Link>
                  <WhatsAppButton href={WHATSAPP_LINK} />
                </div>
              </MotionInView>

              <MotionInView variants={fadeUp} delay={0.2}>
                <TrustBadges className="mt-8 justify-center lg:justify-start" />
              </MotionInView>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:min-w-0">
              <div
                className="pointer-events-none absolute inset-4 -z-10 rounded-[2.75rem] opacity-80 lg:inset-2 xl:inset-0"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(124, 58, 237, 0.08), 0 22px 60px -14px rgba(124, 58, 237, 0.35), 0 0 100px -24px rgba(168, 85, 247, 0.3)",
                }}
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.75rem] bg-transparent p-0 ring-0 dark:bg-transparent">
                <Image
                  src={HERO_GIRL_DESKTOP_SRC}
                  alt="Softsinc — premium digital tools"
                  fill
                  priority
                  sizes="(min-width: 1280px) 640px, (min-width: 1024px) 52vw, 100vw"
                  className="object-contain p-3 sm:p-5 lg:p-4 xl:p-5 [image-rendering:auto] drop-shadow-[0_4px_28px_rgba(124,58,237,0.15)]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services catalog — full product grid embedded under the hero */}
      {services.length > 0 ? (
        <section className="pt-6 pb-14 sm:pt-10 sm:pb-20">
          <Container>
            <SectionHeading
              eyebrow="Services"
              title="Pick the tool you need"
              subtitle="Browse the catalog and tap WhatsApp to order. Our team will guide you through setup."
            />
            <ServicesCatalog services={services} />
          </Container>
        </section>
      ) : null}

      {/* Reviews */}
      {reviews.length > 0 ? (
        <section className="py-14 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Reviews"
              title="Loved by Our Customers"
              subtitle="Real feedback from clients who trusted Softsinc."
            />
            <div className="mt-10">
              <ReviewsGallery reviews={reviews} limit={6} />
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-6 py-3 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
              >
                View All Reviews
              </Link>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Quick value-prop strip — moved below products so the hero flows
          straight into the catalog. */}
      <section className="pb-10 sm:pb-14">
        <Container>
          <MotionInView variants={staggerContainer}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Instant Setup",
                  heading: "Quick delivery & activation",
                  desc: "Get started fast with clear instructions and friendly support.",
                },
                {
                  title: "Trusted Access",
                  heading: "Reliable subscriptions",
                  desc: "Premium tools with warranty and responsive customer care.",
                },
                {
                  title: "Best Value",
                  heading: "Affordable pricing",
                  desc: "Save more without compromising on quality and support.",
                },
              ].map((i) => (
                <MotionInView key={i.title} variants={fadeUp}>
                  <Card className="p-6">
                    <div className="text-sm font-semibold text-ss-primary">
                      {i.title}
                    </div>
                    <div className="mt-2 text-lg font-semibold tracking-tight">
                      {i.heading}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ss-text/70">
                      {i.desc}
                    </p>
                  </Card>
                </MotionInView>
              ))}
            </div>
          </MotionInView>
        </Container>
      </section>

      {/* Why Choose */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why Softsinc"
            title="Premium experience, backed by support"
            subtitle="We focus on trust, smooth onboarding, and a clean experience from purchase to usage."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Warranty & support",
                desc: "Clear guidance and reliable after-sale support on WhatsApp.",
              },
              {
                title: "Secure & dependable",
                desc: "Trusted access to premium tools with quality assurance.",
              },
              {
                title: "Fast delivery",
                desc: "Quick turnaround and simple steps so you can start today.",
              },
            ].map((i) => (
              <Card key={i.title} className="p-6">
                <div className="text-lg font-semibold tracking-tight">
                  {i.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-ss-text/70">
                  {i.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Order in minutes"
            subtitle="A simple flow designed for speed, clarity, and peace of mind."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Pick a service",
                desc: "Browse services and select the tool you want.",
              },
              {
                step: "02",
                title: "Order on WhatsApp",
                desc: "Tap the WhatsApp button and tell us your plan/duration.",
              },
              {
                step: "03",
                title: "Activate securely",
                desc: "We guide you through activation with clear, simple steps.",
              },
              {
                step: "04",
                title: "Ongoing warranty",
                desc: "We remain available for support, questions, and warranty.",
              },
            ].map((i) => (
              <Card key={i.step} className="p-6">
                <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                  Step {i.step}
                </div>
                <div className="mt-3 text-lg font-semibold tracking-tight">
                  {i.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-ss-text/70">
                  {i.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions"
            subtitle="If you need help choosing, just message us on WhatsApp."
          />
          <div className="mt-10">
            <FaqAccordion
              items={[
                {
                  question: "Is there a warranty?",
                  answer:
                    "Yes — we provide warranty and support based on the selected service.",
                },
                {
                  question: "How do I place an order?",
                  answer:
                    "Tap any “Order on WhatsApp” button and share the service + duration you want.",
                },
                {
                  question: "How fast is delivery?",
                  answer:
                    "Most activations are fast. Delivery time may vary by service and plan.",
                },
                {
                  question: "Can I get help with setup?",
                  answer:
                    "Absolutely — our team guides you through setup and stays available for support.",
                },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-14 sm:py-20">
        <Container>
          <Card className="overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-ss-bg-soft px-3 py-1 text-xs font-semibold text-ss-primary ring-1 ring-ss-primary/10">
                  Ready to order?
                </div>
                <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  Message Softsinc on WhatsApp to get started
                </h3>
                <p className="mt-3 text-sm leading-6 text-ss-text/70 sm:text-base">
                  Tell us the service you want and we’ll guide you through pricing
                  and setup.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <WhatsAppButton className="w-full" />
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full bg-ss-bg-soft px-6 py-3 text-sm font-semibold text-ss-primary ring-1 ring-ss-primary/10 hover:bg-ss-bg-soft/70"
                >
                  Browse services
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
