import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/legal-page";
import { legalFieldOrPlaceholder, legalInfo, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata(
  {
    title: "Datenschutzerklärung",
    description:
      "Informationen zum Umgang mit personenbezogenen Daten auf dieser Website.",
    robots: { index: false, follow: true },
  },
  "/datenschutz"
);

export default function Page() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      notice="Diese Datenschutzerklärung wurde auf Basis der aktuellen technischen Umsetzung dieser Website erstellt. Bitte ergänzen Sie die als Platzhalter gekennzeichneten Angaben (z. B. vollständiger Firmenname und Anschrift, ggf. Datenschutzbeauftragter) und lassen Sie den Inhalt vor Veröffentlichung rechtlich prüfen."
      sections={[
        {
          heading: "1. Verantwortlicher",
          content: (
            <>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website
                ist:
              </p>
              <p>
                {legalFieldOrPlaceholder(
                  legalInfo.companyName,
                  "Vollständiger Firmenname"
                )}{" "}
                {legalFieldOrPlaceholder(legalInfo.legalForm, "Rechtsform")}
                <br />
                {siteConfig.contact.address}
              </p>
              <p>
                E-Mail: {siteConfig.contact.email}
                <br />
                Weitere Angaben finden Sie im{" "}
                <Link
                  href="/impressum"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Impressum
                </Link>
                .
              </p>
              <p className="text-sm text-slate-500">
                Ein Datenschutzbeauftragter ist derzeit nicht benannt und
                wird ergänzt, sofern dies gesetzlich erforderlich ist.
              </p>
            </>
          ),
        },
        {
          heading: "2. Grundsätze der Datenverarbeitung",
          content: (
            <p>
              Wir verarbeiten personenbezogene Daten nur im erforderlichen
              Umfang und auf Grundlage der gesetzlichen Bestimmungen der
              Datenschutz-Grundverordnung (DSGVO) und des
              Bundesdatenschutzgesetzes (BDSG). Diese Website ist bewusst
              schlank aufgebaut: Aktuell werden keine Analyse-Tools,
              Werbe-Pixel oder vergleichbare Tracking-Dienste eingesetzt.
            </p>
          ),
        },
        {
          heading: "3. Hosting und Server-Logfiles",
          content: (
            <p>
              Wie bei jedem Website-Aufruf üblich, werden beim Zugriff auf
              unsere Website automatisch Informationen durch Ihren Browser
              an den Server übermittelt (z. B. IP-Adresse, Datum und
              Uhrzeit, aufgerufene Seite, verwendeter Browser). Details zum
              Hosting-Anbieter, zur Speicherdauer und zur genauen
              Rechtsgrundlage hängen vom final gewählten Hosting-Anbieter ab
              und werden hier ergänzt, sobald dieser feststeht.
            </p>
          ),
        },
        {
          heading: "4. Kontaktformular",
          content: (
            <p>
              Unser Kontaktformular öffnet beim Absenden Ihr lokales
              E-Mail-Programm mit einer vorausgefüllten Nachricht an{" "}
              {siteConfig.contact.email}. Die eingegebenen Daten werden dabei
              nicht an einen Server dieser Website übertragen oder dort
              gespeichert – die Übermittlung erfolgt ausschließlich über Ihr
              eigenes E-Mail-Programm, sobald Sie die E-Mail von dort aus
              versenden. Sollte künftig eine serverseitige Formularverarbeitung
              eingeführt werden, wird dieser Abschnitt entsprechend
              aktualisiert.
            </p>
          ),
        },
        {
          heading: "5. Cookies",
          content: (
            <p>
              Diese Website setzt aktuell keine Cookies zu Analyse-,
              Marketing- oder Tracking-Zwecken ein. Details und der jeweils
              aktuelle Stand sind in unserer{" "}
              <Link
                href="/cookie-richtlinie"
                className="text-primary-600 hover:text-primary-700"
              >
                Cookie-Richtlinie
              </Link>{" "}
              zusammengefasst.
            </p>
          ),
        },
        {
          heading: "6. Externe Links und Dienste",
          content: (
            <p>
              Unsere Website enthält einen Link zu WhatsApp (Meta Platforms
              Ireland Ltd.). Beim Klick auf diesen Link verlassen Sie unsere
              Website und werden zu WhatsApp weitergeleitet. Für die dortige
              Verarbeitung Ihrer Daten ist WhatsApp bzw. Meta verantwortlich;
              es gilt die Datenschutzerklärung von WhatsApp/Meta. Erst mit
              dem Klick auf den Link findet eine Verbindung zu diesem Dienst
              statt.
            </p>
          ),
        },
        {
          heading: "7. Schriftarten",
          content: (
            <p>
              Diese Website verwendet die Schriftart „Geist“, die lokal über
              unseren eigenen Server bzw. den Server unseres Hosting-Anbieters
              ausgeliefert wird. Es findet keine Verbindung zu externen
              Font-Anbietern (z. B. Google Fonts) statt, wodurch beim
              Laden der Schriftarten keine Daten an Dritte übertragen
              werden.
            </p>
          ),
        },
        {
          heading: "8. Ihre Rechte als betroffene Person",
          content: (
            <>
              <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf:</p>
              <ul className="list-disc pl-5">
                <li>Auskunft über Ihre gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Datenverarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
              </ul>
            </>
          ),
        },
        {
          heading: "9. Änderungen dieser Datenschutzerklärung",
          content: (
            <p>
              Wir passen diese Datenschutzerklärung an, sobald sich unser
              Website-Angebot ändert – etwa durch die Einbindung von
              Analyse-Tools, Werbe-Pixeln, einer Kartenansicht oder einer
              serverseitigen Formularverarbeitung.
            </p>
          ),
        },
      ]}
    />
  );
}
