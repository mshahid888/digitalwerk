import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceIncluded({
  included,
}: {
  included: ServicePageContent["included"];
}) {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-10">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{included.title}</Heading>
          {included.intro ? (
            <p className="mt-4 text-lg text-slate-600">{included.intro}</p>
          ) : null}
        </div>

        <ul className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {included.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-soft"
            >
              <Check
                className="h-5 w-5 shrink-0 text-accent-600"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-primary-900">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
