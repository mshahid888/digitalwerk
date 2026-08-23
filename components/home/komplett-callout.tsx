import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ctaLabels } from "@/lib/site-config";

const included = [
  "Website Development",
  "Local SEO",
  "Google Unternehmensprofil",
  "Content Creation",
  "KI-Agenten für Ihr Unternehmen",
  "Analytics & Reporting",
  "Monatliche Optimierung",
  "Laufender Support",
];

export function KomplettCallout() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-12 rounded-card bg-primary-950 p-8 text-white md:grid-cols-2 md:p-16">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-accent-300">
              Unsere Empfehlung
            </span>
            <Heading level={2} className="mt-4 text-white">
              DigitalWerk Komplett – Ihre digitale Abteilung aus einer Hand
            </Heading>
            <p className="mt-4 text-primary-100">
              Für die meisten Unternehmen ist DigitalWerk Komplett die
              sinnvollste Lösung: eine Partnerschaft statt einzelner
              Projekte, mit einem festen Ansprechpartner für alles.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/kontakt" size="lg">
                {ctaLabels.primary}
              </Button>
              <Button href="/loesungen/digitalwerk-komplett" variant="inverse" size="lg">
                Details ansehen
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <Check
                  className="h-4 w-4 shrink-0 text-accent-300"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
