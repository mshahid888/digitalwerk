import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export type AISolution = {
  title: string;
  description: string;
  outcome: string;
};

export function SolutionsGrid({
  title,
  intro,
  solutions,
}: {
  title: string;
  intro?: string;
  solutions: AISolution[];
}) {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{title}</Heading>
          {intro ? (
            <p className="mt-4 text-lg text-slate-600">{intro}</p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Card key={solution.title} hoverable className="flex flex-col">
              <Heading level={4}>{solution.title}</Heading>
              <p className="mt-3 flex-1 text-sm text-slate-600">
                {solution.description}
              </p>
              <Badge tone="accent" className="mt-4 self-start">
                {solution.outcome}
              </Badge>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
