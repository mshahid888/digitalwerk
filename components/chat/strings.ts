import type { Locale } from "@/lib/i18n-routes";

// All visitor-facing widget copy. Server-composed agent replies come from
// the API; this is only the chrome.

export type ChatStrings = {
  launcherLabel: string;
  title: string;
  subtitle: string;
  aiDisclosure: string;
  privacyNote: string;
  inputPlaceholder: string;
  send: string;
  sending: string;
  starting: string;
  errorGeneric: string;
  errorRetry: string;
  closeLabel: string;
  humanButton: string;
  humanConfirm: string;
  restart: string;
  suggestions: string[];
  minimize: string;
};

const de: ChatStrings = {
  launcherLabel: "Chat öffnen",
  title: "DigitalWerk Assistent",
  subtitle: "Fragen zu Leistungen, Preisen oder Ihrem Vorhaben",
  aiDisclosure:
    "Dies ist ein KI-Assistent, kein Mitarbeiter. Für verbindliche Auskünfte leiten wir Sie an das Team weiter.",
  privacyNote:
    "Bitte geben Sie keine sensiblen Daten ein. Kontaktdaten nutzen wir nur, um auf Ihre Anfrage zu antworten.",
  inputPlaceholder: "Ihre Nachricht …",
  send: "Senden",
  sending: "Sendet …",
  starting: "Assistent wird geladen …",
  errorGeneric: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  errorRetry: "Erneut versuchen",
  closeLabel: "Chat schließen",
  humanButton: "Mit dem Team sprechen",
  humanConfirm: "Ihr Gespräch wurde an das Team übergeben.",
  restart: "Neu starten",
  suggestions: [
    "Welche Leistungen bietet DigitalWerk?",
    "Was kostet ein KI-Agent?",
    "Wir werden bei Google kaum gefunden.",
  ],
  minimize: "Minimieren",
};

const en: ChatStrings = {
  launcherLabel: "Open chat",
  title: "DigitalWerk Assistant",
  subtitle: "Questions about services, pricing or your project",
  aiDisclosure:
    "This is an AI assistant, not a staff member. For binding information we'll connect you with the team.",
  privacyNote:
    "Please don't enter sensitive data. We use contact details only to reply to your inquiry.",
  inputPlaceholder: "Your message …",
  send: "Send",
  sending: "Sending …",
  starting: "Loading assistant …",
  errorGeneric: "Something went wrong. Please try again.",
  errorRetry: "Try again",
  closeLabel: "Close chat",
  humanButton: "Talk to the team",
  humanConfirm: "Your conversation has been handed to the team.",
  restart: "Restart",
  suggestions: [
    "What services does DigitalWerk offer?",
    "How much does an AI agent cost?",
    "We're barely found on Google.",
  ],
  minimize: "Minimize",
};

export function chatStrings(locale: Locale): ChatStrings {
  return locale === "en" ? en : de;
}
