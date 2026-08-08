import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export type ComparisonItem = {
  title: string;
  description: string;
  highlight: string;
  href: Route;
};

export function ComparisonList({
  title,
  intro,
  highlightLabel,
  items,
  tone = "muted",
}: {
  title: string;
  intro?: string;
  highlightLabel: string;
  items: ComparisonItem[];
  tone?: "default" | "muted";
}) {
  return (
    <Section tone={tone}>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{title}</Heading>
          {intro ? (
            <p className="mt-4 text-lg text-slate-600">{intro}</p>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-6">
          {items.map((item) => (
            <Card key={item.href} className="md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <Heading level={3}>{item.title}</Heading>
                  <p className="mt-2 text-slate-600">{item.description}</p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Badge tone="accent">{highlightLabel}</Badge>
                    <p className="text-sm text-slate-600">{item.highlight}</p>
                  </div>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
