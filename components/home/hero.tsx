import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { ctaLabels } from "@/lib/site-config";

export function Hero() {
  return (
    <Section tone="muted" className="pb-20 pt-16 md:pb-28 md:pt-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <Badge tone="primary">Digitale Wachstumspartnerschaft für Deutschland</Badge>

        <Heading level={1} className="max-w-4xl animate-slide-up text-primary-950">
          Mehr Kunden. Mehr Sichtbarkeit. Mehr Wachstum – digital.
        </Heading>

        <p className="max-w-2xl animate-slide-up text-lg text-slate-600 md:text-xl">
          DigitalWerk verbindet Website, lokales SEO, Werbeanzeigen und
          KI-Automatisierung zu einer Lösung, die für Ihr Unternehmen
          arbeitet – ohne dass Sie fünf verschiedene Agenturen koordinieren
          müssen.
        </p>

        <div className="flex animate-slide-up flex-col gap-4 sm:flex-row">
          <Button href="/kontakt" size="lg">
            {ctaLabels.primary}
          </Button>
          <Button href="/kontakt" variant="secondary" size="lg">
            {ctaLabels.secondary}
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 text-sm text-slate-600 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-1">
            <dt className="font-semibold text-primary-800">Persönlich</dt>
            <dd>Ein fester Ansprechpartner für alle Leistungen</dd>
          </div>
          <div className="flex flex-col items-center gap-1">
            <dt className="font-semibold text-primary-800">Transparent</dt>
            <dd>Klare Prozesse und nachvollziehbare Ergebnisse</dd>
          </div>
          <div className="flex flex-col items-center gap-1">
            <dt className="font-semibold text-primary-800">DSGVO-konform</dt>
            <dd>Gehostet und betreut nach deutschem Datenschutzrecht</dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
