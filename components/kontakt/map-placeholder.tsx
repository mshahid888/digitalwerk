import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// Once siteConfig.contact.address is the real, confirmed business address,
// flip siteConfig.contact.addressConfirmed to true — this then renders an
// interactive embed automatically. Uses Google's keyless "output=embed" URL
// format, so no Maps API key is required for this implementation.
export function MapPlaceholder() {
  if (siteConfig.contact.addressConfirmed) {
    return (
      <iframe
        title={`Anfahrt zu ${siteConfig.name}`}
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
      <p className="text-sm font-medium text-primary-700">
        Anfahrtskarte folgt in Kürze
      </p>
      <p className="max-w-sm text-xs text-slate-500">
        Sobald unsere endgültige Adresse feststeht, integrieren wir hier eine
        interaktive Google-Maps-Ansicht.
      </p>
    </div>
  );
}
