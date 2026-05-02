/**
 * Plain JSON-friendly types for products fetched from the API.
 * (Mongoose ObjectId / Date come back as strings after JSON serialization.)
 */
export const PLAN_HEADING_TONES = [
  "primary",
  "accent",
  "emerald",
  "amber",
] as const;
export type PlanHeadingTone = (typeof PLAN_HEADING_TONES)[number];

export type PlanCustomHeading = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  tone?: PlanHeadingTone;
};

export type ApiPlan = {
  _id?: string;
  name: string;
  duration: string;
  offerPrice: number;
  originalPrice?: number;
  originalPriceNote?: string;
  priceSuffix: string;
  popular?: boolean;
  disabled?: boolean;

  /** Optional bold lead line, e.g. "12 Months Sales Navigator Core". */
  headline?: string;
  /** Bullet list — billing type, warranty, activation method, etc. */
  keyHighlights?: string[];
  /** Bullet list of features included with this specific plan. */
  benefits?: string[];
  /** Eligibility/account requirements for activation. */
  requirements?: string[];
  /** Step-by-step activation flow shown to customers. */
  activationSteps?: string[];
  /** Optional standout banner shown above the plan details panel. */
  customHeading?: PlanCustomHeading;
  /**
   * Optional free-form HTML content (sanitized server-side). Lets admins
   * paste rich text from Word/Docs with bold, headings, lists, links, etc.
   */
  customContent?: string;
};

export type ApiProduct = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category:
    | "AI"
    | "Business"
    | "Learning"
    | "Productivity"
    | "Creative"
    | "Security";
  logoUrl?: string;
  images?: string[];
  iconLabel?: string;
  popular?: boolean;
  disabled?: boolean;
  benefits: string[];
  originalPrice?: number;
  offerPrice: number;
  priceSuffix: string;
  discountPercent?: number;
  plans: ApiPlan[];
  /** Catalog sort position — lower appears first. */
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const PRODUCT_CATEGORIES: ApiProduct["category"][] = [
  "AI",
  "Business",
  "Learning",
  "Productivity",
  "Creative",
  "Security",
];
