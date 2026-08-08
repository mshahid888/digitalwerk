import Link from "next/link";
import type { Route } from "next";
import { LegalPage } from "@/components/legal/legal-page";

// English legal pages are routing placeholders, not translations — legal
// text must be reviewed before publishing an English version. This points
// visitors to the binding German original instead of inventing content.
export function LegalPlaceholderEn({
  title,
  germanHref,
  germanLabel,
}: {
  title: string;
  germanHref: Route;
  germanLabel: string;
}) {
  return (
    <LegalPage
      title={title}
      notice="An official English translation of this document has not yet been reviewed and published."
      sections={[
        {
          heading: "Legally binding version",
          content: (
            <p>
              The German version is the current, legally binding text. Please
              refer to the{" "}
              <Link
                href={germanHref}
                className="text-primary-600 hover:text-primary-700"
              >
                {germanLabel}
              </Link>{" "}
              until a reviewed English translation is published here.
            </p>
          ),
        },
      ]}
    />
  );
}
