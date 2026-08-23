import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { buildContactPageJsonLd } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import { ServiceFAQ } from "@/components/service-page/faq";
import { ContactForm } from "@/components/kontakt/contact-form";
import { ContactInfo } from "@/components/kontakt/contact-info";
import { MapPlaceholder } from "@/components/kontakt/map-placeholder";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata(
  {
    title: "Contact",
    description:
      "Contact DigitalWerk by form, phone, email, or WhatsApp. Free introductory call — we get back to you promptly.",
  },
  "/en/contact",
  { hreflang: { de: "/kontakt", en: "/en/contact" }, locale: "en_US" }
);

const faq = {
  title: "Frequently asked questions about getting in touch",
  items: [
    {
      question: "How quickly will I hear back?",
      answer: "We typically reply within one business day.",
    },
    {
      question: "Is the introductory call really free and no-obligation?",
      answer:
        "Yes — the introductory call is completely free and non-binding.",
    },
    {
      question: "Do I need to prepare anything?",
      answer:
        "No — a short description of what you're looking for is enough. We'll work out the rest together.",
    },
    {
      question: "Can I contact you via WhatsApp?",
      answer:
        "Yes, feel free to message us directly on WhatsApp — we reply there just as reliably.",
    },
    {
      question: "Do you work with English-speaking clients?",
      answer:
        "Yes — we're happy to run the entire process in English, from the first call to ongoing support.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildContactPageJsonLd("/en/contact", "en")} />
      <PageIntro
        tone="default"
        badge="Contact"
        title="Let's start a conversation"
        description="Form, phone, email, or WhatsApp — reach out however suits you best. We'll get back to you promptly with a free, no-obligation introductory call."
      />

      <Section tone="muted">
        <Container className="flex flex-col gap-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-card border border-primary-100 bg-white p-6 shadow-card md:p-8">
              <Heading level={2}>Send us a message</Heading>
              <p className="mt-2 mb-6 text-sm text-slate-600">
                Fill out the form and we&apos;ll get back to you promptly.
              </p>
              <ContactForm locale="en" />
            </div>

            <div className="rounded-card border border-primary-100 bg-white p-6 shadow-card md:p-8">
              <Heading level={2}>Direct contact</Heading>
              <p className="mt-2 mb-6 text-sm text-slate-600">
                You can also reach us directly through one of these channels.
              </p>
              <ContactInfo locale="en" />
            </div>
          </div>

          <MapPlaceholder locale="en" />
        </Container>
      </Section>

      <ServiceFAQ faq={faq} />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="We look forward to hearing from you"
          title="Let's start your project"
          description="The fastest way to reach us is directly via WhatsApp or phone."
          primaryHref={new URL(siteConfig.social.whatsapp)}
          primaryLabel="Message us on WhatsApp"
          secondaryHref={new URL(`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`)}
          secondaryLabel="Call now"
        />
      </div>
    </>
  );
}
