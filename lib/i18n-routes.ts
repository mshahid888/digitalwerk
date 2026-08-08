import type { Route } from "next";

export type Locale = "de" | "en";

// Single source of truth pairing every German route with its English
// equivalent. Drives the language switcher and hreflang alternates — add a
// new page in both languages here so both features pick it up automatically.
type RoutePair = { de: Route; en: Route };

export const routePairs: RoutePair[] = [
  { de: "/", en: "/en" },
  { de: "/loesungen", en: "/en/solutions" },
  { de: "/loesungen/digitalwerk-komplett", en: "/en/solutions/complete" },
  { de: "/loesungen/seo", en: "/en/solutions/seo" },
  { de: "/loesungen/webentwicklung", en: "/en/solutions/web-development" },
  {
    de: "/loesungen/google-unternehmensprofil",
    en: "/en/solutions/google-business-profile",
  },
  { de: "/loesungen/content-creation", en: "/en/solutions/content-creation" },
  { de: "/ki-agenten", en: "/en/ai-agents" },
  { de: "/werbeanzeigen", en: "/en/advertising" },
  { de: "/werbeanzeigen/meta-ads", en: "/en/advertising/meta-ads" },
  { de: "/werbeanzeigen/google-ads", en: "/en/advertising/google-ads" },
  { de: "/werbeanzeigen/tiktok-ads", en: "/en/advertising/tiktok-ads" },
  { de: "/e-commerce", en: "/en/e-commerce" },
  { de: "/branchen", en: "/en/industries" },
  { de: "/ueber-uns", en: "/en/about" },
  { de: "/referenzen", en: "/en/references" },
  { de: "/kontakt", en: "/en/contact" },
  { de: "/impressum", en: "/en/imprint" },
  { de: "/datenschutz", en: "/en/privacy-policy" },
  { de: "/cookie-richtlinie", en: "/en/cookie-policy" },
];

const FALLBACK: RoutePair = { de: "/", en: "/en" };

// Given any known pathname (German or English), returns the pair it
// belongs to. Falls back to the two homepages for unrecognized paths.
export function getRoutePair(pathname: string): RoutePair {
  return (
    routePairs.find((pair) => pair.de === pathname || pair.en === pathname) ??
    FALLBACK
  );
}

export function isEnglishPath(pathname: string): boolean {
  return pathname === "/en" || pathname.startsWith("/en/");
}
