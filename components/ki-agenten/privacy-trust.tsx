import { Eye, Lock, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

type PrivacyPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const points: PrivacyPoint[] = [
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
];

export function PrivacyTrust() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Datenschutz &amp; Sicherheit</Heading>
          <p className="mt-4 text-lg text-slate-600">
            KI-Agenten verarbeiten Kundendaten – deshalb ist uns ein
            verantwortungsvoller Umgang damit besonders wichtig. Wir setzen
            auf Transparenz statt Kleingedrucktes und behalten die Kontrolle
            dort, wo sie hingehört: bei Ihrem Unternehmen und Ihrem Team.
          </p>
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
