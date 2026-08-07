import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceSolution({
  solution,
}: {
  solution: ServicePageContent["solution"];
}) {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="max-w-2xl">
          <Heading level={2}>{solution.title}</Heading>
          <p className="mt-4 text-lg text-slate-600">
            {solution.description}
          </p>
        </div>

        {solution.points && solution.points.length > 0 ? (
          <ul className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
            {solution.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-left text-sm text-slate-600"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
