"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n-routes";
import { trackEvent } from "@/components/analytics/track-event";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Status = "idle" | "starting" | "ready" | "sending" | "error";

type SessionResponse = { sessionId: string; language: Locale; greeting: string };
type MessageResponse = {
  reply: string;
  language: Locale;
  handoffRequested: boolean;
  messageCount: number;
  limitReached: boolean;
};

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `m${messageCounter}-${Date.now().toString(36)}`;
}

export function useChat(locale: Locale) {
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [handoffActive, setHandoffActive] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (sessionIdRef.current) return sessionIdRef.current;
    setStatus("starting");
    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      if (!res.ok) throw new Error(`session ${res.status}`);
      const data = (await res.json()) as SessionResponse;
      sessionIdRef.current = data.sessionId;
      setMessages([{ id: nextId(), role: "assistant", content: data.greeting }]);
      setStatus("ready");
      trackEvent("chat_session_started", { locale });
      return data.sessionId;
    } catch {
      setStatus("error");
      return null;
    }
  }, [locale]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "sending" || status === "starting") return;

      const sessionId = await ensureSession();
      if (!sessionId) return;

      const userMessage: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMessage]);
      setStatus("sending");

      try {
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, message: trimmed, locale }),
        });
        if (!res.ok) throw new Error(`message ${res.status}`);
        const data = (await res.json()) as MessageResponse;
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", content: data.reply },
        ]);
        if (data.handoffRequested && !handoffActive) {
          setHandoffActive(true);
          trackEvent("chat_handoff", { locale });
        }
        if (data.limitReached) setLimitReached(true);
        setStatus("ready");
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content:
              locale === "en"
                ? "Sorry — I couldn't send that. Please try again."
                : "Entschuldigung – das konnte ich nicht senden. Bitte versuchen Sie es erneut.",
          },
        ]);
        setStatus("error");
      }
    },
    [status, ensureSession, locale, handoffActive],
  );

  const requestHuman = useCallback(async () => {
    const sessionId = await ensureSession();
    if (!sessionId) return;
    try {
      const res = await fetch("/api/chat/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, reason: "visitor_requested" }),
      });
      if (!res.ok) throw new Error(`handoff ${res.status}`);
      const data = (await res.json()) as { message: string };
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: data.message },
      ]);
      setHandoffActive(true);
      trackEvent("chat_handoff", { locale, source: "button" });
    } catch {
      /* non-fatal — the visitor can keep chatting */
    }
  }, [ensureSession, locale]);

  const restart = useCallback(() => {
    sessionIdRef.current = null;
    setMessages([]);
    setHandoffActive(false);
    setLimitReached(false);
    setStatus("idle");
  }, []);

  return {
    status,
    messages,
    handoffActive,
    limitReached,
    ensureSession,
    send,
    requestHuman,
    restart,
  };
}
