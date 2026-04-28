import "server-only";

import type { Service } from "@/lib/services";
import { WHATSAPP_LINK } from "@/lib/site";

/**
 * Server-side helper that returns the public services catalog from MongoDB.
 *
 * - Filters out products marked as `disabled`.
 * - Derives the headline "from" price from the cheapest enabled plan when
 *   plans exist; otherwise falls back to the product-level `offerPrice`.
 * - Returns an empty array if the DB is unreachable or has no products. The
 *   public catalog is fully admin-managed at `/admin/products`.
 */
export async function loadServices(): Promise<Service[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { ProductModel } = await import("@/models/Product");

    await connectDB();
    const docs = await ProductModel.find({ disabled: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();

    if (!docs || docs.length === 0) return [];

    return docs
      .map<Service | null>((d) => {
        const slug = String(d.slug ?? "").trim();
        if (!slug) return null;

        const enabledPlans = (d.plans ?? []).filter((p) => !p.disabled);
        const cheapest = enabledPlans.reduce<{ offer: number; suffix?: string } | null>(
          (acc, p) => {
            const offer = Number(p.offerPrice);
            if (!Number.isFinite(offer)) return acc;
            if (!acc || offer < acc.offer) {
              return { offer, suffix: p.priceSuffix };
            }
            return acc;
          },
          null
        );

        const offerPrice =
          cheapest && Number.isFinite(cheapest.offer)
            ? cheapest.offer
            : Number(d.offerPrice ?? 0);

        const priceSuffix =
          (cheapest?.suffix && cheapest.suffix.trim()) ||
          (d.priceSuffix && d.priceSuffix.trim()) ||
          "/month";

        return {
          slug,
          title: String(d.title ?? slug),
          description: String(d.description ?? ""),
          benefits: Array.isArray(d.benefits) ? d.benefits.filter(Boolean) : [],
          iconLabel: String(d.iconLabel ?? ""),
          logoUrl: d.logoUrl ? String(d.logoUrl) : undefined,
          whatsappLink: WHATSAPP_LINK,
          category: (d.category ?? "Productivity") as Service["category"],
          popular: Boolean(d.popular),
          originalPrice:
            typeof d.originalPrice === "number" ? d.originalPrice : undefined,
          offerPrice,
          priceSuffix,
          discountPercent:
            typeof d.discountPercent === "number" ? d.discountPercent : undefined,
        };
      })
      .filter((s): s is Service => s !== null);
  } catch (err) {
    console.error(
      "[loadServices] Failed to load products from MongoDB. Returning empty catalog.",
      err
    );
    return [];
  }
}

/** Convenience helper for components that only want popular items. */
export async function loadPopularServices(): Promise<Service[]> {
  const all = await loadServices();
  return all.filter((s) => s.popular);
}
