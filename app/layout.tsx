import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { PageLoad } from "@/components/PageLoad";
import { getSiteSettings } from "@/lib/loadSiteSettings";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: {
    default: "Softsinc — Premium Digital Tools",
    template: "%s — Softsinc",
  },
  description:
    "Premium digital subscriptions and tools at affordable prices. Trusted access with reliable support and warranty.",
  metadataBase: new URL("https://softsinc.com"),
  openGraph: {
    title: "Softsinc — Premium Digital Tools",
    description:
      "Premium digital subscriptions and tools at affordable prices. Trusted access with reliable support and warranty.",
    url: "https://softsinc.com",
    siteName: "Softsinc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Softsinc — Premium Digital Tools",
    description:
      "Premium digital subscriptions and tools at affordable prices. Trusted access with reliable support and warranty.",
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

const SITE_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://softsinc.com/#website",
      url: "https://softsinc.com",
      name: "Softsinc",
      description:
        "Premium digital subscriptions and tools at affordable prices. Trusted access with reliable support and warranty.",
      publisher: { "@id": "https://softsinc.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://softsinc.com/#organization",
      name: "Softsinc",
      url: "https://softsinc.com",
    },
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { siteLogoUrl } = await getSiteSettings();
  const logo = siteLogoUrl || undefined;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-ss-bg text-ss-text">
        <Script
          id="softsinc-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
        />
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: SITE_JSON_LD }}
          />
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
