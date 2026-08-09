import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";

export const metadata: Metadata = buildMetadata(
  {
    title: "About",
    description:
      "DigitalWerk is your long-term digital partner — learn about our mission, our values, and how we work with businesses.",
  },
  "/en/about",
  { hreflang: { de: "/ueber-uns", en: "/en/about" }, locale: "en_US" }
);

const hero = {
  badge: "About us",
  title: "Your long-term partner for digital growth",
  description:
    "DigitalWerk isn't an agency that works through a list of projects. We're a partner that supports businesses in Germany with their digital growth for the long run — honestly, transparently, and with a clear focus on results.",
};

const values = {
  title: "Our values",
  intro: "What we stand for — in every project and every partnership.",
  items: [
    {
      title: "Professional",
      description:
        "We work with clear processes and reliable results — no empty promises.",
    },
    {
      title: "Premium",
      description: "High-quality execution instead of an off-the-shelf solution.",
    },
    {
      title: "Modern",
      description: "We use current technologies that genuinely make a difference.",
    },
    {
      title: "Fast",
      description: "We move quickly, without compromising on quality.",
    },
    {
      title: "Reliable",
      description: "You can count on what we commit to.",
    },
    {
      title: "Transparent",
      description: "Clear communication and traceable results, no fine print.",
    },
    {
      title: "Results-oriented",
      description: "Every measure is judged by its actual benefit to your business.",
    },
    {
      title: "Long-term partnership",
      description:
        "We think beyond the single project — as a partner, not a temporary vendor.",
    },
  ],
};

const process = {
  title: "How we work",
  steps: [
    {
      title: "Getting to know you",
      description:
        "In a free initial consultation, we understand your business and your goals.",
    },
    {
      title: "Strategy",
      description: "You get a clear plan tailored to you.",
    },
    {
      title: "Execution",
      description: "We implement the agreed measures in a structured way and on schedule.",
    },
    {
      title: "Long-term support",
      description:
        "We stay by your side — with ongoing optimization and a dedicated point of contact.",
    },
  ],
};

const whyChooseUs = {
  title: "Why customers choose us",
  points: [
    {
      title: "One partner instead of five vendors",
      description:
        "Website, SEO, advertising, and automation from one place — aligned, not isolated.",
    },
    {
      title: "Honesty over sales numbers",
      description:
        "We only recommend what genuinely benefits your business — even if that means selling less.",
    },
    {
      title: "Personal support",
      description:
        "You have a dedicated point of contact who knows your business — no rotating contacts.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <ServiceHero hero={hero} />

      <Section>
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <Heading level={2}>Our mission</Heading>
            <p className="mt-4 text-lg text-slate-600">
              We help German businesses become visible online, win more
              customers, and reclaim time through smart automation — with
              solutions that work together instead of existing side by
              side.
            </p>
          </div>
          <div>
            <Heading level={2}>Our vision</Heading>
            <p className="mt-4 text-lg text-slate-600">
              We want to be the digital partner that small and medium-sized
              businesses in Germany can count on for the long run — not one
              of many agencies that disappear once the project is done.
            </p>
          </div>
        </Container>
      </Section>

      <ServiceBenefits benefits={values} tone="muted" />
      <ServiceProcess process={process} />
      <ServiceWhyDigitalWerk whyDigitalWerk={whyChooseUs} />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Get to know us"
          title="Let's talk about your business"
          description="Book a free, no-obligation initial consultation with DigitalWerk."
          primaryHref="/en/contact"
          secondaryHref="/en/contact"
        />
      </div>
    </>
  );
}
