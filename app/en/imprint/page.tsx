import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/legal-page";
import {
  legalFieldOrPlaceholderEn,
  legalInfo,
  siteConfig,
} from "@/lib/site-config";

export const metadata: Metadata = buildMetadata(
  {
    title: "Imprint",
    description: "Legal disclosure pursuant to § 5 TMG (German Telemedia Act).",
    robots: { index: false, follow: true },
  },
  "/en/imprint",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <LegalPage
      title="Imprint"
      notice="This page is an English translation of the German Impressum. It still contains placeholders for certain legally required details (e.g. legal form, commercial register number, VAT ID) and has not yet been separately reviewed by legal counsel. The German version remains the legally binding text."
      sections={[
        {
          heading: "Information Pursuant to § 5 TMG (German Telemedia Act)",
          content: (
            <>
              <p>
                {legalFieldOrPlaceholderEn(
                  legalInfo.companyName,
                  "Full company name"
                )}{" "}
                {legalFieldOrPlaceholderEn(legalInfo.legalForm, "Legal form")}
              </p>
              <p>{siteConfig.contact.address}</p>
            </>
          ),
        },
        {
          heading: "Represented By",
          content: (
            <p>
              {legalFieldOrPlaceholderEn(
                legalInfo.managingDirector,
                "Name of the managing director or authorized representative"
              )}
            </p>
          ),
        },
        {
          heading: "Contact",
          content: (
            <>
              <p>Phone: {siteConfig.contact.phone}</p>
              <p>Email: {siteConfig.contact.email}</p>
            </>
          ),
        },
        {
          heading: "Register Entry",
          content: (
            <p>
              Register court:{" "}
              {legalFieldOrPlaceholderEn(
                legalInfo.registerCourt,
                "Register court, if applicable"
              )}
              <br />
              Register number:{" "}
              {legalFieldOrPlaceholderEn(
                legalInfo.registerNumber,
                "Register number, if applicable"
              )}
            </p>
          ),
        },
        {
          heading: "VAT Identification Number",
          content: (
            <p>
              VAT identification number pursuant to Section 27a of the
              German VAT Act (Umsatzsteuergesetz):{" "}
              {legalFieldOrPlaceholderEn(
                legalInfo.vatId,
                "VAT ID, if available"
              )}
            </p>
          ),
        },
        {
          heading: "EU Dispute Resolution",
          content: (
            <p>
              The European Commission provides a platform for online
              dispute resolution (ODR):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-primary-600 hover:text-primary-700"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Our email address can be found above in this Imprint. We are
              not obligated and generally not willing to participate in
              dispute resolution proceedings before a consumer arbitration
              board.
            </p>
          ),
        },
        {
          heading: "Liability for Content",
          content: (
            <p>
              As a service provider, we are responsible for our own content
              on these pages in accordance with general laws pursuant to
              Section 7 (1) of the German Telemedia Act (TMG). However,
              pursuant to Sections 8 to 10 TMG, we as a service provider are
              not obligated to monitor transmitted or stored third-party
              information or to investigate circumstances that indicate
              illegal activity. Obligations to remove or block the use of
              information under general law remain unaffected by this.
            </p>
          ),
        },
        {
          heading: "Liability for Links",
          content: (
            <p>
              Our website may contain links to external third-party
              websites over whose content we have no influence. Therefore,
              we cannot accept any liability for this external content. The
              respective provider or operator of the linked pages is always
              responsible for their content.
            </p>
          ),
        },
        {
          heading: "Copyright",
          content: (
            <p>
              The content and works created by the site operators on these
              pages are subject to German copyright law. Contributions by
              third parties are identified as such. Reproduction, editing,
              distribution, and any type of use beyond the scope of
              copyright law require the written consent of the respective
              author or creator.
            </p>
          ),
        },
      ]}
    />
  );
}
