import { siteConfig } from "@/lib/site-config";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

type ParseResult =
  | { success: true; data: ContactPayload }
  | { success: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseContactPayload(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { success: false, error: "Ungültige Anfrage." };
  }

  const { name, email, phone, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    return { success: false, error: "Bitte geben Sie Ihren Namen an." };
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return {
      success: false,
      error: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
    };
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return {
      success: false,
      error: "Bitte geben Sie eine aussagekräftige Nachricht an.",
    };
  }
  if (phone !== undefined && typeof phone !== "string") {
    return { success: false, error: "Ungültige Telefonnummer." };
  }

  return {
    success: true,
    data: {
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      phone: typeof phone === "string" ? phone.trim().slice(0, 50) : undefined,
      message: message.trim().slice(0, 5000),
    },
  };
}

// Not activated until RESEND_API_KEY is set — ContactForm falls back to
// mailto: automatically when this returns a non-ok response, so leaving
// it unconfigured does not break the form.
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "E-Mail-Versand ist derzeit nicht konfiguriert." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = parseContactPayload(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        to: process.env.CONTACT_TO_EMAIL ?? siteConfig.contact.email,
        reply_to: email,
        subject: `Neue Anfrage von ${name}`,
        text: [
          `Name: ${name}`,
          `E-Mail: ${email}`,
          phone ? `Telefon: ${phone}` : null,
          "",
          message,
        ]
          .filter((line): line is string => line !== null)
          .join("\n"),
      }),
    });

    if (!resendResponse.ok) {
      return Response.json(
        { error: "E-Mail konnte nicht gesendet werden." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "E-Mail konnte nicht gesendet werden." },
      { status: 502 }
    );
  }
}
