"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ctaLabels, ctaLabelsEn, siteConfig } from "@/lib/site-config";
import { useLocale } from "@/lib/use-locale";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const locale = useLocale();
  const isEnglish = locale === "en";
  const homeHref = isEnglish ? "/en" : "/";
  const contactHref = isEnglish ? "/en/contact" : "/kontakt";
  const cta = isEnglish ? ctaLabelsEn : ctaLabels;

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-3">
        <Link
          href={homeHref}
          className="text-lg font-semibold tracking-tight text-primary-900"
        >
          {siteConfig.name}
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button href={contactHref} size="sm" className="hidden lg:inline-flex">
            {cta.primary}
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
