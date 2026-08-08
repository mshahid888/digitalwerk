import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-3">
        <Phone
          className="mt-1 h-5 w-5 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-primary-900">Telefon</p>
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
          <p className="font-semibold text-primary-900">E-Mail</p>
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
          <p className="font-semibold text-primary-900">Adresse</p>
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
          <p className="mt-1 text-sm text-slate-600">
            Schnelle Antworten direkt über WhatsApp.
          </p>
          <Button
            href={new URL(siteConfig.social.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="mt-3"
          >
            Per WhatsApp schreiben
          </Button>
        </div>
      </div>
    </div>
  );
}
