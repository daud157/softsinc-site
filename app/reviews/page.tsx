import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { ReviewsGallery } from "@/components/ReviewsGallery";
import { TrustBadges } from "@/components/TrustBadges";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loadReviews } from "@/lib/loadReviews";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Real customer reviews for Softsinc services, support, and activation experience.",
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await loadReviews();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-ss-bg-soft blur-3xl" />
        <div className="absolute -bottom-48 right-[-140px] h-[620px] w-[620px] rounded-full bg-ss-bg-soft blur-3xl" />
        <div className="absolute -bottom-44 left-[-160px] h-[520px] w-[520px] rounded-full bg-ss-bg-soft/70 blur-3xl" />
      </div>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Reviews"
            title="Real Customer Reviews"
            subtitle="See what our customers say about Softsinc services, support, and activation experience."
          />
          <TrustBadges className="mt-10" />
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <ReviewsGallery reviews={reviews} />
        </Container>
      </section>
    </div>
  );
}
