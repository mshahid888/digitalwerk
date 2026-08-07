import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ctaLabels, siteConfig } from "@/lib/site-config";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-primary-900"
        >
          {siteConfig.name}
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-2">
          <Button href="/kontakt" size="sm" className="hidden lg:inline-flex">
            {ctaLabels.primary}
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
