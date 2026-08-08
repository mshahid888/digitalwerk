import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type Locale = "de" | "en";

const STRINGS: Record<Locale, { title: string; body: string; embedTitle: string }> = {
  de: {
    title: "Anfahrtskarte folgt in Kürze",
    body: "Sobald unsere endgültige Adresse feststeht, integrieren wir hier eine interaktive Google-Maps-Ansicht.",
    embedTitle: `Anfahrt zu ${siteConfig.name}`,
  },
  en: {
    title: "Map coming soon",
    body: "Once our final address is confirmed, we'll add an interactive Google Maps view here.",
    embedTitle: `Directions to ${siteConfig.name}`,
  },
};

// Once siteConfig.contact.address is the real, confirmed business address,
// flip siteConfig.contact.addressConfirmed to true — this then renders an
// interactive embed automatically. Uses Google's keyless "output=embed" URL
// format, so no Maps API key is required for this implementation.
export function MapPlaceholder({ locale = "de" }: { locale?: Locale }) {
  const t = STRINGS[locale];

  if (siteConfig.contact.addressConfirmed) {
    return (
      <iframe
        title={t.embedTitle}
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          siteConfig.contact.address
        )}&output=embed`}
        className="h-64 w-full rounded-card border border-primary-200 md:h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-primary-200 bg-primary-50 px-6 text-center md:h-80">
      <MapPin className="h-8 w-8 text-primary-400" aria-hidden="true" />
      <p className="text-sm font-medium text-primary-700">{t.title}</p>
      <p className="max-w-sm text-xs text-slate-500">{t.body}</p>
    </div>
  );
}
