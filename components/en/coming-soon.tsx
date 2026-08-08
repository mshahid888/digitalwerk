import type { Route } from "next";
import { PageIntro } from "@/components/shared/page-intro";
import { CTA } from "@/components/ui/cta";

// Shared shell for English routes whose full translation hasn't been
// written yet. Gives each route a real, honest page (not a 404 or a
// literal machine translation) with a short genuine intro and a clear path
// to either the existing German page or direct contact.
export function ComingSoonEn({
  badge,
  title,
  description,
  germanHref,
}: {
  badge: string;
  title: string;
  description: string;
  germanHref: Route;
}) {
  return (
    <>
      <PageIntro badge={badge} title={title} description={description} />
      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Full English translation coming soon"
          title="This page is available in German today"
          description="We're translating our full site into English step by step. In the meantime, you're welcome to view the German version or get in touch directly — we're happy to answer questions in English."
          primaryHref="/en/contact"
          primaryLabel="Contact us"
          secondaryHref={germanHref}
          secondaryLabel="View German page"
        />
      </div>
    </>
  );
}
