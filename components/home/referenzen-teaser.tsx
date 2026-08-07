import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export function ReferenzenTeaser() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-6 text-center">
        <Heading level={2}>Ergebnisse, die zählen</Heading>
        <p className="max-w-2xl text-lg text-slate-600">
          Wir messen unsere Arbeit an Ihren Ergebnissen – mehr Anfragen,
          bessere Sichtbarkeit und nachvollziehbares Reporting statt
          Buzzwords. In unseren Referenzen zeigen wir, woran wir aktuell
          arbeiten.
        </p>
        <Link
          href="/referenzen"
          className="inline-flex items-center gap-2 text-base font-semibold text-primary-600 hover:text-primary-700"
        >
          Referenzen ansehen
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Container>
    </Section>
  );
}
