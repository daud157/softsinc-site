import "server-only";

import { REVIEWS, apiReviewToItem, type ReviewItem } from "@/data/reviews";

/**
 * Server-side helper that loads reviews directly from MongoDB.
 *
 * - Uses our cached mongoose connection.
 * - Falls back to seed reviews when the DB is empty or unreachable so the
 *   public site never breaks if env/credentials are missing.
 */
export async function loadReviews(): Promise<ReviewItem[]> {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Review } = await import("@/models/Review");

    await connectDB();
    const docs = await Review.find({}).sort({ createdAt: -1 }).lean();

    if (!docs || docs.length === 0) return REVIEWS;

    return docs.map((d) =>
      apiReviewToItem({
        _id: String(d._id),
        image: d.image,
        service: d.service,
        customerName: d.customerName,
        rating: d.rating,
        featured: d.featured,
        createdAt:
          d.createdAt instanceof Date
            ? d.createdAt.toISOString()
            : String(d.createdAt ?? ""),
      })
    );
  } catch (err) {
    console.error(
      "[loadReviews] Failed to load reviews from MongoDB. Falling back to empty list.",
      err
    );
    return REVIEWS;
  }
}
