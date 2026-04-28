import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/adminAuth";
import { connectDB } from "@/lib/mongodb";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { ProductModel, PRODUCT_CATEGORIES } from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  slug?: unknown;
  title?: unknown;
  description?: unknown;
  category?: unknown;
  logoUrl?: unknown;
  images?: unknown;
  iconLabel?: unknown;
  popular?: unknown;
  disabled?: unknown;
  benefits?: unknown;
  originalPrice?: unknown;
  offerPrice?: unknown;
  priceSuffix?: unknown;
  discountPercent?: unknown;
  plans?: unknown;
};

type IncomingPlan = {
  name?: unknown;
  duration?: unknown;
  offerPrice?: unknown;
  originalPrice?: unknown;
  originalPriceNote?: unknown;
  priceSuffix?: unknown;
  popular?: unknown;
  disabled?: unknown;
  headline?: unknown;
  keyHighlights?: unknown;
  benefits?: unknown;
  requirements?: unknown;
  activationSteps?: unknown;
  customHeading?: unknown;
  customContent?: unknown;
};

const HEADING_TONES = ["primary", "accent", "emerald", "amber"] as const;

function normalizeCustomHeading(v: unknown) {
  if (!v || typeof v !== "object") return undefined;
  const h = v as {
    eyebrow?: unknown;
    title?: unknown;
    subtitle?: unknown;
    tone?: unknown;
  };
  const eyebrow = asString(h.eyebrow);
  const title = asString(h.title);
  const subtitle = asString(h.subtitle);
  const toneRaw = asString(h.tone);
  const tone = (HEADING_TONES as readonly string[]).includes(toneRaw)
    ? (toneRaw as (typeof HEADING_TONES)[number])
    : "primary";

  if (!eyebrow && !title && !subtitle) return undefined;
  return { eyebrow, title, subtitle, tone };
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function normalizePlans(v: unknown) {
  if (!Array.isArray(v)) return [];
  return (v as IncomingPlan[])
    .map((p) => {
      const name = asString(p.name);
      const offer = asNumber(p.offerPrice);
      if (!name || offer === undefined) return null;
      return {
        name,
        duration: asString(p.duration),
        offerPrice: offer,
        originalPrice: asNumber(p.originalPrice),
        originalPriceNote: asString(p.originalPriceNote),
        priceSuffix: asString(p.priceSuffix, "/month"),
        popular: Boolean(p.popular),
        disabled: Boolean(p.disabled),
        headline: asString(p.headline),
        keyHighlights: asStringArray(p.keyHighlights),
        benefits: asStringArray(p.benefits),
        requirements: asStringArray(p.requirements),
        activationSteps: asStringArray(p.activationSteps),
        customHeading: normalizeCustomHeading(p.customHeading),
        customContent: sanitizeHtml(p.customContent),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

export function normalizeBody(body: Body) {
  const slug = asString(body.slug).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const title = asString(body.title);
  const description = asString(body.description);
  const categoryRaw = asString(body.category);
  const category = (PRODUCT_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? categoryRaw
    : "Productivity";
  const offerPrice = asNumber(body.offerPrice);

  return {
    slug,
    title,
    description,
    category,
    logoUrl: asString(body.logoUrl),
    images: asStringArray(body.images),
    iconLabel: asString(body.iconLabel),
    popular: Boolean(body.popular),
    disabled: Boolean(body.disabled),
    benefits: asStringArray(body.benefits),
    offerPrice,
    originalPrice: asNumber(body.originalPrice),
    priceSuffix: asString(body.priceSuffix, "/month"),
    discountPercent: asNumber(body.discountPercent),
    plans: normalizePlans(body.plans),
  };
}

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error("[api/products GET] error:", err);
    const message = err instanceof Error ? err.message : "Failed to load products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Body | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const normalized = normalizeBody(body);

    if (!normalized.slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }
    if (!normalized.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (normalized.offerPrice === undefined) {
      return NextResponse.json(
        { error: "offerPrice is required (numeric)" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await ProductModel.findOne({ slug: normalized.slug });
    if (existing) {
      return NextResponse.json(
        { error: `A product with slug "${normalized.slug}" already exists.` },
        { status: 409 }
      );
    }

    const product = await ProductModel.create(normalized);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[api/products POST] error:", err);
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
