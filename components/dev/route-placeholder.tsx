import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

type RoutePlaceholderProps = {
  title: string;
  description: string;
};

// Temporary Phase 1 scaffolding — replaced route-by-route in its dedicated build phase.
export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <Section className="min-h-[60vh]">
      <Container className="flex flex-col items-start gap-6">
        <Badge tone="accent">In Entwicklung</Badge>
        <Heading level={1}>{title}</Heading>
        <p className="max-w-2xl text-lg text-slate-600">{description}</p>
      </Container>
    </Section>
  );
}
