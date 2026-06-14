import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import type { ReviewItem } from "@/data/reviews";
import { loadProductBySlug } from "@/lib/loadProduct";
import { loadReviews } from "@/lib/loadReviews";
import { loadServices } from "@/lib/loadServices";
import type { Service } from "@/lib/services";
import { SITE_URL } from "@/lib/site";
import {
  SITE_NAME,
  SITE_REGION,
  absoluteUrl,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  type BreadcrumbItem,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) return {};

  const path = `/product/${encodeURIComponent(product.slug)}`;
  const title = `Buy ${product.title} in ${SITE_REGION} | Softsinc`;
  const description = product.description
    ? trimDescription(product.description)
    : `Buy ${product.title} in ${SITE_REGION} from Softsinc at an affordable price with flexible plans, instant activation, warranty and WhatsApp support.`;
  const image = product.images?.[0];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      siteName: SITE_NAME,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allReviews, services] = await Promise.all([
    loadProductBySlug(slug),
    loadReviews(),
    loadServices(),
  ]);
  if (!product) notFound();

  const reviews = pickProductReviews(allReviews, {
    title: product.title,
    slug: product.slug,
  });
  const relatedServices = pickRelatedServices(services, product);
  const path = `/product/${encodeURIComponent(product.slug)}`;
  const breadcrumbs = productBreadcrumbs(product.title, product.slug);

  return (
    <>
      <JsonLd
        id="softsinc-product-jsonld"
        data={buildProductPageJsonLd({
          product,
          path,
          breadcrumbs,
        })}
      />
      <ProductDetailClient
        product={product}
        reviews={reviews}
        relatedServices={relatedServices}
      />
    </>
  );
}

function trimDescription(description: string, max = 155): string {
  const cleaned = description.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trim()}…`;
}

function productBreadcrumbs(title: string, slug: string): BreadcrumbItem[] {
  return [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: title, href: `/product/${encodeURIComponent(slug)}` },
  ];
}

function buildProductPageJsonLd({
  product,
  path,
  breadcrumbs,
}: {
  product: Awaited<ReturnType<typeof loadProductBySlug>> extends infer P
    ? NonNullable<P>
    : never;
  path: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  const url = absoluteUrl(path);
  const description = trimDescription(
    product.description ||
      `Buy ${product.title} in ${SITE_REGION} from Softsinc with WhatsApp support and guided activation.`
  );

  const planPrices = product.plans
    .map((plan) => Number(plan.offerPrice))
    .filter((price) => Number.isFinite(price) && price > 0);
  const lowPrice = planPrices.length > 0 ? Math.min(...planPrices) : product.offerPrice;
  const highPrice =
    planPrices.length > 0 ? Math.max(...planPrices) : product.originalPrice ?? product.offerPrice;
  const offerCount = Math.max(planPrices.length, 1);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageSchema({
        path,
        title: `Buy ${product.title} in ${SITE_REGION} | Softsinc`,
        description,
        breadcrumbs,
      }),
      buildBreadcrumbSchema(breadcrumbs),
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.title,
        description,
        image: product.images.length > 0 ? product.images : undefined,
        brand: { "@type": "Brand", name: SITE_NAME },
        category: product.category,
        url,
        offers: {
          "@type": "AggregateOffer",
          lowPrice,
          highPrice,
          offerCount,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
          url,
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
    ],
  };
}

function pickRelatedServices(
  services: Service[],
  product: { slug: string; category: Service["category"] },
  limit = 4
): Service[] {
  return services
    .filter((service) => service.slug !== product.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === product.category) + Number(a.popular);
      const bScore = Number(b.category === product.category) + Number(b.popular);
      return bScore - aScore;
    })
    .slice(0, limit);
}

/**
 * Prioritise reviews that mention this product (by title or slug), then
 * featured reviews, then the rest. Caps the result so the section stays
 * focused on the strongest social proof.
 */
function pickProductReviews(
  reviews: ReviewItem[],
  product: { title: string; slug: string },
  limit = 6
): ReviewItem[] {
  if (reviews.length === 0) return [];

  const title = product.title.toLowerCase();
  const slug = product.slug.toLowerCase();

  const score = (r: ReviewItem) => {
    const service = (r.service ?? "").toLowerCase();
    let s = 0;
    if (service && (service.includes(title) || service.includes(slug))) s += 3;
    if (r.featured) s += 1;
    return s;
  };

  const scored = reviews
    .map((r) => ({ r, s: score(r) }))
    .sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s;
      const aTime = a.r.createdAt ? Date.parse(a.r.createdAt) : 0;
      const bTime = b.r.createdAt ? Date.parse(b.r.createdAt) : 0;
      return bTime - aTime;
    });

  const matched = scored.filter((x) => x.s >= 3).map((x) => x.r);
  if (matched.length >= 3) return matched.slice(0, limit);

  return scored.slice(0, limit).map((x) => x.r);
}
