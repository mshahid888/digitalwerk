import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const steps = [
  {
    number: "01",
    title: "Kennenlernen & Analyse",
    description:
      "Im kostenlosen Erstgespräch verstehen wir Ihr Unternehmen, Ihre Ziele und Ihren aktuellen digitalen Auftritt.",
  },
  {
    number: "02",
    title: "Strategie & Angebot",
    description:
      "Sie erhalten einen klaren, transparenten Plan – ohne versteckte Kosten oder unnötige Leistungen.",
  },
  {
    number: "03",
    title: "Umsetzung",
    description:
      "Wir setzen Website, SEO, Werbung oder KI-Automatisierung strukturiert und termingerecht um.",
  },
  {
    number: "04",
    title: "Betreuung & Optimierung",
    description:
      "Nach dem Launch begleiten wir Sie laufend – mit Reporting, Optimierung und einem festen Ansprechpartner.",
  },
];

export function Process() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>So arbeiten wir</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Ein klarer Prozess von der ersten Idee bis zur laufenden
            Betreuung.
          </p>
        </div>

        <ol className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col gap-3">
              <span className="text-3xl font-semibold text-primary-400">
                {step.number}
              </span>
              <Heading level={3} size={4}>{step.title}</Heading>
              <p className="text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
