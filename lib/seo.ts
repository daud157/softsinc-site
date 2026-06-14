import type { Metadata } from "next";

import type { Service } from "@/lib/services";
import { SITE_URL, SOCIAL_URLS, WHATSAPP_NUMBER } from "@/lib/site";

export const SITE_NAME = "Softsinc";

/**
 * Primary market used in titles/descriptions for local search intent.
 * Footer and pricing (PKR default) confirm Pakistan as the primary audience.
 */
export const SITE_REGION = "Pakistan";

export const SITE_DESCRIPTION =
  "Softsinc offers premium digital subscriptions and tools in Pakistan at affordable prices — AI, design, productivity, learning, business and security tools with instant activation, warranty and WhatsApp support.";

export type SeoRoute = {
  path: string;
  label: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
};

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: "/",
    label: "Home",
    title: "Buy Premium Digital Subscriptions in Pakistan | Softsinc",
    description:
      "Buy premium digital subscriptions in Pakistan at affordable prices — AI, design, productivity, learning, business and security tools with instant activation, warranty and WhatsApp support.",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/services",
    label: "Services",
    title: "Premium Subscription Services in Pakistan | Softsinc",
    description:
      "Browse Softsinc premium subscription services in Pakistan — AI, design, productivity, learning, business and security tools with clear plans, affordable pricing and WhatsApp support.",
    priority: 0.95,
    changeFrequency: "weekly",
  },
  {
    path: "/reviews",
    label: "Reviews",
    title: "Softsinc Customer Reviews | Subscriptions in Pakistan",
    description:
      "Read real Softsinc customer reviews from Pakistan on premium subscription delivery, pricing, activation and support before you buy.",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    label: "About",
    title: "About Softsinc | Premium Subscriptions in Pakistan",
    description:
      "Softsinc delivers trusted premium digital subscriptions in Pakistan with affordable pricing, guided activation, warranty and fast WhatsApp support.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact Softsinc | Buy Subscriptions in Pakistan",
    description:
      "Contact Softsinc to buy premium digital subscriptions in Pakistan — get plan availability, pricing, recommendations and setup help fast on WhatsApp.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
];

export const SITELINK_TARGETS = SEO_ROUTES.filter((route) => route.path !== "/");

export function routeByPath(path: string): SeoRoute {
  return SEO_ROUTES.find((route) => route.path === path) ?? SEO_ROUTES[0];
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

export function breadcrumbItemsForRoute(route: SeoRoute): BreadcrumbItem[] {
  if (route.path === "/") return [{ name: "Home", href: "/" }];
  return [
    { name: "Home", href: "/" },
    { name: route.label, href: route.path },
  ];
}

export function publicPageMetadata(path: string): Metadata {
  const route = routeByPath(path);
  const canonical = absoluteUrl(route.path);

  return {
    title: { absolute: route.title },
    description: route.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: route.title,
      description: route.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
    },
  };
}

export function buildOrganizationSchema(logoUrl?: string) {
  const sameAs = [SOCIAL_URLS.facebook, SOCIAL_URLS.instagram].filter(Boolean);

  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: logoUrl ? absoluteUrl(logoUrl) : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${WHATSAPP_NUMBER}`,
      contactType: "customer support",
      availableLanguage: ["en", "ur"],
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildWebPageSchema({
  path,
  title,
  description,
  breadcrumbs,
}: {
  path: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  const url = absoluteUrl(path);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    breadcrumb: buildBreadcrumbSchema(breadcrumbs),
    inLanguage: "en",
  };
}

export function buildPageJsonLd(route: SeoRoute) {
  const breadcrumbs = breadcrumbItemsForRoute(route);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageSchema({
        path: route.path,
        title: route.title,
        description: route.description,
        breadcrumbs,
      }),
    ],
  };
}

export function buildRootJsonLd(logoUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationSchema(logoUrl), buildWebsiteSchema()],
  };
}

/**
 * ItemList of catalog products. Helps Google understand the catalog as a set of
 * related entities and reinforces internal links to each product URL.
 */
export function buildServiceListJsonLd({
  services,
  path,
  name,
}: {
  services: Pick<Service, "slug" | "title">[];
  path: string;
  name: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${absoluteUrl(path)}#catalog`,
        name,
        numberOfItems: services.length,
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.title,
          url: absoluteUrl(`/product/${encodeURIComponent(service.slug)}`),
        })),
      },
    ],
  };
}
