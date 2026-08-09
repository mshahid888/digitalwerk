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
    title: "Industries",
    description:
      "Digital solutions for restaurants, medical practices, hotels, trades, law firms, and more industries — tailored, not off the shelf.",
  },
  "/en/industries",
  { hreflang: { de: "/branchen", en: "/en/industries" }, locale: "en_US" }
);

const industries: Capability[] = [
  {
    title: "Restaurants & Hospitality",
    description:
      "From Google visibility to online reservations — digital solutions for restaurants, cafés, and hospitality businesses.",
    outcome: "More table reservations",
  },
  {
    title: "Doctors & Dentists",
    description:
      "A professional website, local SEO, and appointment booking for practices that want a modern digital presence for their patients.",
    outcome: "More appointment requests",
  },
  {
    title: "Hotels & Vacation Rentals",
    description:
      "Google visibility, an appealing presentation, and automated inquiry handling for hospitality businesses.",
    outcome: "More direct bookings",
  },
  {
    title: "Trades & Local Service Providers",
    description:
      "Local visibility and a website that builds trust — for trades businesses and local service providers.",
    outcome: "More inquiries from your region",
  },
  {
    title: "Law Firms & Consultants",
    description:
      "A professional digital presence that conveys trust and expertise — for lawyers, tax advisors, and consulting firms.",
    outcome: "More qualified inquiries",
  },
  {
    title: "Beauty & Wellness",
    description:
      "From appointment booking to Google visibility — digital solutions for salons, studios, and wellness providers.",
    outcome: "More bookings",
  },
  {
    title: "Retail",
    description:
      "Online visibility, e-commerce, and local customer acquisition for retailers.",
    outcome: "More foot traffic & online revenue",
  },
  {
    title: "Other Local Businesses",
    description:
      "Regardless of your industry: if you want customers to find you online, we'll support you with the right digital solutions.",
    outcome: "Tailored to fit",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        badge="Industries"
        title="Digital solutions for your industry"
        description="DigitalWerk helps small and medium-sized businesses across a range of industries become visible online and win more customers."
      />

      <Section>
        <Container className="mx-auto max-w-3xl text-center">
          <Heading level={2}>Why industry-specific solutions matter</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Every industry has different customers, different search
            behavior, and different requirements. A restaurant needs
            different content and different local visibility than a law
            firm or a hotel. That&apos;s why we tailor our solutions — website,
            local SEO, Google profile, advertising, and automation —
            specifically to the needs of your industry, rather than offering
            a one-size-fits-all solution.
          </p>
        </Container>
      </Section>

      <CapabilityGrid
        title="Industries we work with"
        intro="A selection of the industries our solutions are especially well suited for."
        capabilities={industries}
      />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Your industry isn't listed?"
          title="Talk to us about your business"
          description="Regardless of your industry, we'll find the right digital solution for you together."
          primaryHref="/en/contact"
          secondaryHref="/en/contact"
        />
      </div>
    </>
  );
}
