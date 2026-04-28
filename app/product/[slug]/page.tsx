import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import type { ReviewItem } from "@/data/reviews";
import { loadProductBySlug } from "@/lib/loadProduct";
import { loadReviews } from "@/lib/loadReviews";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} — Softsinc`,
      description: product.description,
      url: `/product/${product.slug}`,
      type: "website",
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — Softsinc`,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allReviews] = await Promise.all([
    loadProductBySlug(slug),
    loadReviews(),
  ]);
  if (!product) notFound();

  const reviews = pickProductReviews(allReviews, {
    title: product.title,
    slug: product.slug,
  });

  return <ProductDetailClient product={product} reviews={reviews} />;
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
