/** E.164 without + — used in https://wa.me/<digits> */
export const WHATSAPP_NUMBER = "923198045972";

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Canonical site origin for links shared in WhatsApp messages (no trailing slash). */
export const SITE_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")) ||
  "https://softsinc.com";

/** Build a wa.me URL that opens WhatsApp with a prefilled message. */
export function buildWhatsAppPrefillUrl(message: string): string {
  const q = encodeURIComponent(message.trim() || "Hi!");
  return `${WHATSAPP_LINK}?text=${q}`;
}

export const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
