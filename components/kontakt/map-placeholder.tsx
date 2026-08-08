import { MapPin } from "lucide-react";

export function MapPlaceholder() {
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
