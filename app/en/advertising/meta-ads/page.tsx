import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Meta Ads",
    description:
      "Facebook and Instagram campaigns that reach new audiences instead of just serving existing demand — honestly advised, creatively executed.",
  },
  "/en/advertising/meta-ads",
  {
    hreflang: { de: "/werbeanzeigen/meta-ads", en: "/en/advertising/meta-ads" },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Meta Ads",
    title: "Get in front of customers before they start searching",
    description:
      "Meta Ads reaches people on Facebook and Instagram based on interests, region, and behavior — ideal for making new audiences aware of your business before the need becomes urgent.",
  },
  problem: {
    title: "A good offer that no one sees",
    intro:
      "Many businesses rely solely on customers who are already actively searching — and miss everyone else.",
    points: [
      {
        title: "Only existing demand is reached",
        description: "Anyone not actively searching never hears about your offer.",
      },
      {
        title: "No visual presence",
        description:
          "Without ads, your business stays invisible to new audiences.",
      },
      {
        title: "Missed re-engagement",
        description:
          "Visitors who once landed on your website disappear without a second touchpoint.",
      },
    ],
  },
  solution: {
    title: "Visibility where your audience spends time",
    description:
      "We build Meta Ads campaigns that target your audience by interest, location, and behavior — with images and videos that stand out in the feed.",
    points: [
      "Audience targeting by interest and region",
      "Campaigns for Facebook and Instagram",
      "Retargeting website visitors",
      "Creative ad formats that stand out",
    ],
  },
  benefits: {
    title: "What Meta Ads does for your business",
    items: [
      {
        title: "New audiences",
        description: "You reach people you'd otherwise never have found.",
      },
      {
        title: "Higher brand awareness",
        description: "Regular visibility in the feed strengthens recognition.",
      },
      {
        title: "Targeted retargeting",
        description: "People who already engaged with you get reached again.",
      },
      {
        title: "Visual impact",
        description: "Images and videos often convince more than text alone.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Full management of your Meta Ads campaigns.",
    items: [
      "Audience strategy",
      "Ad and creative production",
      "Campaigns for Facebook and Instagram",
      "Retargeting campaigns",
      "Ongoing optimization",
      "Monthly reporting",
    ],
  },
  process: {
    title: "How your campaigns launch",
    steps: [
      {
        title: "Analysis",
        description: "We define your audience and campaign goals.",
      },
      {
        title: "Creative",
        description: "We develop ads that stand out and convince.",
      },
      {
        title: "Launch",
        description: "We set up campaigns and creatives and take everything live.",
      },
      {
        title: "Optimization",
        description: "We continuously adjust audiences and ads.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Creative and targeted",
        description:
          "We combine eye-catching design with precise audience targeting.",
      },
      {
        title: "Honest expectations",
        description:
          "We don't promise guaranteed results — we work transparently with real metrics.",
      },
      {
        title: "Ongoing management",
        description: "We monitor and optimize your campaigns continuously.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about Meta Ads",
    items: [
      {
        question: "Can you guarantee me a specific ROI?",
        answer:
          "No. Results depend on industry, audience, and budget. We work with clear metrics instead of promises.",
      },
      {
        question: "Do I need my own photos or videos?",
        answer:
          "Not necessarily — we can create suitable creatives for you, though your own footage is always welcome.",
      },
      {
        question: "Does Meta Ads make sense for local businesses too?",
        answer: "Yes, campaigns can be very precisely limited to your region.",
      },
      {
        question: "What's the difference to Google Ads?",
        answer:
          "Google Ads reaches people with acute search intent; Meta Ads reaches people based on interests — often before the need even arises.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Initial data is usually available after a few days, meaningful results after two to four weeks.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready to reach new audiences?",
    title: "Launch your first Meta Ads campaign",
    description:
      "Book a free initial consultation and find out how Meta Ads makes your business more visible.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
