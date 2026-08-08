"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { primaryNav, primaryNavEn } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ctaLabels, ctaLabelsEn } from "@/lib/site-config";
import { useLocale } from "@/lib/use-locale";
import { ActiveLink } from "./active-link";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const STRINGS = {
  de: {
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    navLabel: "Hauptnavigation",
    contactHref: "/kontakt" as const,
  },
  en: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navLabel: "Main navigation",
    contactHref: "/en/contact" as const,
  },
};

export function MobileNav() {
  const locale = useLocale();
  const items = locale === "en" ? primaryNavEn : primaryNav;
  const cta = locale === "en" ? ctaLabelsEn : ctaLabels;
  const t = STRINGS[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setExpanded(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keeps keyboard focus inside the open dialog (WAI-ARIA dialog pattern):
  // Escape closes it, and Tab/Shift+Tab wrap at the panel's edges instead of
  // escaping into the page content hidden behind the full-screen overlay.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={t.openMenu}
        className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-primary-50"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          ref={panelRef}
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label={t.navLabel}
          className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-white"
        >
          <div className="flex items-center justify-between border-b border-primary-100 px-6 py-4">
            <span className="text-lg font-semibold text-primary-900">
              DigitalWerk
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label={t.closeMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-primary-50"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li
                  key={item.href}
                  className="border-b border-primary-50 last:border-none"
                >
                  {item.children ? (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(expanded === item.href ? null : item.href)
                        }
                        aria-expanded={expanded === item.href}
                        className="flex w-full items-center justify-between py-3 text-left text-base font-medium text-foreground"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-5 w-5 text-primary-400 transition-transform duration-150 ${
                            expanded === item.href ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {expanded === item.href ? (
                        <ul className="flex flex-col gap-1 pb-3 pl-4">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <ActiveLink
                                href={child.href}
                                onClick={close}
                                className="block py-2 text-sm text-primary-700"
                              >
                                {child.label}
                              </ActiveLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <ActiveLink
                      href={item.href}
                      onClick={close}
                      className="block py-3 text-base font-medium text-foreground"
                    >
                      {item.label}
                    </ActiveLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-primary-100 px-6 py-4">
            <Button href={t.contactHref} onClick={close} className="w-full">
              {cta.primary}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
