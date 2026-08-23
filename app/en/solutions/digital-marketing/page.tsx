import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Digital Marketing",
    description:
      "Digital marketing agency for businesses in Ansbach, Mittelfranken, and across Bavaria: SEO, advertising, and content as one coordinated strategy — supported by AI agents.",
  },
  "/en/solutions/digital-marketing",
  {
    hreflang: {
      de: "/loesungen/digital-marketing",
      en: "/en/solutions/digital-marketing",
    },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Digital Marketing",
    title: "A digital marketing agency for more customers — coordinated, not scattered",
    description:
      "A digital marketing agency that treats SEO, advertising, content, and AI automation as one strategy — not disconnected tactics. So you always know what's working, and why.",
  },
  problem: {
    title: "Many channels, no common thread",
    intro:
      "Many businesses invest in ads, SEO, or social media — but without a shared strategy, much of that budget goes to waste.",
    points: [
      {
        title: "Disconnected efforts",
        description:
          "SEO, ads, and content run side by side instead of together — leading to wasted spend.",
      },
      {
        title: "Unclear what's actually working",
        description:
          "Without proper measurement, it's unclear which effort is actually bringing in new customers.",
      },
      {
        title: "Too many points of contact",
        description:
          "Different vendors for different channels make a unified strategy harder to pull off.",
      },
    ],
  },
  solution: {
    title: "Digital marketing from one partner",
    description:
      "We build a coordinated digital marketing strategy for your business — from SEO to advertising to content, supported by AI agents that handle inquiries automatically. One point of contact instead of five.",
    points: [
      "Cross-channel strategy instead of one-off tactics",
      "Transparent reporting that shows real results",
      "AI agents for automated inquiry handling",
      "One point of contact for all digital activities",
    ],
  },
  benefits: {
    title: "What a coordinated digital marketing strategy does for you",
    items: [
      {
        title: "More qualified inquiries",
        description:
          "Channels that work together bring real customer inquiries, not just clicks.",
      },
      {
        title: "Clear measurement",
        description: "You see exactly which effort delivers which result.",
      },
      {
        title: "Less wasted spend",
        description: "Budget goes where it demonstrably works.",
      },
      {
        title: "Efficiency through AI agents",
        description:
          "Automated inquiry handling takes work off your team's plate without sacrificing quality.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Our digital marketing service at a glance.",
    items: [
      "Analysis of your current digital presence",
      "Cross-channel strategy",
      "Coordinated execution of SEO, ads, and content",
      "Monthly reporting",
      "Ongoing optimization",
      "Guidance on where AI agents fit in",
    ],
  },
  process: {
    title: "How we approach it",
    steps: [
      {
        title: "Analysis",
        description:
          "We assess your current digital presence and identify the biggest opportunities.",
      },
      {
        title: "Strategy",
        description: "You get a cross-channel strategy with clear priorities.",
      },
      {
        title: "Execution",
        description:
          "We implement SEO, advertising, and content in a coordinated way — including AI agents where it makes sense.",
      },
      {
        title: "Monitoring & optimization",
        description: "We track results and adjust the strategy on an ongoing basis.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Honest, not overpromising",
        description:
          "We don't promise miracles — we show you what's realistically achievable.",
      },
      {
        title: "One point of contact",
        description:
          "Instead of coordinating five vendors, you have one dedicated contact at DigitalWerk.",
      },
      {
        title: "Regionally rooted",
        description:
          "Based in Ansbach, we understand the challenges businesses face across Mittelfranken and Bavaria.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about digital marketing",
    items: [
      {
        question: "What's the difference between digital marketing and online marketing?",
        answer:
          "In practice, both terms are usually used interchangeably — both refer to marketing through digital channels like Google, social media, and email. We use \"digital marketing\" to mean the overall cross-channel strategy.",
      },
      {
        question: "Is digital marketing available on its own, or only as part of DigitalWerk Complete?",
        answer:
          "Digital marketing can be booked on its own. For businesses that also need a website and AI automation, DigitalWerk Complete is often the more economical choice.",
      },
      {
        question: "Do you also work with businesses outside Ansbach?",
        answer:
          "Yes. We're based in Ansbach, but we work with businesses across Mittelfranken, Bavaria, and beyond — digital collaboration works regardless of location.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "It depends on the channels chosen: advertising often delivers initial data within days, while SEO and content take several months to build lasting results.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for a coordinated strategy?",
    title: "Start with a free digital marketing assessment",
    description:
      "In a no-obligation initial consultation, we'll analyze your current digital presence and show concrete starting points.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
