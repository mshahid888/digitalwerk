import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceBenefits({
  benefits,
  tone = "default",
}: {
  benefits: ServicePageContent["benefits"];
  tone?: "default" | "muted";
}) {
  return (
    <Section tone={tone}>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{benefits.title}</Heading>
          {benefits.intro ? (
            <p className="mt-4 text-lg text-slate-600">{benefits.intro}</p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.items.map((item) => (
            <Card key={item.title} hoverable>
              <Heading level={3} size={4}>{item.title}</Heading>
              <p className="mt-3 text-sm text-slate-600">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
