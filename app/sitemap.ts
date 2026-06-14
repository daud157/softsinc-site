import type { MetadataRoute } from "next";

import { loadAllProductSlugs } from "@/lib/loadProduct";
import { SEO_ROUTES, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Cap how long we wait for the product slugs. The DB connection can hang on a
 * cold serverless start (slow DNS / TXT lookup) long enough to exceed the
 * function timeout, which would make /sitemap.xml return 500. A short race
 * guarantees the sitemap always responds with at least the static routes so
 * Google can keep crawling and trust the site structure.
 */
async function safeLoadProductSlugs(timeoutMs = 4000): Promise<string[]> {
  try {
    const slugs = await Promise.race([
      loadAllProductSlugs(),
      new Promise<string[]>((resolve) =>
        setTimeout(() => resolve([]), timeoutMs)
      ),
    ]);
    return Array.isArray(slugs) ? slugs : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = SEO_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const slugs = await safeLoadProductSlugs();
  const productRoutes = slugs.map((slug) => ({
    url: absoluteUrl(`/product/${encodeURIComponent(slug)}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));

  return [...staticRoutes, ...productRoutes];
}
