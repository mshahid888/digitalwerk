import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

const services: Array<{
  title: string;
  description: string;
  suitableWhen: string;
  href: Route;
}> = [
  {
    title: "Webentwicklung",
    description:
      "Moderne, schnelle und conversion-starke Websites, die Besucher in Kunden verwandeln.",
    suitableWhen:
      "Ihre aktuelle Website veraltet ist, langsam lädt oder auf dem Smartphone schlecht funktioniert.",
    href: "/loesungen/webentwicklung",
  },
  {
    title: "SEO",
    description:
      "Lokales SEO, das Sie bei Google und Google Maps sichtbarer macht – mehr Anrufe, mehr Besuche.",
    suitableWhen:
      "Ihre Website zwar existiert, bei Google aber kaum gefunden wird.",
    href: "/loesungen/seo",
  },
  {
    title: "Google Unternehmensprofil",
    description:
      "Professionelle Optimierung Ihres Google-Profils für bessere Rankings und mehr Bewertungen.",
    suitableWhen:
      "Ihr Google-Profil unvollständig ist oder noch gar nicht eingerichtet wurde.",
    href: "/loesungen/google-unternehmensprofil",
  },
  {
    title: "Content Creation",
    description:
      "Professionelle Website- und SEO-Inhalte, die überzeugen und ranken.",
    suitableWhen:
      "Ihre Website technisch gut ist, die Texte aber nicht überzeugen oder ganz fehlen.",
    href: "/loesungen/content-creation",
  },
];

export function ServiceList() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Einzelne Leistungen im Detail</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Sie benötigen nicht die Komplettlösung? Jede Leistung ist auch
            einzeln buchbar.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          {services.map((service) => (
            <Card key={service.href} className="md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <Heading level={3}>{service.title}</Heading>
                  <p className="mt-2 text-slate-600">{service.description}</p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Badge tone="accent">Geeignet, wenn</Badge>
                    <p className="text-sm text-slate-600">
                      {service.suitableWhen}
                    </p>
                  </div>
                </div>

                <Link
                  href={service.href}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
