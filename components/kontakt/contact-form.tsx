"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const fieldClasses =
  "w-full rounded-md border border-primary-200 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");

    const subject = `Anfrage von ${name}`;
    const body = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Nachricht senden
      </Button>

      <p className="text-xs text-slate-500" role="status">
        {submitted
          ? "Ihr E-Mail-Programm öffnet sich mit den ausgefüllten Angaben — bitte senden Sie die E-Mail von dort aus ab."
          : "Beim Absenden öffnet sich Ihr E-Mail-Programm mit den ausgefüllten Angaben."}
      </p>
    </form>
  );
}
