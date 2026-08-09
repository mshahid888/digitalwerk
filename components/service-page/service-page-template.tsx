import type { Route } from "next";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "./hero";
import { ServiceProblem } from "./problem";
import { ServiceSolution } from "./solution";
import { ServiceBenefits } from "./benefits";
import { ServiceIncluded } from "./included";
import { ServiceProcess } from "./process";
import { ServiceWhyDigitalWerk } from "./why-digitalwerk";
import { ServiceFAQ } from "./faq";
import type { ServicePageContent } from "./types";

// Fixed 9-part structure every service page must follow:
// Hero, Problem, Solution, Benefits, Included, Process, Why DigitalWerk, FAQ, CTA.
export function ServicePageTemplate({
  content,
  contactHref = "/kontakt",
}: {
  content: ServicePageContent;
  // English pages must pass "/en/contact" — defaults to the German contact
  // page so existing German callers don't need to change.
  contactHref?: Route;
}) {
  return (
    <>
      <ServiceHero hero={content.hero} />
      <ServiceProblem problem={content.problem} />
      <ServiceSolution solution={content.solution} />
      <ServiceBenefits benefits={content.benefits} />
      <ServiceIncluded included={content.included} />
      <ServiceProcess process={content.process} />
      <ServiceWhyDigitalWerk whyDigitalWerk={content.whyDigitalWerk} />
      <ServiceFAQ faq={content.faq} />
      <div className="py-16 md:py-24">
        <CTA
          eyebrow={content.cta.eyebrow}
          title={content.cta.title}
          description={content.cta.description}
          primaryHref={contactHref}
          secondaryHref={contactHref}
        />
      </div>
    </>
  );
}
