import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "SEO Agency",
    description:
      "SEO agency for local SEO and better visibility on Google and Google Maps — honest advice, built for the long term. Free assessment for your business.",
  },
  "/en/solutions/seo",
  { hreflang: { de: "/loesungen/seo", en: "/en/solutions/seo" }, locale: "en_US" }
);

const content: ServicePageContent = {
  hero: {
    badge: "Local SEO",
    title: "More visibility on Google — right where your customers search",
    description:
      "Local SEO helps businesses like yours get found on Google and Google Maps when potential customers search in your area. Not a quick trick, but a long-term investment in visibility that lasts.",
    pricing: {
      price: "€299",
      period: "/ month",
      note: "Transparent SEO for more visibility and relevant visitors.",
    },
  },
  problem: {
    title: "Good work isn't enough if no one can find you",
    intro:
      "Many good businesses don't lose customers because of their work — they lose them because they're invisible on Google.",
    points: [
      {
        title: "You're not on page one",
        description:
          "Customers searching for your service find the competition first.",
      },
      {
        title: "Your Google profile goes unnoticed",
        description:
          "Without optimization, your Google Maps listing barely shows up.",
      },
      {
        title: "Unclear what actually works",
        description:
          "Without a strategy, SEO stays a mystery — time and budget go to waste.",
      },
    ],
  },
  solution: {
    title: "Local SEO, explained clearly",
    description:
      "Local SEO helps Google recognize your business as a relevant answer to local searches — like “dentist near me” or “restaurant nearby.” We optimize your website, your Google Business Profile, and the signals Google weighs for local rankings.",
    points: [
      "Optimizing your website for relevant local search terms",
      "Full management of your Google Business Profile",
      "Building local relevance through reviews and listings",
      "The technical foundation Google can reliably read",
    ],
  },
  benefits: {
    title: "What local SEO does for your business",
    items: [
      {
        title: "More inquiries",
        description:
          "More qualified visitors who are actively searching for your service.",
      },
      {
        title: "Visibility on Google Maps",
        description: "Presence exactly when customers nearby are searching.",
      },
      {
        title: "Lasting results",
        description:
          "Unlike ads, SEO keeps working even after the work is done.",
      },
      {
        title: "Trust through visibility",
        description:
          "A strong ranking is automatically associated with trust by users.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Our local SEO service at a glance.",
    items: [
      "Analysis of your current visibility",
      "Keyword research for your region",
      "On-page optimization of your website",
      "Google Business Profile optimization",
      "Technical SEO foundation",
      "Monthly reporting",
      "Ongoing strategy adjustments",
    ],
  },
  process: {
    title: "How we approach it",
    steps: [
      {
        title: "Analysis",
        description:
          "We assess your current visibility and identify the biggest opportunities.",
      },
      {
        title: "Strategy",
        description: "You get a clear plan with realistic goals and timeline.",
      },
      {
        title: "Execution",
        description:
          "We implement the optimizations on your website and Google profile in a structured way.",
      },
      {
        title: "Monitoring & optimization",
        description: "We track progress and adjust the strategy on an ongoing basis.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Honest, not overpromising",
        description:
          "We don't make promises we can't keep — not even about Google rankings.",
      },
      {
        title: "Explained clearly",
        description: "You understand what we do and why — no jargon.",
      },
      {
        title: "Built for the long term",
        description: "For us, SEO is a partnership, not a one-off task.",
      },
      {
        title: "Regionally rooted",
        description:
          "Based in Ansbach, we work with businesses across Mittelfranken — from Nuremberg to Fürth to Rothenburg ob der Tauber.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about SEO",
    items: [
      {
        question: "How long does it take for SEO to work?",
        answer:
          "Early improvements to your Google profile are often visible within a few weeks. Noticeable improvements in organic search rankings usually take three to six months, with lasting results closer to six to twelve months. SEO is a long-term investment, not a quick trick.",
      },
      {
        question: "Can you guarantee me the #1 spot on Google?",
        answer:
          "No — reputable SEO agencies can't and shouldn't guarantee a specific ranking, since Google doesn't disclose its ranking factors and changes them regularly. We use proven, sustainable methods that demonstrably improve your visibility.",
      },
      {
        question: "What's the difference between SEO and Google Ads?",
        answer:
          "Google Ads brings immediate but paid visibility. SEO builds organic visibility that stays even without an ongoing ad budget — but it takes more time.",
      },
      {
        question: "Which businesses is local SEO a good fit for?",
        answer:
          "Any business with a local or regional customer base — such as restaurants, medical practices, law firms, trades, or beauty salons.",
      },
      {
        question: "Is SEO available on its own, or only as part of DigitalWerk Complete?",
        answer:
          "SEO can be booked on its own. For businesses that also need website, content, and automation, DigitalWerk Complete is often the more economical choice.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready to get found?",
    title: "Start with a free SEO assessment",
    description:
      "In a no-obligation initial consultation, we'll show you where your business stands today and what potential local SEO holds for you.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
