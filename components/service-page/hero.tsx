import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { ctaLabels } from "@/lib/site-config";
import type { ServicePageContent } from "./types";

export function ServiceHero({ hero }: { hero: ServicePageContent["hero"] }) {
  return (
    <Section tone="muted" className="pb-16 pt-16 md:pt-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Badge tone="primary">{hero.badge}</Badge>
        <Heading level={1} className="max-w-3xl text-primary-950">
          {hero.title}
        </Heading>
        <p className="max-w-2xl text-lg text-slate-600">{hero.description}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/kontakt" size="lg">
            {ctaLabels.primary}
          </Button>
          <Button href="/kontakt" variant="secondary" size="lg">
            {ctaLabels.secondary}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
