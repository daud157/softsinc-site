import type { Service } from "@/lib/services";
import type { ApiPlan } from "@/data/products";

export type ProductFaq = { question: string; answer: string };
export type ProductDuration = { label: string; value: string; badge?: string };

/**
 * Detailed product shape used by the product detail page.
 *
 * Built from a MongoDB product document (see `models/Product.ts`) plus a
 * handful of UI-only defaults (rating, FAQs, "works on" platforms) that
 * aren't editable in the admin panel today. Static seed catalogs have been
 * removed — see `lib/loadProduct.ts` for the runtime loader.
 */
export type Product = Service & {
  images: string[];
  badge?: string;
  rating?: { value: number; reviewsText: string };
  /** Plans from MongoDB (filtered to enabled-only). */
  plans: ApiPlan[];
  durations: ProductDuration[];
  features: string[];
  whatYouGet: string[];
  worksOn: Array<"Windows" | "macOS" | "Android" | "iOS" | "Web">;
  faqs: ProductFaq[];
};
