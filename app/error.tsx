"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[70vh] items-center">
      <Container className="flex flex-col items-start gap-6">
        <span className="text-sm font-medium uppercase tracking-wide text-primary-500">
          Fehler
        </span>
        <Heading level={1}>Etwas ist schiefgelaufen</Heading>
        <p className="max-w-xl text-lg text-slate-600">
          Bitte versuchen Sie es erneut oder kontaktieren Sie uns, falls das
          Problem weiterhin besteht.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => retry()}>Erneut versuchen</Button>
          <Button href="/kontakt" variant="secondary">
            Kontakt aufnehmen
          </Button>
        </div>
      </Container>
    </Section>
  );
}
