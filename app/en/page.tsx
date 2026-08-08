import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { siteConfigEn } from "@/lib/site-config";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CTA } from "@/components/ui/cta";

export const metadata: Metadata = buildMetadata(
  {
    description: siteConfigEn.description,
  },
  "/en",
  { hreflang: { de: "/", en: "/en" }, locale: "en_US" }
);

const pillars = [
  {
    title: "Visibility & Website",
    description:
      "A modern website, local SEO, Google Business Profile, and content — so people find you and trust what they see.",
    href: "/en/solutions",
  },
  {
    title: "AI Automation",
    description:
      "Chatbots, voice agents, and automated appointment booking — for fast answers, around the clock.",
    href: "/en/ai-agents",
  },
  {
    title: "Advertising & Growth",
    description:
      "Google, Meta, and TikTok Ads that bring measurable inquiries and revenue — no wasted spend.",
    href: "/en/advertising",
  },
  {
    title: "E-Commerce",
    description:
      "Shopify, WooCommerce, and marketplace integration for businesses that sell online.",
    href: "/en/e-commerce",
  },
] as const;

const faqs = [
  {
    question: "Is DigitalWerk's website only in German?",
    answer:
      "No — this English section is being built out page by page. Our German site remains the most complete today, and we're happy to work with you in English throughout.",
  },
  {
    question: "Do you work with businesses outside Germany?",
    answer:
      "Our core focus is businesses in Germany, since that's where our local SEO and market expertise is strongest. Get in touch and we'll tell you honestly whether we're a good fit.",
  },
  {
    question: "How do I get started?",
    answer:
      "Reach out via our contact page for a free, no-obligation introductory call — in English or German, whichever you prefer.",
  },
] as const;

export default function Page() {
  return (
    <>
      <Section tone="muted" className="pb-20 pt-16 md:pb-28 md:pt-24">
        <Container className="flex flex-col items-center gap-8 text-center">
          <Badge tone="primary">Digital Growth Partnership for Germany</Badge>

          <Heading level={1} className="max-w-4xl text-primary-950">
            More customers. More visibility. More growth — digital.
          </Heading>

          <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
            DigitalWerk combines website, local SEO, advertising, and AI
            automation into one solution that works for your business —
            without you having to coordinate five different agencies.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/en/contact" size="lg">
              Free Consultation
            </Button>
            <Button href="/en/solutions" variant="secondary" size="lg">
              Explore Solutions
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col items-center gap-12">
          <div className="max-w-2xl text-center">
            <Heading level={2}>One partner for your digital growth</Heading>
            <p className="mt-4 text-lg text-slate-600">
              Instead of coordinating five vendors, get everything from one
              partner — aligned with your goals.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <Link key={pillar.href} href={pillar.href} className="group">
                <Card hoverable className="flex h-full flex-col">
                  <Heading
                    level={3}
                    size={4}
                    className="group-hover:text-primary-600"
                  >
                    {pillar.title}
                  </Heading>
                  <p className="mt-3 flex-1 text-sm text-slate-600">
                    {pillar.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid items-center gap-12 rounded-card bg-primary-950 p-8 text-white md:grid-cols-2 md:p-16">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-accent-300">
                Our Recommendation
              </span>
              <Heading level={2} className="mt-4 text-white">
                DigitalWerk Complete — your digital department, from one
                partner
              </Heading>
              <p className="mt-4 text-primary-100">
                For most businesses, DigitalWerk Complete is the most
                effective choice: one ongoing partnership instead of
                separate projects, with a single point of contact for
                everything.
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

      <Section>
        <Container className="flex flex-col items-center gap-12">
          <div className="max-w-2xl text-center">
            <Heading level={2}>Frequently Asked Questions</Heading>
          </div>

          <div className="w-full max-w-3xl divide-y divide-primary-100">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-primary-900 marker:content-none">
                  {faq.question}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-primary-400 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Ready for more growth?"
          title="Let's bring your business forward, digitally"
          description="Book a free, no-obligation introductory call and find out how DigitalWerk can help you get more visibility and inquiries."
          primaryHref="/en/contact"
          secondaryHref="/en/contact"
          secondaryLabel="Request a Project"
        />
      </div>
    </>
  );
}
