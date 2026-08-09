import { Eye, Lock, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

type PrivacyPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Locale = "de" | "en";

const POINTS: Record<Locale, PrivacyPoint[]> = {
  de: [
    {
      icon: ShieldCheck,
      title: "DSGVO-Bewusstsein",
      description:
        "Wir setzen KI-Lösungen so ein, dass sie die Grundsätze der Datenschutz-Grundverordnung berücksichtigen – von der Datenerhebung bis zur Speicherung.",
    },
    {
      icon: Lock,
      title: "Verantwortungsvoller Umgang mit Kundendaten",
      description:
        "Kundendaten werden ausschließlich für den vorgesehenen Zweck verarbeitet – nicht weitergegeben und nicht zweckentfremdet.",
    },
    {
      icon: Eye,
      title: "Transparenz",
      description:
        "Wir erklären offen, welche Daten verarbeitet werden und wozu – ohne Kleingedrucktes oder versteckte Prozesse.",
    },
    {
      icon: Users,
      title: "KI unterstützt, statt zu ersetzen",
      description:
        "Unsere KI-Agenten übernehmen wiederkehrende Aufgaben. Die Verantwortung für sensible Kundenanliegen bleibt bei Ihrem Team.",
    },
  ],
  en: [
    {
      icon: ShieldCheck,
      title: "GDPR awareness",
      description:
        "We implement AI solutions with the principles of the GDPR in mind — from data collection through to storage.",
    },
    {
      icon: Lock,
      title: "Responsible handling of customer data",
      description:
        "Customer data is processed only for its intended purpose — never shared or repurposed.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "We explain openly what data is processed and why — no fine print, no hidden processes.",
    },
    {
      icon: Users,
      title: "AI supports, it doesn't replace",
      description:
        "Our AI agents take on recurring tasks. Responsibility for sensitive customer matters stays with your team.",
    },
  ],
};

const STRINGS: Record<Locale, { title: string; intro: string }> = {
  de: {
    title: "Datenschutz & Sicherheit",
    intro:
      "KI-Agenten verarbeiten Kundendaten – deshalb ist uns ein verantwortungsvoller Umgang damit besonders wichtig. Wir setzen auf Transparenz statt Kleingedrucktes und behalten die Kontrolle dort, wo sie hingehört: bei Ihrem Unternehmen und Ihrem Team.",
  },
  en: {
    title: "Privacy & Security",
    intro:
      "AI agents process customer data — which is why handling it responsibly matters to us. We favor transparency over fine print and keep control where it belongs: with your business and your team.",
  },
};

export function PrivacyTrust({ locale = "de" }: { locale?: Locale }) {
  const t = STRINGS[locale];
  const points = POINTS[locale];

  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>{t.title}</Heading>
          <p className="mt-4 text-lg text-slate-600">{t.intro}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {points.map((point) => (
            <div
              key={point.title}
              className="flex gap-4 rounded-card border border-primary-100 bg-white p-6 shadow-soft"
            >
              <point.icon
                className="h-6 w-6 shrink-0 text-primary-600"
                aria-hidden="true"
              />
              <div>
                <Heading level={3} size={4}>{point.title}</Heading>
                <p className="mt-2 text-sm text-slate-600">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
