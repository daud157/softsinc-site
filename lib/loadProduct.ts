import "server-only";

import type {
  ApiPlan,
  PlanCustomHeading,
  PlanHeadingTone,
} from "@/data/products";
import type { Product } from "@/data/services";
import { WHATSAPP_LINK } from "@/lib/site";

/**
 * Server-only helper that loads a single product (with full detail-page
 * shape) from MongoDB.
 *
 * Returns null when the slug doesn't exist, the product is disabled, or the
 * database is unreachable.
 */
export async function loadProductBySlug(slug: string): Promise<Product | null> {
  const trimmed = slug?.trim().toLowerCase();
  if (!trimmed) return null;

  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { ProductModel } = await import("@/models/Product");

    await connectDB();
    const doc = await ProductModel.findOne({
      slug: trimmed,
      disabled: { $ne: true },
    }).lean();

    if (!doc) return null;

    const plans: ApiPlan[] = (doc.plans ?? [])
      .filter((p) => !p.disabled)
      .map((p) => ({
        name: String(p.name ?? ""),
        duration: String(p.duration ?? ""),
        offerPrice: Number(p.offerPrice ?? 0),
        originalPrice:
          typeof p.originalPrice === "number" ? p.originalPrice : undefined,
        originalPriceNote:
          typeof p.originalPriceNote === "string" && p.originalPriceNote.trim()
            ? p.originalPriceNote.trim()
            : undefined,
        priceSuffix: p.priceSuffix?.trim() || "/month",
        popular: Boolean(p.popular),
        disabled: false,
        headline:
          typeof p.headline === "string" && p.headline.trim()
            ? p.headline.trim()
            : undefined,
        keyHighlights: cleanList(p.keyHighlights),
        benefits: cleanList(p.benefits),
        requirements: cleanList(p.requirements),
        activationSteps: cleanList(p.activationSteps),
        customHeading: cleanCustomHeading(p.customHeading),
        customContent:
          typeof p.customContent === "string" && p.customContent.trim()
            ? p.customContent
            : undefined,
      }));

    // Headline price: cheapest enabled plan if any, otherwise the doc-level offer.
    const cheapest = plans.reduce<{ offer: number; suffix: string } | null>(
      (acc, p) => {
        if (!Number.isFinite(p.offerPrice)) return acc;
        if (!acc || p.offerPrice < acc.offer) {
          return { offer: p.offerPrice, suffix: p.priceSuffix };
        }
        return acc;
      },
      null
    );
    const offerPrice = cheapest ? cheapest.offer : Number(doc.offerPrice ?? 0);
    const priceSuffix =
      cheapest?.suffix || (doc.priceSuffix?.trim() || "/month");

    const benefits = Array.isArray(doc.benefits)
      ? doc.benefits.filter(Boolean)
      : [];

    // UI-only defaults for fields not (yet) editable in admin.
    const features =
      benefits.length > 0
        ? benefits
        : [
            "Reliable subscription with warranty",
            "Quick activation guidance",
            "WhatsApp-first support",
          ];

    const whatYouGet = [
      "Setup guidance on WhatsApp",
      "Plan options based on availability",
      "Ongoing support during your duration",
      "Simple ordering experience",
      "Warranty/support as applicable",
    ];

    const faqs = [
      {
        question: "Is the pricing fixed?",
        answer:
          "Pricing can vary by plan and duration. Final price depends on plan, duration, and availability.",
      },
      {
        question: "How do I place an order?",
        answer:
          "Tap “Check Availability on WhatsApp” and share the product + plan + duration you want.",
      },
      {
        question: "How fast is activation?",
        answer:
          "Most activations are quick. Timing can vary based on plan and availability.",
      },
      {
        question: "Do you provide support?",
        answer:
          "Yes—WhatsApp-first support is available for setup and questions. Warranty/support depends on the selected service.",
      },
    ];

    const worksOn: Product["worksOn"] = ["Web", "Windows", "macOS", "Android", "iOS"];

    const product: Product = {
      slug: String(doc.slug),
      title: String(doc.title ?? doc.slug),
      description: String(doc.description ?? ""),
      benefits,
      iconLabel: String(doc.iconLabel ?? ""),
      logoUrl: doc.logoUrl ? String(doc.logoUrl) : undefined,
      whatsappLink: WHATSAPP_LINK,
      category: (doc.category ?? "Productivity") as Product["category"],
      popular: Boolean(doc.popular),
      originalPrice:
        typeof doc.originalPrice === "number" ? doc.originalPrice : undefined,
      offerPrice,
      priceSuffix,
      discountPercent:
        typeof doc.discountPercent === "number" ? doc.discountPercent : undefined,

      images: buildGallery(doc.images, doc.logoUrl),
      badge: doc.popular ? "Bestseller" : undefined,
      rating: { value: 4.8, reviewsText: "320+ reviews" },
      plans,
      durations: derivedDurations(plans),
      features,
      whatYouGet,
      worksOn,
      faqs,
    };

    return product;
  } catch (err) {
    console.error("[loadProductBySlug] DB error:", err);
    return null;
  }
}

const HEADING_TONES: readonly PlanHeadingTone[] = [
  "primary",
  "accent",
  "emerald",
  "amber",
];

function cleanCustomHeading(v: unknown): PlanCustomHeading | undefined {
  if (!v || typeof v !== "object") return undefined;
  const h = v as Record<string, unknown>;
  const eyebrow = typeof h.eyebrow === "string" ? h.eyebrow.trim() : "";
  const title = typeof h.title === "string" ? h.title.trim() : "";
  const subtitle = typeof h.subtitle === "string" ? h.subtitle.trim() : "";
  if (!eyebrow && !title && !subtitle) return undefined;
  const toneRaw = typeof h.tone === "string" ? h.tone : "";
  const tone: PlanHeadingTone = HEADING_TONES.includes(
    toneRaw as PlanHeadingTone
  )
    ? (toneRaw as PlanHeadingTone)
    : "primary";
  return {
    eyebrow: eyebrow || undefined,
    title: title || undefined,
    subtitle: subtitle || undefined,
    tone,
  };
}

function cleanList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildGallery(
  rawImages: unknown,
  logoUrl: unknown
): string[] {
  const list = Array.isArray(rawImages)
    ? rawImages
        .filter((u): u is string => typeof u === "string")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];
  if (list.length > 0) return list;
  if (typeof logoUrl === "string" && logoUrl.trim()) return [logoUrl.trim()];
  return [];
}

function derivedDurations(plans: ApiPlan[]): Product["durations"] {
  const seen = new Set<string>();
  const out: Product["durations"] = [];
  for (const p of plans) {
    const label = (p.duration || "").trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    out.push({ label, value: label });
  }
  return out;
}

/**
 * Returns slugs of every enabled product (for sitemap / static generation).
 */
export async function loadAllProductSlugs(): Promise<string[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { ProductModel } = await import("@/models/Product");
    await connectDB();
    const docs = await ProductModel.find({ disabled: { $ne: true } })
      .select({ slug: 1 })
      .lean();
    return docs.map((d) => String(d.slug)).filter(Boolean);
  } catch (err) {
    console.error("[loadAllProductSlugs] DB error:", err);
    return [];
  }
}
