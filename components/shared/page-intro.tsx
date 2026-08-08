import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export function PageIntro({
  badge,
  title,
  description,
  tone = "muted",
}: {
  badge: string;
  title: string;
  description: ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <Section tone={tone} className="pb-16 pt-16 md:pt-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Badge tone="primary">{badge}</Badge>
        <Heading level={1} className="max-w-3xl text-primary-950">
          {title}
        </Heading>
        <p className="max-w-2xl text-lg text-slate-600">{description}</p>
      </Container>
    </Section>
  );
}
