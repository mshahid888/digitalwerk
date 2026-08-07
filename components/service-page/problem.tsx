import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceProblem({
  problem,
}: {
  problem: ServicePageContent["problem"];
}) {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{problem.title}</Heading>
          {problem.intro ? (
            <p className="mt-4 text-lg text-slate-600">{problem.intro}</p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problem.points.map((point) => (
            <Card key={point.title}>
              <p className="text-lg font-semibold text-primary-900">
                {point.title}
              </p>
              <p className="mt-3 text-slate-600">{point.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
