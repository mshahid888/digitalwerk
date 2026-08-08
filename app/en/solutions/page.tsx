import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/shared/page-intro";
import {
  ComparisonList,
  type ComparisonItem,
} from "@/components/shared/comparison-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/ui/cta";

export const metadata: Metadata = buildMetadata(
  {
    title: "Solutions",
    description:
      "Website, SEO, Google Business Profile, and content creation — book individually or as a complete solution. Find the right fit for your business.",
  },
  "/en/solutions",
  { hreflang: { de: "/loesungen", en: "/en/solutions" }, locale: "en_US" }
);

const services: ComparisonItem[] = [
  {
    title: "Web Development",
    description:
      "Modern, fast, conversion-focused websites that turn visitors into customers.",
    highlight: "Your current website is outdated, slow, or doesn't work well on mobile.",
    href: "/en/solutions/web-development",
  },
  {
    title: "SEO",
    description:
      "Local SEO that makes you more visible on Google and Google Maps — more calls, more visits.",
    highlight: "Your website exists but is barely found on Google.",
    href: "/en/solutions/seo",
  },
  {
    title: "Google Business Profile",
    description:
      "Professional optimization of your Google profile for better rankings and more reviews.",
    highlight: "Your Google profile is incomplete or not set up yet.",
    href: "/en/solutions/google-business-profile",
  },
  {
    title: "Content Creation",
    description:
      "Professional website and SEO content that convinces and ranks.",
    highlight: "Your website is technically solid, but the copy doesn't convince — or is missing.",
    href: "/en/solutions/content-creation",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        badge="Solutions"
        title="The right solution for your business"
        description="Whether it's a single service or full digital support — DigitalWerk has a fitting solution. For most businesses, we recommend DigitalWerk Complete, our all-in-one solution."
      />

      <Section>
        <Container>
          <div className="grid items-center gap-12 rounded-card bg-primary-950 p-8 text-white md:grid-cols-2 md:p-16">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-accent-300">
                Our Recommendation
              </span>
              <Heading level={2} className="mt-4 text-white">
                DigitalWerk Complete — the all-in-one solution
              </Heading>
              <p className="mt-4 text-primary-100">
                For most businesses, DigitalWerk Complete is the most
                effective and economical choice: instead of coordinating
                individual services, you get full digital support from one
                partner, with a single point of contact instead of five.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href="/en/contact" size="lg">
                  Free Consultation
                </Button>
                <Button
                  href="/en/solutions/complete"
                  variant="inverse"
                  size="lg"
                >
                  View Details
                </Button>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-primary-100">
              <li>Website Development</li>
              <li>Local SEO</li>
              <li>Google Business Profile</li>
              <li>Content Creation</li>
              <li>AI Automation</li>
              <li>Analytics &amp; Reporting</li>
              <li>Monthly Optimization</li>
              <li>Ongoing Support</li>
            </ul>
          </div>
        </Container>
      </Section>

      <ComparisonList
        title="Individual services in detail"
        intro="Don't need the complete package? Every service is also available on its own."
        highlightLabel="A good fit if"
        items={services}
      />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Not sure what fits?"
          title="We'll advise you, no obligation"
          description="In a free introductory call, we'll help you figure out together which solution will do the most for your business."
          primaryHref="/en/contact"
          secondaryHref="/en/contact"
          secondaryLabel="Request a Project"
        />
      </div>
    </>
  );
}
