// Fires a GA4 event via the global gtag() function that analytics.tsx's
// GA4 script sets up. No-ops safely if GA4 isn't loaded (env var unset,
// script still loading, consent not yet granted, etc.) — this is a
// best-effort signal, not a blocking dependency.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
