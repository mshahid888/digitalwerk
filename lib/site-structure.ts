import type { Route } from "next";

export type BreadcrumbItem = {
  href: Route;
  label: string;
};

const deHome: BreadcrumbItem = { href: "/", label: "Startseite" };
const enHome: BreadcrumbItem = { href: "/en", label: "Home" };

// Only indexable, public pages appear here. The same configuration drives the
// visible navigation trail and its matching BreadcrumbList JSON-LD, so neither
// can drift from the other as routes are added.
const breadcrumbsByPath: Record<string, BreadcrumbItem[]> = {
  "/ueber-uns": [deHome, { href: "/ueber-uns", label: "Über uns" }],
  "/loesungen": [deHome, { href: "/loesungen", label: "Lösungen" }],
  "/loesungen/digitalwerk-komplett": [
    deHome,
    { href: "/loesungen", label: "Lösungen" },
    {
      href: "/loesungen/digitalwerk-komplett",
      label: "DigitalWerk Komplett",
    },
  ],
  "/loesungen/seo": [
    deHome,
    { href: "/loesungen", label: "Lösungen" },
    { href: "/loesungen/seo", label: "SEO" },
  ],
  "/loesungen/webentwicklung": [
    deHome,
    { href: "/loesungen", label: "Lösungen" },
    { href: "/loesungen/webentwicklung", label: "Webentwicklung" },
  ],
  "/loesungen/google-unternehmensprofil": [
    deHome,
    { href: "/loesungen", label: "Lösungen" },
    {
      href: "/loesungen/google-unternehmensprofil",
      label: "Google Unternehmensprofil",
    },
  ],
  "/loesungen/content-creation": [
    deHome,
    { href: "/loesungen", label: "Lösungen" },
    { href: "/loesungen/content-creation", label: "Content Creation" },
  ],
  "/ki-agenten": [deHome, { href: "/ki-agenten", label: "KI-Agenten" }],
  "/ki-agenten/erstellen": [
    deHome,
    { href: "/ki-agenten", label: "KI-Agenten" },
    { href: "/ki-agenten/erstellen", label: "KI-Agenten erstellen" },
  ],
  "/ki-agenten/e-commerce": [
    deHome,
    { href: "/ki-agenten", label: "KI-Agenten" },
    { href: "/ki-agenten/e-commerce", label: "KI-Agenten für E-Commerce" },
  ],
  "/werbeanzeigen": [
    deHome,
    { href: "/werbeanzeigen", label: "Werbeanzeigen" },
  ],
  "/werbeanzeigen/google-ads": [
    deHome,
    { href: "/werbeanzeigen", label: "Werbeanzeigen" },
    { href: "/werbeanzeigen/google-ads", label: "Google Ads" },
  ],
  "/werbeanzeigen/meta-ads": [
    deHome,
    { href: "/werbeanzeigen", label: "Werbeanzeigen" },
    { href: "/werbeanzeigen/meta-ads", label: "Meta Ads" },
  ],
  "/werbeanzeigen/tiktok-ads": [
    deHome,
    { href: "/werbeanzeigen", label: "Werbeanzeigen" },
    { href: "/werbeanzeigen/tiktok-ads", label: "TikTok Ads" },
  ],
  "/e-commerce": [deHome, { href: "/e-commerce", label: "E-Commerce" }],
  "/branchen": [deHome, { href: "/branchen", label: "Branchen" }],
  "/referenzen": [deHome, { href: "/referenzen", label: "Referenzen" }],
  "/kontakt": [deHome, { href: "/kontakt", label: "Kontakt" }],
  "/en/about": [enHome, { href: "/en/about", label: "About" }],
  "/en/solutions": [enHome, { href: "/en/solutions", label: "Solutions" }],
  "/en/solutions/complete": [
    enHome,
    { href: "/en/solutions", label: "Solutions" },
    { href: "/en/solutions/complete", label: "DigitalWerk Complete" },
  ],
  "/en/solutions/seo": [
    enHome,
    { href: "/en/solutions", label: "Solutions" },
    { href: "/en/solutions/seo", label: "SEO" },
  ],
  "/en/solutions/web-development": [
    enHome,
    { href: "/en/solutions", label: "Solutions" },
    {
      href: "/en/solutions/web-development",
      label: "Web Development",
    },
  ],
  "/en/solutions/google-business-profile": [
    enHome,
    { href: "/en/solutions", label: "Solutions" },
    {
      href: "/en/solutions/google-business-profile",
      label: "Google Business Profile",
    },
  ],
  "/en/solutions/content-creation": [
    enHome,
    { href: "/en/solutions", label: "Solutions" },
    { href: "/en/solutions/content-creation", label: "Content Creation" },
  ],
  "/en/ai-agents": [enHome, { href: "/en/ai-agents", label: "AI Agents" }],
  "/en/advertising": [
    enHome,
    { href: "/en/advertising", label: "Advertising" },
  ],
  "/en/advertising/google-ads": [
    enHome,
    { href: "/en/advertising", label: "Advertising" },
    { href: "/en/advertising/google-ads", label: "Google Ads" },
  ],
  "/en/advertising/meta-ads": [
    enHome,
    { href: "/en/advertising", label: "Advertising" },
    { href: "/en/advertising/meta-ads", label: "Meta Ads" },
  ],
  "/en/advertising/tiktok-ads": [
    enHome,
    { href: "/en/advertising", label: "Advertising" },
    { href: "/en/advertising/tiktok-ads", label: "TikTok Ads" },
  ],
  "/en/e-commerce": [enHome, { href: "/en/e-commerce", label: "E-Commerce" }],
  "/en/industries": [enHome, { href: "/en/industries", label: "Industries" }],
  "/en/references": [enHome, { href: "/en/references", label: "References" }],
  "/en/contact": [enHome, { href: "/en/contact", label: "Contact" }],
};

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  return breadcrumbsByPath[pathname] ?? null;
}
