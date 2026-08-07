import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceProcess({
  process,
}: {
  process: ServicePageContent["process"];
}) {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{process.title}</Heading>
          {process.intro ? (
            <p className="mt-4 text-lg text-slate-600">{process.intro}</p>
          ) : null}
        </div>

        <ol className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="text-3xl font-semibold text-primary-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Heading level={4}>{step.title}</Heading>
              <p className="text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
