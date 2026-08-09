import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Google Ads",
    description:
      "Google Ads campaigns for customers already actively searching for your service — honestly advised, transparently billed, clearly reported.",
  },
  "/en/advertising/google-ads",
  {
    hreflang: { de: "/werbeanzeigen/google-ads", en: "/en/advertising/google-ads" },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Google Ads",
    title: "Reach customers at the exact moment they search",
    description:
      "Google Ads shows your business to people actively searching for your service — not just when they happen to be scrolling. That makes Google Ads one of the most direct paths to new inquiries.",
  },
  problem: {
    title: "Visibility that arrives too slowly",
    intro:
      "Local SEO works over the long term — but sometimes you need results faster.",
    points: [
      {
        title: "Long wait for SEO to work",
        description: "Organic growth often takes months to become noticeable.",
      },
      {
        title: "Invisible for urgent searches",
        description:
          "Customers with an immediate need find whoever is visible on Google Ads first.",
      },
      {
        title: "Untapped existing demand",
        description:
          "People are already searching for your service — without ads, you miss those inquiries.",
      },
    ],
  },
  solution: {
    title: "Visibility the moment someone searches",
    description:
      "We run Google Ads campaigns that appear exactly when potential customers are actively searching for your service — targeted by region, search term, and budget.",
    points: [
      "Campaigns for local and nationwide visibility",
      "Targeted search terms instead of wasted spend",
      "Ongoing budget optimization",
      "Clear reporting on inquiries and cost",
    ],
  },
  benefits: {
    title: "What Google Ads does for your business",
    items: [
      {
        title: "Fast visibility",
        description: "Unlike SEO, Google Ads campaigns work from day one.",
      },
      {
        title: "Predictable budget",
        description: "You decide how much you want to invest per day.",
      },
      {
        title: "Measurable results",
        description: "Every click and every inquiry is traceable.",
      },
      {
        title: "Targeted reach",
        description: "Your ad only appears for relevant searches.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Full management of your Google Ads campaigns.",
    items: [
      "Campaign strategy and keyword research",
      "Ad creation and setup",
      "Audience and budget management",
      "Ongoing optimization",
      "Conversion tracking",
      "Monthly reporting",
    ],
  },
  process: {
    title: "How your campaigns launch",
    steps: [
      {
        title: "Analysis",
        description: "We review your offer, audience, and competition.",
      },
      {
        title: "Strategy",
        description: "We define campaign structure, keywords, and budget.",
      },
      {
        title: "Launch",
        description: "We set up the campaigns and take them live.",
      },
      {
        title: "Optimization",
        description: "We evaluate results and continuously improve the campaigns.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Honest expectations",
        description:
          "We don't promise unrealistic results — we work with traceable metrics.",
      },
      {
        title: "Budget handled with care",
        description: "We treat your ad budget as carefully as our own.",
      },
      {
        title: "Clear reporting",
        description: "You always see where your budget goes and what it achieves.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about Google Ads",
    items: [
      {
        question: "Can you guarantee me a specific ROI?",
        answer:
          "No. Results depend on industry, competition, and budget. We work with clear metrics and transparent reporting instead of making unrealistic promises.",
      },
      {
        question: "How much budget do I need for Google Ads?",
        answer:
          "It depends on your industry and goals. We recommend a realistic starting budget in a free initial consultation.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Initial data is usually available within a few days, with solid results after two to four weeks of optimization.",
      },
      {
        question: "What's the difference to SEO?",
        answer:
          "Google Ads delivers immediate but paid visibility. SEO builds organic visibility that stays even without an ongoing budget.",
      },
      {
        question: "Can I adjust the budget at any time?",
        answer: "Yes, the budget can be increased, lowered, or paused at any time.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for more visible demand?",
    title: "Launch your first Google Ads campaign",
    description:
      "Book a free initial consultation and find out the potential Google Ads holds for your business.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
