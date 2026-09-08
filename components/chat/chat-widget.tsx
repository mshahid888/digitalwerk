"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { MessageCircle, X, Send, RotateCcw, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/use-locale";
import { chatStrings } from "./strings";
import { useChat } from "./use-chat";

// Native part of the DigitalWerk site: a launcher button bottom-right that
// opens a panel. No auto-open, no interstitial, no aggressive popup — the
// visitor chooses to open it. Matches the site's primary/accent palette,
// rounded-card radius, shadow-card elevation and Geist type.

export function ChatWidget() {
  const locale = useLocale();
  const t = chatStrings(locale);
  const [open, setOpen] = useState(false);
  const chat = useChat(locale);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const headingId = useId();

  const openPanel = useCallback(() => {
    setOpen(true);
    void chat.ensureSession();
  }, [chat]);

  // Focus the input when the panel opens; return focus is handled by the
  // launcher staying in the DOM.
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the transcript scrolled to the latest message.
  useEffect(() => {
    if (open && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [chat.messages, open]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setDraft("");
    void chat.send(value);
  };

  const busy = chat.status === "sending" || chat.status === "starting";
  const showSuggestions =
    chat.messages.filter((m) => m.role === "user").length === 0 &&
    chat.status !== "error";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          aria-label={t.launcherLabel}
          className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lifted transition-transform duration-200 hover:scale-105 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-card border border-primary-100 bg-white shadow-lifted sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[24rem] sm:max-h-[min(38rem,85vh)]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-primary-100 bg-primary-50 px-4 py-3">
            <div>
              <h2
                id={headingId}
                className="text-sm font-semibold text-primary-900"
              >
                {t.title}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.closeLabel}
              className="-mr-1 -mt-1 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-primary-100 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <p className="border-b border-primary-100 bg-white px-4 py-2 text-[11px] leading-snug text-slate-500">
            {t.aiDisclosure}
          </p>

          <div
            ref={logRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-atomic="false"
          >
            {chat.status === "starting" && chat.messages.length === 0 && (
              <p className="text-sm text-slate-400">{t.starting}</p>
            )}

            {chat.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary-600 text-white"
                    : "mr-auto bg-primary-50 text-primary-950",
                )}
              >
                {m.content}
              </div>
            ))}

            {chat.status === "sending" && (
              <div className="mr-auto flex gap-1 rounded-2xl bg-primary-50 px-3.5 py-3">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400 [animation-delay:300ms]" />
              </div>
            )}

            {chat.status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {t.errorGeneric}{" "}
                <button
                  type="button"
                  onClick={() => void chat.ensureSession()}
                  className="font-semibold underline"
                >
                  {t.errorRetry}
                </button>
              </div>
            )}

            {showSuggestions && chat.status === "ready" && (
              <ul className="space-y-1.5 pt-1">
                {t.suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void chat.send(s)}
                      className="w-full rounded-lg border border-primary-100 bg-white px-3 py-2 text-left text-xs text-primary-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-primary-100 bg-white px-4 pb-3 pt-2">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => void chat.requestHuman()}
                disabled={chat.handoffActive}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 transition-colors hover:text-primary-900 disabled:text-slate-400"
              >
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                {chat.handoffActive ? t.humanConfirm : t.humanButton}
              </button>
              {chat.messages.length > 1 && (
                <button
                  type="button"
                  onClick={chat.restart}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-600"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  {t.restart}
                </button>
              )}
            </div>

            <form onSubmit={onSubmit} className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                {t.inputPlaceholder}
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t.inputPlaceholder}
                autoComplete="off"
                disabled={chat.limitReached}
                maxLength={4000}
                className="min-w-0 flex-1 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-slate-50"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim() || chat.limitReached}
                aria-label={t.send}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <p className="mt-2 text-[10px] leading-snug text-slate-400">
              {t.privacyNote}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
