"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig, siteConfigEn } from "@/lib/site-config";
import {
  footerLegalLinks,
  footerLegalLinksEn,
  footerQuickLinks,
  footerQuickLinksEn,
  footerServiceLinks,
  footerServiceLinksEn,
} from "@/lib/navigation";
import { useLocale } from "@/lib/use-locale";
import { ActiveLink } from "./active-link";

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "WhatsApp", href: siteConfig.social.whatsapp },
];

const STRINGS = {
  de: {
    tagline: siteConfig.tagline,
    services: "Leistungen",
    company: "Unternehmen",
    contact: "Kontakt",
    rights: "Alle Rechte vorbehalten.",
  },
  en: {
    tagline: siteConfigEn.tagline,
    services: "Services",
    company: "Company",
    contact: "Contact",
    rights: "All rights reserved.",
  },
};

export function Footer() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const serviceLinks = locale === "en" ? footerServiceLinksEn : footerServiceLinks;
  const quickLinks = locale === "en" ? footerQuickLinksEn : footerQuickLinks;
  const legalLinks = locale === "en" ? footerLegalLinksEn : footerLegalLinks;

  return (
    <footer className="border-t border-primary-100 bg-primary-950 text-primary-100">
      <Container className="grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <span className="text-lg font-semibold text-white">
            {siteConfig.name}
          </span>
          <p className="mt-4 text-sm text-primary-200">{t.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t.services}
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <ActiveLink
                  href={link.href}
                  className="text-sm text-primary-200 hover:text-white"
                >
                  {link.label}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t.company}
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <ActiveLink
                  href={link.href}
                  className="text-sm text-primary-200 hover:text-white"
                >
                  {link.label}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t.contact}
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-primary-200">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="hover:text-white"
              >
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-white"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.address}</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-200 hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-primary-900">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-primary-300 md:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. {t.rights}
          </span>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <ActiveLink
                key={link.href}
                href={link.href}
                className="hover:text-white"
              >
                {link.label}
              </ActiveLink>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
