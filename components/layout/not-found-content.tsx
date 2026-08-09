import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

// Shared by app/(de)/not-found.tsx and app/en/not-found.tsx. Content is
// unchanged/untranslated (still German) — this only makes the existing
// 404 reachable under both locale roots instead of just one; it does not
// add a translation.
export function NotFoundContent() {
  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="flex flex-col items-start gap-6">
        <span className="text-sm font-medium uppercase tracking-wide text-primary-500">
          404
        </span>
        <Heading level={1}>Seite nicht gefunden</Heading>
        <p className="max-w-xl text-lg text-slate-600">
          Die gesuchte Seite existiert nicht oder wurde verschoben. Nutzen
          Sie einen der folgenden Links, um weiterzukommen.
        </p>
        <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
          <Button href="/">Zur Startseite</Button>
          <Button href="/loesungen" variant="secondary">
            Unsere Lösungen
          </Button>
          <Button href="/kontakt" variant="secondary">
            Kontakt aufnehmen
          </Button>
        </div>
      </Container>
    </Section>
  );
}
