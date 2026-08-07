import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const industries = [
  "Restaurants",
  "Zahnärzte",
  "Ärzte",
  "Anwälte",
  "Hotels",
  "Immobilien",
  "Beauty & Kosmetik",
  "E-Commerce",
];

export function TargetIndustries() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="max-w-2xl">
          <Heading level={2}>Für wen wir arbeiten</Heading>
          <p className="mt-4 text-lg text-slate-600">
            DigitalWerk unterstützt lokale und überregionale Unternehmen aus
            unterschiedlichen Branchen dabei, digital zu wachsen.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {industries.map((industry) => (
            <Badge key={industry} tone="neutral">
              {industry}
            </Badge>
          ))}
        </div>
      </Container>
    </Section>
  );
}
