import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = buildMetadata(
  {
    title: "Cookie Policy",
    description:
      "Information on which cookies and similar technologies this website currently uses.",
    robots: { index: false, follow: true },
  },
  "/en/cookie-policy",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <LegalPage
      title="Cookie Policy"
      notice="This page is an English translation of the German Cookie-Richtlinie and describes the current technical state of our website. It has not yet been separately reviewed by legal counsel and will be updated as additional services (e.g. analytics tools, advertising pixels, or a map view) are integrated. The German version remains the legally binding text."
      sections={[
        {
          heading: "What Are Cookies?",
          content: (
            <p>
              Cookies are small text files that may be stored on your
              device when you visit a website, in order to save or
              recognize information between individual page visits.
            </p>
          ),
        },
        {
          heading: "Current Status on This Website",
          content: (
            <p>
              This website currently does not use cookies for analytics,
              marketing, or tracking purposes. There is also currently no
              integration of Google Analytics, advertising pixels (e.g.
              from Google or Meta), a map view, or comparable services that
              would set cookies.
            </p>
          ),
        },
        {
          heading: "What Will Change in the Future",
          content: (
            <>
              <p>
                As soon as we actively integrate tools such as Google
                Analytics, Google Tag Manager, Meta or TikTok advertising
                pixels, Microsoft Clarity, or a map view, we will update
                this page accordingly and — where legally required —
                introduce a cookie consent banner.
              </p>
              <p>
                Such a banner will then clearly distinguish between
                technically necessary functions, analytics tools, and
                marketing/advertising tracking, so that you can grant your
                consent for each category individually or withdraw it at
                any time.
              </p>
            </>
          ),
        },
        {
          heading: "External Services via Link",
          content: (
            <p>
              Our website contains a link to WhatsApp. Only once you
              actively click this link do you leave our website, and
              WhatsApp/Meta may set its own cookies. Further details can be
              found in our{" "}
              <Link
                href="/en/privacy-policy"
                className="text-primary-600 hover:text-primary-700"
              >
                Privacy Policy
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Managing Cookies via Your Browser",
          content: (
            <p>
              You can restrict the storage of cookies in your browser at
              any time or delete cookies that are already stored. Further
              information can be found in your browser&apos;s help
              function.
            </p>
          ),
        },
      ]}
    />
  );
}
