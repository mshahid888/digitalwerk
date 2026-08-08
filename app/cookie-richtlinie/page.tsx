import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = buildMetadata({
  title: "Cookie-Richtlinie",
  description:
    "Informationen darüber, welche Cookies und ähnliche Technologien diese Website aktuell verwendet.",
  robots: { index: false, follow: true },
});

export default function Page() {
  return (
    <LegalPage
      title="Cookie-Richtlinie"
      notice="Diese Seite beschreibt den aktuellen technischen Stand unserer Website. Sie wird aktualisiert, sobald weitere Dienste wie Analyse-Tools, Werbe-Pixel oder eine Kartenansicht eingebunden werden."
      sections={[
        {
          heading: "Was sind Cookies?",
          content: (
            <p>
              Cookies sind kleine Textdateien, die beim Besuch einer Website
              auf Ihrem Gerät gespeichert werden können, um Informationen
              zwischen einzelnen Seitenaufrufen zu speichern oder
              wiederzuerkennen.
            </p>
          ),
        },
        {
          heading: "Aktueller Stand auf dieser Website",
          content: (
            <p>
              Diese Website setzt derzeit keine Cookies zu Analyse-,
              Marketing- oder Tracking-Zwecken ein. Es erfolgt aktuell auch
              keine Einbindung von Google Analytics, Werbe-Pixeln (z. B. von
              Google oder Meta), einer Kartenansicht oder vergleichbaren
              Diensten, die Cookies setzen würden.
            </p>
          ),
        },
        {
          heading: "Was sich künftig ändert",
          content: (
            <p>
              Sobald wir Tools wie Google Analytics, Google Maps,
              Werbe-Pixel oder ähnliche Dienste einbinden, aktualisieren wir
              diese Seite entsprechend und führen – soweit gesetzlich
              erforderlich – einen Cookie-Consent-Banner ein, über den Sie
              Ihre Einwilligung erteilen oder jederzeit widerrufen können.
            </p>
          ),
        },
        {
          heading: "Externe Dienste per Link",
          content: (
            <p>
              Unsere Website enthält einen Link zu WhatsApp. Erst wenn Sie
              diesen Link aktiv anklicken, verlassen Sie unsere Website und
              es können durch WhatsApp bzw. Meta eigene Cookies gesetzt
              werden. Näheres dazu finden Sie in unserer{" "}
              <Link
                href="/datenschutz"
                className="text-primary-600 hover:text-primary-700"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Cookies über Ihren Browser verwalten",
          content: (
            <p>
              Sie können die Speicherung von Cookies in Ihrem Browser
              jederzeit einschränken oder bereits vorhandene Cookies löschen.
              Weitere Informationen dazu finden Sie in der Hilfe-Funktion
              Ihres Browsers.
            </p>
          ),
        },
      ]}
    />
  );
}
