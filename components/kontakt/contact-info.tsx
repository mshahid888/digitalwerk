import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type Locale = "de" | "en";

const STRINGS: Record<Locale, Record<string, string>> = {
  de: {
    phone: "Telefon",
    email: "E-Mail",
    address: "Adresse",
    whatsappHint: "Schnelle Antworten direkt über WhatsApp.",
    whatsappCta: "Per WhatsApp schreiben",
  },
  en: {
    phone: "Phone",
    email: "Email",
    address: "Address",
    whatsappHint: "Fast replies directly via WhatsApp.",
    whatsappCta: "Message us on WhatsApp",
  },
};

export function ContactInfo({ locale = "de" }: { locale?: Locale }) {
  const t = STRINGS[locale];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <Phone
          className="mt-1 h-5 w-5 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-primary-900">{t.phone}</p>
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
            className="text-slate-600 hover:text-primary-600"
          >
            {siteConfig.contact.phone}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail
          className="mt-1 h-5 w-5 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-primary-900">{t.email}</p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-slate-600 hover:text-primary-600"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin
          className="mt-1 h-5 w-5 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-primary-900">{t.address}</p>
          <p className="text-slate-600">{siteConfig.contact.address}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MessageCircle
          className="mt-1 h-5 w-5 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-primary-900">WhatsApp</p>
          <p className="mt-1 text-sm text-slate-600">{t.whatsappHint}</p>
          <Button
            href={new URL(siteConfig.social.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="mt-3"
          >
            {t.whatsappCta}
          </Button>
        </div>
      </div>
    </div>
  );
}
