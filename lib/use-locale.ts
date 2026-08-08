"use client";

import { usePathname } from "next/navigation";
import { isEnglishPath, type Locale } from "./i18n-routes";

// The site has no server-side signal for the current locale without giving
// up static generation (reading the request path in the root layout forces
// the whole app to render dynamically). Reading it client-side here is the
// trade-off: German pages keep rendering statically, English chrome
// (nav/footer copy) resolves on hydration.
export function useLocale(): Locale {
  const pathname = usePathname();
  return isEnglishPath(pathname) ? "en" : "de";
}
