import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export type Capability = {
  title: string;
  description: string;
  outcome: string;
};

export function CapabilityGrid({
  title,
  intro,
  capabilities,
}: {
  title: string;
  intro?: string;
  capabilities: Capability[];
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
          {capabilities.map((capability) => (
            <Card key={capability.title} hoverable className="flex flex-col">
              <Heading level={3} size={4}>{capability.title}</Heading>
              <p className="mt-3 flex-1 text-sm text-slate-600">
                {capability.description}
              </p>
              <Badge tone="accent" className="mt-4 self-start">
                {capability.outcome}
              </Badge>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
