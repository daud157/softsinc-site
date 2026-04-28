/**
 * Public Service type used by catalog cards.
 *
 * Data is sourced exclusively from MongoDB via `lib/loadServices.ts`.
 * The legacy in-file seed catalog has been removed in favor of admin-managed
 * products (see `/admin/products`).
 */
export type Service = {
  slug: string;
  title: string;
  description: string;
  benefits: string[];
  iconLabel: string;
  logoUrl?: string;
  whatsappLink: string;
  category: "AI" | "Business" | "Learning" | "Productivity" | "Creative" | "Security";
  popular?: boolean;
  /**
   * Pricing is data-driven (never hardcode in JSX).
   * If `originalPrice` is omitted, UI hides the struck-through price and may not show a discount.
   */
  originalPrice?: number;
  offerPrice: number;
  /**
   * Optional explicit discount (percentage). If omitted, UI auto-calculates when possible.
   */
  discountPercent?: number;
  /**
   * Display suffix like "/month", "/year", etc.
   */
  priceSuffix?: string;
};
