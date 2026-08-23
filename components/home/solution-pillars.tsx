import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const pillars = [
  {
    title: "Sichtbarkeit & Website",
    description:
      "Moderne Website, lokales SEO, Google Unternehmensprofil und Content – damit man Sie findet und Ihnen vertraut.",
    href: "/loesungen",
  },
  {
    title: "KI-Automatisierung",
    description:
      "KI-Agenten übernehmen Kundenservice, Terminbuchung und wiederkehrende Anfragen – automatisch und rund um die Uhr.",
    href: "/ki-agenten",
  },
  {
    title: "Werbung & Wachstum",
    description:
      "Google, Meta und TikTok Ads, die messbare Anfragen und Umsatz bringen – kein Streuverlust.",
    href: "/werbeanzeigen",
  },
  {
    title: "E-Commerce",
    description:
      "Shopify, WooCommerce und Marktplatz-Integration für Unternehmen, die online verkaufen.",
    href: "/e-commerce",
  },
] as const;

export function SolutionPillars() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Ein Partner für Ihr digitales Wachstum</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Statt fünf Anbieter zu koordinieren, erhalten Sie alles aus einer
            Hand – abgestimmt auf Ihre Ziele.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <Link key={pillar.href} href={pillar.href} className="group">
              <Card hoverable className="flex h-full flex-col">
                <Heading level={3} size={4} className="group-hover:text-primary-600">
                  {pillar.title}
                </Heading>
                <p className="mt-3 flex-1 text-sm text-slate-600">
                  {pillar.description}
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
