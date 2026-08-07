import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const problems = [
  {
    title: "Ihre Website bringt keine neuen Anfragen.",
    description:
      "Sie sieht gut aus, aber sie überzeugt Besucher nicht dazu, Kontakt aufzunehmen.",
  },
  {
    title: "Bei Google sind Sie für Ihre Kunden kaum zu finden.",
    description:
      "Wer in Ihrer Region nach Ihren Leistungen sucht, landet zuerst bei der Konkurrenz.",
  },
  {
    title: "Zwischen Werbung, Social Media und Google-Profil bleibt keine Zeit.",
    description:
      "Das Tagesgeschäft hat Vorrang – die digitale Sichtbarkeit bleibt liegen.",
  },
];

export function Problem() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Kennen Sie das?</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Die meisten Unternehmen verlieren nicht durch schlechte Arbeit
            Kunden – sondern weil sie online nicht gefunden oder nicht
            überzeugend dargestellt werden.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <Card key={problem.title}>
              <p className="text-lg font-semibold text-primary-900">
                {problem.title}
              </p>
              <p className="mt-3 text-slate-600">{problem.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
