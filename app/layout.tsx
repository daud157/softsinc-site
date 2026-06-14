import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { PageLoad } from "@/components/PageLoad";
import { getSiteSettings } from "@/lib/loadSiteSettings";
import { AppProviders } from "@/components/providers/AppProviders";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  buildRootJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Softsinc | Premium Digital Tools and Subscriptions",
    template: "%s — Softsinc",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Softsinc | Premium Digital Tools and Subscriptions",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Softsinc | Premium Digital Tools and Subscriptions",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const THEME_INIT = `
(function(){
  try {
    var k='softsinc-theme';
    var t=localStorage.getItem(k);
    if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches))
      document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { siteLogoUrl } = await getSiteSettings();
  const logo = siteLogoUrl || undefined;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Inline in <head> so theme runs before paint; avoids React client warnings for <script> in <body>. */}
        <script
          id="softsinc-theme-init"
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
          suppressHydrationWarning
        />
        <JsonLd id="softsinc-root-jsonld" data={buildRootJsonLd(logo)} />
      </head>
      <body className="min-h-full flex flex-col bg-ss-bg text-ss-text">
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Navbar siteLogoUrl={logo} />
          <AnnouncementBar />
          <main id="main-content" className="flex-1 scroll-mt-16 pb-24 sm:pb-0">
            <PageLoad>{children}</PageLoad>
          </main>
          <Footer siteLogoUrl={logo} />
          <BackToTop />
          <FloatingWhatsApp />
        </AppProviders>
      </body>
    </html>
  );
}
