import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
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
    title: "Kontakt",
    description:
      "Kontaktieren Sie DigitalWerk per Formular, Telefon, E-Mail oder WhatsApp. Kostenloses Erstgespräch – wir melden uns zeitnah zurück.",
  },
  "/kontakt"
);

const faq = {
  title: "Häufige Fragen zur Kontaktaufnahme",
  items: [
    {
      question: "Wie schnell erhalte ich eine Antwort?",
      answer: "In der Regel antworten wir innerhalb eines Werktages.",
    },
    {
      question: "Ist das Erstgespräch wirklich kostenlos und unverbindlich?",
      answer:
        "Ja, das Erstgespräch ist für Sie komplett kostenlos und unverbindlich.",
    },
    {
      question: "Muss ich mich vorbereiten?",
      answer:
        "Nein, es reicht, wenn Sie kurz schildern, worum es geht – den Rest besprechen wir gemeinsam.",
    },
    {
      question: "Kann ich auch über WhatsApp Kontakt aufnehmen?",
      answer:
        "Ja, schreiben Sie uns gerne direkt über WhatsApp – wir antworten dort genauso zuverlässig.",
    },
    {
      question:
        "An wen wende ich mich bei Fragen zu einem laufenden Projekt?",
      answer:
        "Ihr fester Ansprechpartner meldet sich direkt bei Ihnen – nutzen Sie einfach das Kontaktformular oder rufen Sie an.",
    },
  ],
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Kontakt | ${siteConfig.name}`,
  url: `${siteConfig.url}/kontakt`,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageIntro
        tone="default"
        badge="Kontakt"
        title="Lassen Sie uns ins Gespräch kommen"
        description="Ob Formular, Telefon, E-Mail oder WhatsApp – schreiben Sie uns auf dem Weg, der Ihnen am liebsten ist. Wir melden uns zeitnah mit einem kostenlosen, unverbindlichen Erstgespräch zurück."
      />

      <Section tone="muted">
        <Container className="flex flex-col gap-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-card border border-primary-100 bg-white p-6 shadow-card md:p-8">
              <Heading level={2}>Schreiben Sie uns</Heading>
              <p className="mt-2 mb-6 text-sm text-slate-600">
                Füllen Sie das Formular aus, wir melden uns zeitnah zurück.
              </p>
              <ContactForm />
            </div>

            <div className="rounded-card border border-primary-100 bg-white p-6 shadow-card md:p-8">
              <Heading level={2}>Direkter Kontakt</Heading>
              <p className="mt-2 mb-6 text-sm text-slate-600">
                Erreichen Sie uns auch direkt über einen dieser Wege.
              </p>
              <ContactInfo />
            </div>
          </div>

          <MapPlaceholder />
        </Container>
      </Section>

      <ServiceFAQ faq={faq} />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Wir freuen uns auf Sie"
          title="Starten wir Ihr Projekt"
          description="Am schnellsten erreichen Sie uns direkt per WhatsApp oder Telefon."
          primaryHref={new URL(siteConfig.social.whatsapp)}
          primaryLabel="Per WhatsApp schreiben"
          secondaryHref={new URL(`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`)}
          secondaryLabel="Jetzt anrufen"
        />
      </div>
    </>
  );
}
