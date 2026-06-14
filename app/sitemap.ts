import type { MetadataRoute } from "next";

import { loadAllProductSlugs } from "@/lib/loadProduct";
import { SEO_ROUTES, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = SEO_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const slugs = await loadAllProductSlugs();
  const productRoutes = slugs.map((slug) => ({
    url: absoluteUrl(`/product/${encodeURIComponent(slug)}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));

  return [...staticRoutes, ...productRoutes];
}
