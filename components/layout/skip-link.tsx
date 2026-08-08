"use client";

import { useLocale } from "@/lib/use-locale";

const LABEL: Record<"de" | "en", string> = {
  de: "Zum Inhalt springen",
  en: "Skip to content",
};

export function SkipLink() {
  const locale = useLocale();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
    >
      {LABEL[locale]}
    </a>
  );
}
