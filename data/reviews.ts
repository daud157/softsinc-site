export type ReviewItem = {
  id: string;
  image: string;
  service?: string;
  customerName?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date?: string;
  featured?: boolean;
  createdAt?: string;
};

/**
 * API shape returned by /api/reviews (after JSON serialization).
 * Mongo ObjectId comes back as a string; Date comes back as an ISO string.
 */
export type ApiReview = {
  _id: string;
  image: string;
  service: string;
  customerName?: string;
  rating: number;
  featured: boolean;
  createdAt: string;
};

export function apiReviewToItem(r: ApiReview): ReviewItem {
  const rating = Math.max(1, Math.min(5, Math.round(r.rating ?? 5))) as
    | 1
    | 2
    | 3
    | 4
    | 5;
  return {
    id: r._id,
    image: r.image,
    service: r.service,
    customerName: r.customerName || undefined,
    rating,
    featured: Boolean(r.featured),
    createdAt: r.createdAt,
  };
}

/**
 * Fallback used when the database is empty or unreachable.
 * Reviews added through the admin panel become the live source of truth.
 *
 * We intentionally keep this empty so the public site never displays
 * broken/placeholder image URLs. The UI shows a friendly empty state
 * when this list is empty.
 */
export const REVIEWS: ReviewItem[] = [];
