"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRoutePair } from "@/lib/i18n-routes";
import { useLocale } from "@/lib/use-locale";

// Two plain links rather than a custom widget: keyboard/screen-reader
// behavior comes for free, and the active language is a non-link with
// aria-current so it isn't announced as a pointless "link to this page".
export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const pair = getRoutePair(pathname);

  return (
    <div
      className="flex items-center gap-1 text-sm font-medium"
      aria-label="Sprache wählen / Choose language"
    >
      {locale === "de" ? (
        <span aria-current="true" className="text-primary-900">
          DE
        </span>
      ) : (
        <Link
          href={pair.de}
          className="text-slate-400 transition-colors hover:text-primary-600"
        >
          DE
        </Link>
      )}
      <span aria-hidden="true" className="text-slate-300">
        |
      </span>
      {locale === "en" ? (
        <span aria-current="true" className="text-primary-900">
          EN
        </span>
      ) : (
        <Link
          href={pair.en}
          className="text-slate-400 transition-colors hover:text-primary-600"
        >
          EN
        </Link>
      )}
    </div>
  );
}
