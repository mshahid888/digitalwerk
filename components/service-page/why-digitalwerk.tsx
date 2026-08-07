import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceWhyDigitalWerk({
  whyDigitalWerk,
}: {
  whyDigitalWerk: ServicePageContent["whyDigitalWerk"];
}) {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{whyDigitalWerk.title}</Heading>
          {whyDigitalWerk.intro ? (
            <p className="mt-4 text-lg text-slate-600">
              {whyDigitalWerk.intro}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {whyDigitalWerk.points.map((point) => (
            <Card key={point.title}>
              <Heading level={4}>{point.title}</Heading>
              <p className="mt-3 text-sm text-slate-600">
                {point.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
