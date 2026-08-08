import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export type LegalSection = {
  heading: string;
  content: ReactNode;
};

export function LegalPage({
  title,
  intro,
  notice,
  sections,
}: {
  title: string;
  intro?: string;
  notice?: string;
  sections: LegalSection[];
}) {
  return (
    <Section className="py-16 md:py-24">
      <Container className="mx-auto max-w-3xl">
        <Heading level={1} className="text-primary-950">
          {title}
        </Heading>
        {intro ? <p className="mt-4 text-lg text-slate-600">{intro}</p> : null}

        {notice ? (
          <div className="mt-8 rounded-lg border border-accent-200 bg-accent-50 p-4 text-sm text-accent-900">
            {notice}
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <Heading level={2}>{section.heading}</Heading>
              <div className="mt-3 flex flex-col gap-3 text-slate-600">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
