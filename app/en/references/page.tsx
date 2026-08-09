import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";

export const metadata: Metadata = buildMetadata(
  {
    title: "References",
    description:
      "A look at the types of projects DigitalWerk works on — from website relaunches to AI automation. Real client references are on their way.",
  },
  "/en/references",
  { hreflang: { de: "/referenzen", en: "/en/references" }, locale: "en_US" }
);

const exampleProjects: Capability[] = [
  {
    title: "Website Relaunch",
    description:
      "Redesigning an existing website with a focus on speed, mobile use, and conversion.",
    outcome: "Example project",
  },
  {
    title: "Local SEO Buildout",
    description:
      "Optimizing website and Google Business Profile for better local visibility.",
    outcome: "Example project",
  },
  {
    title: "AI Chatbot Integration",
    description:
      "Setting up a chatbot to automatically answer common customer questions.",
    outcome: "Example project",
  },
  {
    title: "Google Ads Campaign",
    description: "Building and managing a targeted search ad campaign.",
    outcome: "Example project",
  },
  {
    title: "Online Store Setup",
    description:
      "Setting up a Shopify or WooCommerce store, including baseline optimization.",
    outcome: "Example project",
  },
  {
    title: "Google Business Profile Optimization",
    description:
      "Complete overhaul and ongoing management of a Google Business Profile.",
    outcome: "Example project",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        tone="default"
        badge="References"
        title="Our work"
        description="DigitalWerk is a young, growing company. This is where we'll showcase real client projects and results in the future. Until then, here's a look at the type of projects we take on."
      />

      <CapabilityGrid
        title="Example project types"
        intro="Since we can't yet publish completed client projects, these are example project types — not real client references."
        capabilities={exampleProjects}
      />

      <Section>
        <Container className="mx-auto max-w-2xl text-center">
          <Heading level={2}>Real projects coming soon</Heading>
          <p className="mt-4 text-lg text-slate-600">
            As soon as client projects are completed, we&apos;ll showcase them
            here with their actual results.
          </p>
        </Container>
      </Section>

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Your project could be next"
          title="Let's talk about your project"
          description="Book a free, no-obligation initial consultation with DigitalWerk."
          primaryHref="/en/contact"
          secondaryHref="/en/solutions"
          secondaryLabel="Explore our solutions"
        />
      </div>
    </>
  );
}
