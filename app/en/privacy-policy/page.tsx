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
      notice="This page is an English translation of the German Datenschutzerklärung, prepared based on the current technical setup of this website. It still contains placeholders for certain details (e.g. legal form, data protection officer, hosting provider and processors in sections 3 and 5) and has not yet been separately reviewed by legal counsel — in particular the AI chat assistant section. The German version remains the legally binding text."
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
              this section will be updated accordingly. For the separate
              processing in the AI chat assistant, see section 5.
            </p>
          ),
        },
        {
          heading: "5. AI Chat Assistant on This Website",
          content: (
            <>
              <p className="rounded-lg border border-accent-200 bg-accent-50 p-4 text-sm text-accent-900">
                Note: this section describes the technical implementation of
                the AI chat assistant, which is a preview version. Before any
                launch with active data storage or a connected external AI
                service, the legal bases, the specific processors used (AI
                provider, hosting, email delivery, database) and any transfer
                to a third country must be reviewed by legal counsel and named
                here.
              </p>
              <p>
                This website offers an AI-powered chat assistant. The
                assistant is an AI system, not a staff member. It answers
                questions about DigitalWerk, helps categorise an inquiry, and
                can hand the conversation over to the DigitalWerk team.
              </p>
              <p>
                <strong>Data processed:</strong> the messages you enter in the
                chat and technical session data (e.g. a random session
                identifier, timestamps, detected language). If you voluntarily
                provide contact or company details in the conversation (e.g.
                name, company, email address, your inquiry), these are stored
                to process your request. Please do not enter special categories
                of personal data (Art. 9 GDPR) into the chat.
              </p>
              <p>
                <strong>Purposes:</strong> answering your questions,
                categorising your inquiry, preparing and carrying out contact
                by the DigitalWerk team.
              </p>
              <p>
                <strong>Legal basis:</strong> Art. 6(1)(f) GDPR (legitimate
                interest in answering inquiries and efficiently initiating
                business relationships) and, where the communication is aimed
                at entering into or performing a contract, Art. 6(1)(b) GDPR.
                The legal bases will be finalised during the legal review.
              </p>
              <p>
                <strong>Retention:</strong> the full conversation transcript
                (raw transcript) is stored server-side and automatically
                deleted after at most 30 days. The data required for lead
                handling (contact details, company information, inquiry, a
                conversation summary that includes a short verbatim excerpt
                of the most recent messages, internal classification,
                timestamps) is kept as a permanent lead record for as long as
                necessary for processing and the subsequent business
                relationship, and is then deleted or blocked. The specific
                retention period for the lead record and the extent of the
                stored conversation excerpts will be finalised during the
                legal review.
              </p>
              <p>
                <strong>Recipients / processors:</strong> the server-side
                components run on this website&apos;s hosting infrastructure
                (see section 3). Where a database for storage and a service
                for sending notification emails to the team are used, these
                are processors within the meaning of Art. 28 GDPR; the
                respective providers will be added here once determined. An
                external AI service may be used to generate responses; that
                provider, the legal basis for any transfer and any
                third-country transfer will likewise be named here before
                productive use. Until then, the assistant operates without a
                connected external AI service.
              </p>
              <p>
                <strong>Your rights:</strong> the data subject rights listed
                in section 9 apply. An informal message to{" "}
                {siteConfig.contact.email} is sufficient to request access to
                or deletion of the data processed in the chat.
              </p>
            </>
          ),
        },
        {
          heading: "6. Cookies",
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
          heading: "7. External Links and Services",
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
          heading: "8. Fonts",
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
          heading: "9. Your Rights as a Data Subject",
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
          heading: "10. Changes to This Privacy Policy",
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
