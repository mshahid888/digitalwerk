"use client";

import { useState, type FormEvent } from "react";
import { Check, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/components/analytics/track-event";

const fieldClasses =
  "w-full rounded-md border border-primary-200 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

type SubmitState = "idle" | "sending" | "sent" | "sent-via-mailto";
type Locale = "de" | "en";

const STRINGS: Record<Locale, Record<string, string>> = {
  de: {
    nameLabel: "Name *",
    emailLabel: "E-Mail *",
    phoneLabel: "Telefon (optional)",
    messageLabel: "Nachricht *",
    sending: "Wird gesendet …",
    send: "Nachricht senden",
    sentButton: "Gesendet",
    sent: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
    sentViaMailto:
      "Ihr E-Mail-Programm öffnet sich mit den ausgefüllten Angaben — bitte senden Sie die E-Mail von dort aus ab.",
    idleHelper:
      "Beim Absenden versuchen wir, Ihre Nachricht direkt zu übermitteln — falls das nicht möglich ist, öffnet sich stattdessen Ihr E-Mail-Programm.",
    mailtoSubject: "Anfrage von",
    mailtoName: "Name",
    mailtoEmail: "E-Mail",
    mailtoPhone: "Telefon",
  },
  en: {
    nameLabel: "Name *",
    emailLabel: "Email *",
    phoneLabel: "Phone (optional)",
    messageLabel: "Message *",
    sending: "Sending…",
    send: "Send message",
    sentButton: "Sent",
    sent: "Thank you! Your message was sent successfully.",
    sentViaMailto:
      "Your email program will open with your details filled in — please send the email from there.",
    idleHelper:
      "When you submit, we try to deliver your message directly — if that isn't possible, your email program opens instead.",
    mailtoSubject: "Inquiry from",
    mailtoName: "Name",
    mailtoEmail: "Email",
    mailtoPhone: "Phone",
  },
};

function buildMailtoUrl(
  strings: Record<string, string>,
  name: string,
  email: string,
  phone: string,
  message: string
): string {
  const subject = `${strings.mailtoSubject} ${name}`;
  const body = [
    `${strings.mailtoName}: ${name}`,
    `${strings.mailtoEmail}: ${email}`,
    phone ? `${strings.mailtoPhone}: ${phone}` : null,
    "",
    message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

// Tries server-side delivery via app/api/kontakt/route.ts first. That route
// returns a non-ok response until RESEND_API_KEY is configured, in which
// case this falls back to the mailto: link — today, with no key set, every
// submission takes the fallback path, identical to the previous behavior.
export function ContactForm({ locale = "de" }: { locale?: Locale }) {
  const t = STRINGS[locale];
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");

    setState("sending");

    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("contact-api-unavailable");
      }

      form.reset();
      setState("sent");
      trackEvent("generate_lead", { method: "contact_form" });
    } catch {
      window.location.href = buildMailtoUrl(t, name, email, phone, message);
      setState("sent-via-mailto");
      trackEvent("generate_lead", { method: "contact_form_mailto_fallback" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-primary-900"
        >
          {t.nameLabel}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={fieldClasses}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-primary-900"
        >
          {t.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClasses}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-primary-900"
        >
          {t.phoneLabel}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={fieldClasses}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-primary-900"
        >
          {t.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={fieldClasses}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={state === "sending" || state === "sent"}
      >
        {state === "sent" ? (
          <>
            <Check className="h-5 w-5" aria-hidden="true" />
            {t.sentButton}
          </>
        ) : state === "sending" ? (
          t.sending
        ) : (
          t.send
        )}
      </Button>

      {state === "sent" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-accent-200 bg-accent-50 p-4 text-sm font-medium text-accent-900"
        >
          <CircleCheck
            className="h-5 w-5 shrink-0 text-accent-600"
            aria-hidden="true"
          />
          <span>{t.sent}</span>
        </div>
      ) : (
        <p className="text-xs text-slate-500" role="status">
          {state === "sent-via-mailto" && t.sentViaMailto}
          {(state === "idle" || state === "sending") && t.idleHelper}
        </p>
      )}
    </form>
  );
}
