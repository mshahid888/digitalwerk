"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const fieldClasses =
  "w-full rounded-md border border-primary-200 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

type SubmitState = "idle" | "sending" | "sent" | "sent-via-mailto";

function buildMailtoUrl(
  name: string,
  email: string,
  phone: string,
  message: string
): string {
  const subject = `Anfrage von ${name}`;
  const body = [
    `Name: ${name}`,
    `E-Mail: ${email}`,
    phone ? `Telefon: ${phone}` : null,
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
export function ContactForm() {
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
    } catch {
      window.location.href = buildMailtoUrl(name, email, phone, message);
      setState("sent-via-mailto");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-primary-900"
        >
          Name *
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
          E-Mail *
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
          Telefon (optional)
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
          Nachricht *
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
        disabled={state === "sending"}
      >
        {state === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </Button>

      <p className="text-xs text-slate-500" role="status">
        {state === "sent" &&
          "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet."}
        {state === "sent-via-mailto" &&
          "Ihr E-Mail-Programm öffnet sich mit den ausgefüllten Angaben — bitte senden Sie die E-Mail von dort aus ab."}
        {(state === "idle" || state === "sending") &&
          "Beim Absenden versuchen wir, Ihre Nachricht direkt zu übermitteln — falls das nicht möglich ist, öffnet sich stattdessen Ihr E-Mail-Programm."}
      </p>
    </form>
  );
}
