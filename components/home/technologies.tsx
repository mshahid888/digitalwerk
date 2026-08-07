import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const technologies = [
  "Google Ads",
  "Meta Ads",
  "TikTok Ads",
  "Google Unternehmensprofil",
  "Shopify",
  "WooCommerce",
  "WhatsApp Business",
];

export function Technologies() {
  return (
    <Section className="py-10 md:py-12">
      <Container>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Plattformen &amp; Kanäle, mit denen wir arbeiten
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="text-sm font-medium text-slate-600 sm:text-base"
            >
              {tech}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
