import type { Route } from "next";

export type NavLink = {
  label: string;
  href: Route;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Lösungen",
    href: "/loesungen",
    children: [
      { label: "DigitalWerk Komplett", href: "/loesungen/digitalwerk-komplett" },
      { label: "SEO", href: "/loesungen/seo" },
      { label: "Webentwicklung", href: "/loesungen/webentwicklung" },
      { label: "Google Unternehmensprofil", href: "/loesungen/google-unternehmensprofil" },
      { label: "Content Creation", href: "/loesungen/content-creation" },
    ],
  },
  { label: "KI-Agenten", href: "/ki-agenten" },
  {
    label: "Werbeanzeigen",
    href: "/werbeanzeigen",
    children: [
      { label: "Google Ads", href: "/werbeanzeigen/google-ads" },
      { label: "Meta Ads", href: "/werbeanzeigen/meta-ads" },
      { label: "TikTok Ads", href: "/werbeanzeigen/tiktok-ads" },
    ],
  },
  { label: "E-Commerce", href: "/e-commerce" },
  { label: "Branchen", href: "/branchen" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Referenzen", href: "/referenzen" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerServiceLinks: NavLink[] = [
  { label: "DigitalWerk Komplett", href: "/loesungen/digitalwerk-komplett" },
  { label: "SEO", href: "/loesungen/seo" },
  { label: "Webentwicklung", href: "/loesungen/webentwicklung" },
  { label: "Google Unternehmensprofil", href: "/loesungen/google-unternehmensprofil" },
  { label: "Content Creation", href: "/loesungen/content-creation" },
  { label: "KI-Agenten", href: "/ki-agenten" },
  { label: "KI-Agenten erstellen", href: "/ki-agenten/erstellen" },
  { label: "KI-Agenten für E-Commerce", href: "/ki-agenten/e-commerce" },
  { label: "Werbeanzeigen", href: "/werbeanzeigen" },
  { label: "E-Commerce", href: "/e-commerce" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Referenzen", href: "/referenzen" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" },
];

// English navigation — same order and dropdown structure as primaryNav.
export const primaryNavEn: NavItem[] = [
  { label: "Home", href: "/en" },
  {
    label: "Solutions",
    href: "/en/solutions",
    children: [
      { label: "DigitalWerk Complete", href: "/en/solutions/complete" },
      { label: "SEO", href: "/en/solutions/seo" },
      { label: "Web Development", href: "/en/solutions/web-development" },
      {
        label: "Google Business Profile",
        href: "/en/solutions/google-business-profile",
      },
      { label: "Content Creation", href: "/en/solutions/content-creation" },
    ],
  },
  { label: "AI Agents", href: "/en/ai-agents" },
  {
    label: "Advertising",
    href: "/en/advertising",
    children: [
      { label: "Google Ads", href: "/en/advertising/google-ads" },
      { label: "Meta Ads", href: "/en/advertising/meta-ads" },
      { label: "TikTok Ads", href: "/en/advertising/tiktok-ads" },
    ],
  },
  { label: "E-Commerce", href: "/en/e-commerce" },
  { label: "Industries", href: "/en/industries" },
  { label: "About", href: "/en/about" },
  { label: "References", href: "/en/references" },
  { label: "Contact", href: "/en/contact" },
];

export const footerServiceLinksEn: NavLink[] = [
  { label: "DigitalWerk Complete", href: "/en/solutions/complete" },
  { label: "SEO", href: "/en/solutions/seo" },
  { label: "Web Development", href: "/en/solutions/web-development" },
  {
    label: "Google Business Profile",
    href: "/en/solutions/google-business-profile",
  },
  { label: "Content Creation", href: "/en/solutions/content-creation" },
  { label: "AI Agents", href: "/en/ai-agents" },
  { label: "Advertising", href: "/en/advertising" },
  { label: "E-Commerce", href: "/en/e-commerce" },
];

export const footerQuickLinksEn: NavLink[] = [
  { label: "About", href: "/en/about" },
  { label: "References", href: "/en/references" },
  { label: "Contact", href: "/en/contact" },
];

export const footerLegalLinksEn: NavLink[] = [
  { label: "Imprint", href: "/en/imprint" },
  { label: "Privacy Policy", href: "/en/privacy-policy" },
  { label: "Cookie Policy", href: "/en/cookie-policy" },
];
