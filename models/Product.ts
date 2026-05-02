import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CATEGORIES = [
  "AI",
  "Business",
  "Learning",
  "Productivity",
  "Creative",
  "Security",
] as const;

const HEADING_TONES = ["primary", "accent", "emerald", "amber"] as const;

const CustomHeadingSchema = new Schema(
  {
    eyebrow: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    subtitle: { type: String, default: "", trim: true },
    tone: {
      type: String,
      enum: HEADING_TONES,
      default: "primary",
    },
  },
  { _id: false, versionKey: false }
);

const PlanSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    duration: { type: String, default: "", trim: true },
    offerPrice: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    originalPriceNote: { type: String, default: "", trim: true },
    priceSuffix: { type: String, default: "/month", trim: true },
    popular: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },

    // Rich marketing detail (each is a list of bullet strings).
    headline: { type: String, default: "", trim: true },
    keyHighlights: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    activationSteps: { type: [String], default: [] },

    // Optional free-form rich content (sanitized HTML) shown as a single
    // styled block. Lets admins paste content from Word/Docs with formatting.
    customContent: { type: String, default: "" },

    // Optional banner shown prominently above the plan details panel.
    customHeading: { type: CustomHeadingSchema, default: undefined },
  },
  { _id: true, versionKey: false }
);

export const PLAN_HEADING_TONES = HEADING_TONES;
export type PlanHeadingTone = (typeof HEADING_TONES)[number];

const ProductSchema = new Schema(
  {
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, and dashes"],
    },
    title: { type: String, required: [true, "title is required"], trim: true },
    description: { type: String, trim: true, default: "" },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Productivity",
    },
    logoUrl: { type: String, trim: true, default: "" },
    images: { type: [String], default: [] },
    iconLabel: { type: String, trim: true, default: "" },
    popular: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false, index: true },
    benefits: { type: [String], default: [] },

    // Top-level catalog pricing (used on the services card).
    originalPrice: { type: Number, min: 0 },
    offerPrice: { type: Number, required: true, min: 0 },
    priceSuffix: { type: String, default: "/month", trim: true },
    discountPercent: { type: Number, min: 0, max: 100 },

    plans: { type: [PlanSchema], default: [] },

    /** Lower values appear first on the public catalog and admin list. */
    sortOrder: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true }
);

ProductSchema.index({ sortOrder: 1, createdAt: -1 });

export type ProductDoc = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

// In dev, Next.js hot-reloads modules but Mongoose keeps the previously-
// registered model in `mongoose.models`, which can leave stale schema hooks
// or fields attached. Wipe it on each reload so the latest schema wins.
if (process.env.NODE_ENV !== "production" && mongoose.models.Product) {
  delete mongoose.models.Product;
  delete (mongoose as unknown as { modelSchemas?: Record<string, unknown> })
    .modelSchemas?.Product;
}

export const ProductModel: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc> | undefined) ??
  mongoose.model<ProductDoc>("Product", ProductSchema);

export const PRODUCT_CATEGORIES = CATEGORIES;
export type ProductCategory = (typeof CATEGORIES)[number];
