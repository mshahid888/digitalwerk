import type { Language } from "./types";

// Lightweight language detection for DE vs EN. The website is bilingual and
// the widget also passes the current locale as a hint; this handles the
// case where a visitor switches language mid-conversation.

const GERMAN_MARKERS = [
  "ä", "ö", "ü", "ß",
  " der ", " die ", " das ", " und ", " nicht ", " ich ", " wir ", " sie ",
  " ist ", " sind ", " haben ", " unternehmen", " webseite", " website erstellen",
  " kunden", " brauche", " möchte", " können", " würde", " euch", " ihr ",
  "hallo", "guten tag", "danke", "bitte", "wie viel", "was kostet",
];

const ENGLISH_MARKERS = [
  " the ", " and ", " not ", " i ", " we ", " you ", " is ", " are ", " have ",
  " business", " website", " customers", " need ", " want ", " can ", " would ",
  "hello", "hi ", "thanks", "please", "how much", "what does it cost",
];

function count(haystack: string, needles: string[]): number {
  let n = 0;
  for (const needle of needles) {
    let idx = haystack.indexOf(needle);
    while (idx !== -1) {
      n += 1;
      idx = haystack.indexOf(needle, idx + needle.length);
    }
  }
  return n;
}

export function detectLanguage(text: string, fallback: Language = "de"): Language {
  const padded = ` ${text.toLowerCase().trim()} `;
  if (padded.trim().length < 3) return fallback;

  const de = count(padded, GERMAN_MARKERS);
  const en = count(padded, ENGLISH_MARKERS);

  if (de === en) return fallback;
  return de > en ? "de" : "en";
}

// Combine an explicit locale hint (from the widget) with detection on the
// visitor's own words. The visitor's words win once there is a clear signal,
// so a German page visitor who writes in English gets English replies.
export function resolveLanguage(
  text: string,
  localeHint: Language | undefined,
): Language {
  const detected = detectLanguage(text, localeHint ?? "de");
  const padded = ` ${text.toLowerCase().trim()} `;
  const de = count(padded, GERMAN_MARKERS);
  const en = count(padded, ENGLISH_MARKERS);
  const strongSignal = Math.abs(de - en) >= 2;

  if (strongSignal) return detected;
  return localeHint ?? detected;
}
