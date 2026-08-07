import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="flex flex-col items-start gap-6">
        <span className="text-sm font-medium uppercase tracking-wide text-primary-500">
          404
        </span>
        <Heading level={1}>Seite nicht gefunden</Heading>
        <p className="max-w-xl text-lg text-slate-600">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Button href="/">Zur Startseite</Button>
      </Container>
    </Section>
  );
}
