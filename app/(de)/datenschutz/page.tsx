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
      notice="Diese Datenschutzerklärung wurde auf Basis der aktuellen technischen Umsetzung dieser Website erstellt. Bitte ergänzen Sie die als Platzhalter gekennzeichneten Angaben (z. B. Rechtsform, ggf. Datenschutzbeauftragter), vervollständigen Sie die Angaben zu Hosting und Auftragsverarbeitern (Abschnitt 3 und 5) und lassen Sie den Inhalt – insbesondere den Abschnitt zum KI-Chat-Assistenten – vor Veröffentlichung rechtlich prüfen."
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
              aktualisiert. Für die separate Verarbeitung im KI-Chat-Assistenten
              siehe Abschnitt 5.
            </p>
          ),
        },
        {
          heading: "5. KI-Chat-Assistent auf dieser Website",
          content: (
            <>
              <p className="rounded-lg border border-accent-200 bg-accent-50 p-4 text-sm text-accent-900">
                Hinweis: Dieser Abschnitt beschreibt die technische Umsetzung
                des KI-Chat-Assistenten. Der Assistent ist eine
                Vorabversion. Vor einer Veröffentlichung mit aktiver
                Datenspeicherung oder Anbindung eines externen KI-Dienstes
                sind die Rechtsgrundlagen, die konkret eingesetzten
                Auftragsverarbeiter (KI-Anbieter, Hosting, E-Mail-Versand,
                Datenbank) sowie ein etwaiger Drittlandtransfer rechtlich zu
                prüfen und hier namentlich zu ergänzen.
              </p>
              <p>
                Diese Website bietet einen KI-gestützten Chat-Assistenten an.
                Der Assistent ist ein KI-System und kein Mitarbeiter. Er
                beantwortet Fragen zu DigitalWerk, hilft dabei, ein Anliegen
                einzuordnen, und kann das Gespräch an das Team von DigitalWerk
                übergeben.
              </p>
              <p>
                <strong>Verarbeitete Daten:</strong> die von Ihnen im Chat
                eingegebenen Nachrichten sowie technische Sitzungsdaten (z. B.
                eine zufällige Sitzungskennung, Zeitstempel, erkannte Sprache).
                Wenn Sie im Gespräch freiwillig Kontakt- oder
                Unternehmensangaben machen (z. B. Name, Unternehmen,
                E-Mail-Adresse, Ihr Anliegen), werden diese für die Bearbeitung
                Ihrer Anfrage gespeichert. Bitte geben Sie keine besonderen
                Kategorien personenbezogener Daten (Art. 9 DSGVO) in den Chat
                ein.
              </p>
              <p>
                <strong>Zwecke:</strong> Beantwortung Ihrer Fragen, Einordnung
                Ihres Anliegens, Vorbereitung und Durchführung einer
                Kontaktaufnahme durch das Team von DigitalWerk.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an der Beantwortung von Anfragen und an
                der effizienten Anbahnung von Geschäftsbeziehungen) sowie, wenn
                die Kommunikation auf die Anbahnung oder Durchführung eines
                Vertrags gerichtet ist, Art. 6 Abs. 1 lit. b DSGVO. Die
                endgültige Festlegung der Rechtsgrundlagen erfolgt im Rahmen der
                rechtlichen Prüfung.
              </p>
              <p>
                <strong>Speicherdauer:</strong> Die für die Lead-Bearbeitung
                erforderlichen Angaben (Kontaktdaten, Unternehmensangaben,
                Anliegen, Zusammenfassung des Gesprächs, interne
                Einstufung, Zeitstempel) werden so lange gespeichert, wie es
                für die Bearbeitung und die anschließende Geschäftsbeziehung
                erforderlich ist, und anschließend gelöscht bzw. gesperrt.
                Vollständige Gesprächsverläufe (Rohtranskripte) werden – sofern
                sie für Betrieb und Fehleranalyse überhaupt gespeichert werden
                – nach spätestens 30 Tagen automatisch gelöscht. Die
                dauerhafte Lead-Akte bleibt davon unberührt.
              </p>
              <p>
                <strong>Empfänger / Auftragsverarbeiter:</strong> Die
                serverseitigen Komponenten laufen auf der Hosting-Infrastruktur
                dieser Website (siehe Abschnitt 3). Sofern eine Datenbank zur
                Speicherung sowie ein Dienst zum E-Mail-Versand von
                Benachrichtigungen an das Team eingesetzt werden, handelt es
                sich um Auftragsverarbeiter im Sinne des Art. 28 DSGVO; die
                jeweiligen Anbieter werden hier ergänzt, sobald sie
                feststehen. Für die Erzeugung der Antworten kann ein externer
                KI-Dienst eingesetzt werden; auch dieser Anbieter, die
                Rechtsgrundlage einer Übermittlung und ein etwaiger
                Drittlandtransfer werden vor einer produktiven Nutzung hier
                benannt. Bis dahin arbeitet der Assistent ohne Anbindung eines
                externen KI-Dienstes.
              </p>
              <p>
                <strong>Ihre Rechte:</strong> Es gelten die in Abschnitt 9
                genannten Betroffenenrechte. Für Auskunft oder Löschung Ihrer
                im Chat verarbeiteten Daten genügt eine formlose Nachricht an{" "}
                {siteConfig.contact.email}.
              </p>
            </>
          ),
        },
        {
          heading: "6. Cookies",
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
          heading: "7. Externe Links und Dienste",
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
          heading: "8. Schriftarten",
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
          heading: "9. Ihre Rechte als betroffene Person",
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
          heading: "10. Änderungen dieser Datenschutzerklärung",
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
