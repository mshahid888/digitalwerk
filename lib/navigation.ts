import type { Route } from "next";

export type NavLink = {
  label: string;
  href: Route;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const primaryNav: NavItem[] = [
  { label: "Startseite", href: "/" },
  { label: "Über uns", href: "/ueber-uns" },
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
];
