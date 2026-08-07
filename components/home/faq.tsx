import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

const faqs = [
  {
    question: "Für welche Unternehmen ist DigitalWerk geeignet?",
    answer:
      "Wir arbeiten mit lokalen und überregionalen Unternehmen aus verschiedensten Branchen – von Restaurants und Praxen bis zu Anwälten, Hotels und E-Commerce-Unternehmen.",
  },
  {
    question: "Was kostet eine Zusammenarbeit mit DigitalWerk?",
    answer:
      "Die Kosten richten sich nach Umfang und Zielen Ihres Projekts. Im kostenlosen Erstgespräch erhalten Sie ein transparentes, unverbindliches Angebot ohne versteckte Kosten.",
  },
  {
    question: "Muss ich mich technisch auskennen?",
    answer:
      "Nein. Wir übernehmen die technische Umsetzung vollständig und erklären alles verständlich – Sie konzentrieren sich auf Ihr Tagesgeschäft.",
  },
  {
    question: "Bieten Sie auch einzelne Leistungen ohne Komplettpaket an?",
    answer:
      "Ja. Jede Leistung – von Webentwicklung bis Werbeanzeigen – ist auch einzeln buchbar. Für die meisten Unternehmen ist DigitalWerk Komplett jedoch die wirtschaftlichste Lösung.",
  },
  {
    question: "Wie läuft die Zusammenarbeit ab?",
    answer:
      "Nach dem Erstgespräch erhalten Sie eine klare Strategie und ein Angebot. Nach der Umsetzung begleiten wir Sie laufend mit Reporting und Optimierung.",
  },
];

export function FAQ() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <Heading level={2}>Häufige Fragen</Heading>
          <p className="mt-4 text-lg text-slate-600">
            Antworten auf die Fragen, die uns am häufigsten gestellt werden.
          </p>
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
  );
}
