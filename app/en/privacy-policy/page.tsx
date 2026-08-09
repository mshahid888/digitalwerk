import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/legal-page";
import {
  legalFieldOrPlaceholderEn,
  legalInfo,
  siteConfig,
} from "@/lib/site-config";

export const metadata: Metadata = buildMetadata(
  {
    title: "Privacy Policy",
    description:
      "Information on the handling of personal data on this website.",
    robots: { index: false, follow: true },
  },
  "/en/privacy-policy",
  { locale: "en_US" }
);

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      notice="This page is an English translation of the German Datenschutzerklärung, prepared based on the current technical setup of this website. It still contains placeholders for certain details (e.g. legal form, data protection officer if applicable) and has not yet been separately reviewed by legal counsel. The German version remains the legally binding text."
      sections={[
        {
          heading: "1. Controller",
          content: (
            <>
              <p>
                The controller responsible for data processing on this
                website is:
              </p>
              <p>
                {legalFieldOrPlaceholderEn(
                  legalInfo.companyName,
                  "Full company name"
                )}{" "}
                {legalFieldOrPlaceholderEn(legalInfo.legalForm, "Legal form")}
                <br />
                {siteConfig.contact.address}
              </p>
              <p>
                Email: {siteConfig.contact.email}
                <br />
                Further details can be found in the{" "}
                <Link
                  href="/en/imprint"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Imprint
                </Link>
                .
              </p>
              <p className="text-sm text-slate-500">
                A data protection officer has not currently been appointed
                and will be added if legally required.
              </p>
            </>
          ),
        },
        {
          heading: "2. Principles of Data Processing",
          content: (
            <p>
              We process personal data only to the extent necessary and on
              the basis of the statutory provisions of the General Data
              Protection Regulation (GDPR) and the German Federal Data
              Protection Act (BDSG). This website is deliberately kept lean:
              no analytics tools, advertising pixels, or comparable
              tracking services are currently in use.
            </p>
          ),
        },
        {
          heading: "3. Hosting and Server Log Files",
          content: (
            <p>
              As is standard for every website visit, information is
              automatically transmitted to the server by your browser when
              you access our website (e.g. IP address, date and time, page
              accessed, browser used). Details about the hosting provider,
              the storage period, and the exact legal basis depend on the
              hosting provider ultimately selected and will be added here
              once that has been determined.
            </p>
          ),
        },
        {
          heading: "4. Contact Form",
          content: (
            <p>
              Our contact form opens your local email program when
              submitted, with a pre-filled message to{" "}
              {siteConfig.contact.email}. The data you enter is not
              transmitted to or stored on a server of this website —
              transmission occurs exclusively through your own email
              program once you send the email from there. Should
              server-side form processing be introduced in the future,
              this section will be updated accordingly.
            </p>
          ),
        },
        {
          heading: "5. Cookies",
          content: (
            <p>
              This website currently does not use cookies for analytics,
              marketing, or tracking purposes. Details and the current
              status are summarized in our{" "}
              <Link
                href="/en/cookie-policy"
                className="text-primary-600 hover:text-primary-700"
              >
                Cookie Policy
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "6. External Links and Services",
          content: (
            <p>
              Our website contains a link to WhatsApp (Meta Platforms
              Ireland Ltd.). Clicking this link takes you away from our
              website to WhatsApp. WhatsApp/Meta is responsible for data
              processing there; WhatsApp/Meta&apos;s privacy policy applies. A
              connection to this service is only established once you
              click the link.
            </p>
          ),
        },
        {
          heading: "7. Fonts",
          content: (
            <p>
              This website uses the font “Geist”, which is delivered
              locally via our own server or our hosting provider&apos;s
              server. There is no connection to external font providers
              (e.g. Google Fonts), so no data is transmitted to third
              parties when fonts are loaded.
            </p>
          ),
        },
        {
          heading: "8. Your Rights as a Data Subject",
          content: (
            <>
              <p>
                Subject to applicable statutory provisions, you have the
                right at any time to:
              </p>
              <ul className="list-disc pl-5">
                <li>Access to your stored personal data (Art. 15 GDPR)</li>
                <li>Rectification of inaccurate data (Art. 16 GDPR)</li>
                <li>Erasure of your data (Art. 17 GDPR)</li>
                <li>Restriction of processing (Art. 18 GDPR)</li>
                <li>Data portability (Art. 20 GDPR)</li>
                <li>Object to processing (Art. 21 GDPR)</li>
                <li>
                  Lodge a complaint with a supervisory authority (Art. 77
                  GDPR)
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "9. Changes to This Privacy Policy",
          content: (
            <p>
              We will update this Privacy Policy as soon as our website
              offering changes — for example, through the integration of
              analytics tools, advertising pixels, a map view, or
              server-side form processing.
            </p>
          ),
        },
      ]}
    />
  );
}
