import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import type { ServicePageContent } from "./types";

export function ServiceFAQ({ faq }: { faq: ServicePageContent["faq"] }) {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{faq.title}</Heading>
        </div>

        <div className="w-full max-w-3xl divide-y divide-primary-100">
          {faq.items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-primary-900 marker:content-none">
                {item.question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-primary-400 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
