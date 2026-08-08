"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/use-locale";

// The root <html lang="de"> is static (set once in app/layout.tsx) because
// the whole site is statically generated. This corrects it client-side on
// English routes so assistive tech and language-aware tooling get the right
// value after hydration, without forcing the app into dynamic rendering.
export function LocaleHtmlSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
