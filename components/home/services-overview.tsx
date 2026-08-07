import Link from "next/link";
import type { Route } from "next";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const services: Array<{ title: string; description: string; href: Route }> = [
  {
    title: "Webentwicklung",
    description: "Moderne, schnelle und conversion-starke Websites.",
    href: "/loesungen/webentwicklung",
  },
  {
    title: "SEO",
    description: "Bessere Sichtbarkeit bei Google und Google Maps.",
    href: "/loesungen/seo",
  },
  {
    title: "Google Unternehmensprofil",
    description: "Professionelle Optimierung für mehr lokale Anfragen.",
    href: "/loesungen/google-unternehmensprofil",
  },
  {
    title: "Content Creation",
    description: "Texte und Inhalte, die überzeugen und ranken.",
    href: "/loesungen/content-creation",
  },
  {
    title: "KI-Agenten",
    description: "Automatisierter Kundenservice und Terminbuchung.",
    href: "/ki-agenten",
  },
  {
    title: "Werbeanzeigen",
    description: "Google, Meta und TikTok Ads mit messbaren Ergebnissen.",
    href: "/werbeanzeigen",
  },
  {
    title: "E-Commerce",
    description: "Shopify, WooCommerce und Marktplatz-Optimierung.",
    href: "/e-commerce",
  },
  {
    title: "DigitalWerk Komplett",
    description: "Alle Leistungen kombiniert – unsere Empfehlung.",
    href: "/loesungen/digitalwerk-komplett",
  },
];

export function ServicesOverview() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Leistungen im Überblick</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Jede Leistung ist auch einzeln buchbar – kombiniert entfalten sie
            ihre volle Wirkung.
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link key={service.href} href={service.href} className="group">
              <Card hoverable className="h-full">
                <Heading level={4} className="group-hover:text-primary-600">
                  {service.title}
                </Heading>
                <p className="mt-3 text-sm text-slate-600">
                  {service.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
