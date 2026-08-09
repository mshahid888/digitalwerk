import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "TikTok Ads",
    description:
      "Creative short-video campaigns for a large, active audience — honestly advised on whether TikTok genuinely fits your business.",
  },
  "/en/advertising/tiktok-ads",
  {
    hreflang: { de: "/werbeanzeigen/tiktok-ads", en: "/en/advertising/tiktok-ads" },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "TikTok Ads",
    title: "Reach an audience that classic advertising barely reaches anymore",
    description:
      "TikTok Ads reaches a large, active audience with short, creative videos — especially effective for businesses with visually engaging products or services.",
    pricing: {
      price: "€249",
      period: "/ month",
      note: "Ad spend not included.",
    },
  },
  problem: {
    title: "An audience that needs to be reached differently",
    intro:
      "Classic advertising formats reach a younger, mobile-first audience less and less.",
    points: [
      {
        title: "Declining impact of classic advertising",
        description:
          "Many younger audiences barely notice classic ad formats anymore.",
      },
      {
        title: "No presence on TikTok",
        description:
          "Without a presence there, a growing channel stays completely untapped.",
      },
      {
        title: "Unclear how to advertise on TikTok",
        description:
          "The platform works differently than classic advertising channels — frustrating without experience.",
      },
    ],
  },
  solution: {
    title: "Creative short videos that stand out",
    description:
      "We develop TikTok Ads campaigns with short, authentic videos that fit the platform — instead of classic advertising that feels out of place there.",
    points: [
      "Campaign strategy for your audience",
      "Short-video content built for the platform",
      "Targeting by interest, age group, and region",
      "Ongoing campaign optimization",
    ],
  },
  benefits: {
    title: "What TikTok Ads does for your business",
    items: [
      {
        title: "Access to a growing audience",
        description:
          "You reach audiences that are barely active on other channels anymore.",
      },
      {
        title: "High engagement",
        description: "Short videos often generate more interaction than classic ads.",
      },
      {
        title: "Authentic impact",
        description: "TikTok-style content feels less like classic advertising.",
      },
      {
        title: "New brand awareness",
        description: "A platform where many businesses still have little presence.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Full management of your TikTok Ads campaigns.",
    items: [
      "Audience strategy",
      "Short-video content concept and production",
      "Campaign setup",
      "Ongoing optimization",
      "Monthly reporting",
    ],
  },
  process: {
    title: "How your campaigns launch",
    steps: [
      {
        title: "Analysis",
        description: "We assess whether and how TikTok fits your business.",
      },
      {
        title: "Content concept",
        description: "We develop video ideas that fit the platform and your brand.",
      },
      {
        title: "Launch",
        description: "We set up the campaigns and publish the first videos.",
      },
      {
        title: "Optimization",
        description: "We adjust content and audiences based on results.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Content built for the platform",
        description:
          "We create content that fits TikTok, instead of just porting over classic advertising.",
      },
      {
        title: "Honest assessment",
        description: "We only recommend TikTok Ads when it genuinely fits your business.",
      },
      {
        title: "Ongoing management",
        description:
          "We continuously adjust content and audiences to current trends on the platform.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about TikTok Ads",
    items: [
      {
        question: "Is TikTok Ads a good fit for every business?",
        answer:
          "No, not every industry benefits equally. In a free initial consultation, we'll honestly assess whether TikTok fits your business.",
      },
      {
        question: "Can you guarantee me a specific ROI?",
        answer:
          "No. Results depend on industry, content, and budget. We work with clear metrics instead of promises.",
      },
      {
        question: "Do I need professional videos?",
        answer:
          "No — on TikTok, simple, authentic videos often perform better than polished ad productions.",
      },
      {
        question: "How is TikTok Ads different from Meta Ads?",
        answer:
          "TikTok leans more on short, entertaining video content and reaches a tendentially younger audience.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Initial data is usually available after a few days. Since the algorithm needs time to find the right audience, solid results are often possible only after two to three weeks.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for a new audience?",
    title: "Launch your first TikTok Ads campaign",
    description:
      "Book a free initial consultation and find out whether TikTok Ads fits your business.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
