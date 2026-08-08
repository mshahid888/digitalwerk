import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/legal-page";
import { legalFieldOrPlaceholder, legalInfo, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata(
  {
    title: "Impressum",
    description: "Rechtliche Angaben gemäß § 5 TMG.",
    robots: { index: false, follow: true },
  },
  "/impressum"
);

export default function Page() {
  return (
    <LegalPage
      title="Impressum"
      notice="Diese Seite enthält Platzhalter für gesetzlich vorgeschriebene Angaben. Bitte ergänzen Sie die als Platzhalter gekennzeichneten Informationen (z. B. vollständiger Firmenname, Rechtsform, Geschäftsführung, Handelsregisternummer, USt-IdNr.) und lassen Sie den Inhalt vor Veröffentlichung rechtlich prüfen."
      sections={[
        {
          heading: "Angaben gemäß § 5 TMG",
          content: (
            <>
              <p>
                {legalFieldOrPlaceholder(
                  legalInfo.companyName,
                  "Vollständiger Firmenname"
                )}{" "}
                {legalFieldOrPlaceholder(legalInfo.legalForm, "Rechtsform")}
              </p>
              <p>
                {siteConfig.contact.address}
                <br />
                <span className="text-sm text-slate-500">
                  (Platzhalteradresse – bitte durch die tatsächliche
                  Geschäftsadresse ersetzen)
                </span>
              </p>
            </>
          ),
        },
        {
          heading: "Vertreten durch",
          content: (
            <>
              <p>
                {legalFieldOrPlaceholder(
                  legalInfo.managingDirector,
                  "Name der Geschäftsführung bzw. des/der vertretungsberechtigten Inhaber:in"
                )}
              </p>
              {legalInfo.managingDirector ? (
                <p className="text-sm text-slate-500">
                  (Bislang liegt nur ein Nachname vor – dies ist noch nicht
                  der vollständige rechtliche Name. Bitte um Vornamen und
                  ggf. weitere erforderliche Angaben ergänzen, bevor diese
                  Seite veröffentlicht wird.)
                </p>
              ) : null}
            </>
          ),
        },
        {
          heading: "Kontakt",
          content: (
            <>
              <p>
                Telefon: {siteConfig.contact.phone}{" "}
                <span className="text-sm text-slate-500">
                  (Platzhalter – bitte durch die tatsächliche Telefonnummer
                  ersetzen)
                </span>
              </p>
              <p>E-Mail: {siteConfig.contact.email}</p>
            </>
          ),
        },
        {
          heading: "Registereintrag",
          content: (
            <p>
              Registergericht:{" "}
              {legalFieldOrPlaceholder(
                legalInfo.registerCourt,
                "Registergericht, sofern zutreffend"
              )}
              <br />
              Registernummer:{" "}
              {legalFieldOrPlaceholder(
                legalInfo.registerNumber,
                "Registernummer, sofern zutreffend"
              )}
            </p>
          ),
        },
        {
          heading: "Umsatzsteuer-Identifikationsnummer",
          content: (
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a
              Umsatzsteuergesetz:{" "}
              {legalFieldOrPlaceholder(
                legalInfo.vatId,
                "USt-IdNr., sofern vorhanden"
              )}
            </p>
          ),
        },
        {
          heading: "EU-Streitschlichtung",
          content: (
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-primary-600 hover:text-primary-700"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben in diesem Impressum. Wir
              sind nicht verpflichtet und grundsätzlich nicht bereit, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          ),
        },
        {
          heading: "Haftung für Inhalte",
          content: (
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
              Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
              hiervon unberührt.
            </p>
          ),
        },
        {
          heading: "Haftung für Links",
          content: (
            <p>
              Unser Angebot enthält gegebenenfalls Links zu externen
              Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr
              übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
              jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          ),
        },
        {
          heading: "Urheberrecht",
          content: (
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge
              Dritter sind als solche gekennzeichnet. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
              der Grenzen des Urheberrechts bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          ),
        },
      ]}
    />
  );
}
