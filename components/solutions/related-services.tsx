import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const related: Array<{ title: string; description: string; href: Route }> = [
  {
    title: "KI-Agenten",
    description: "Automatisierter Kundenservice, Terminbuchung und mehr.",
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
];

export function RelatedServices() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-10">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Suchen Sie etwas anderes?</Heading>
          <p className="mt-4 text-lg text-slate-600">
            KI-Automatisierung, Werbeanzeigen und E-Commerce finden Sie als
            eigene Leistungsbereiche.
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-3">
          {related.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card hoverable className="flex h-full flex-col">
                <Heading level={4} className="group-hover:text-primary-600">
                  {item.title}
                </Heading>
                <p className="mt-3 flex-1 text-sm text-slate-600">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
