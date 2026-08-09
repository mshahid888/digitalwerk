import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Google Business Profile",
    description:
      "Professional optimization of your Google Business Profile for better rankings, more reviews, and more inquiries from your area.",
  },
  "/en/solutions/google-business-profile",
  {
    hreflang: {
      de: "/loesungen/google-unternehmensprofil",
      en: "/en/solutions/google-business-profile",
    },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Google Business Profile",
    title: "The fastest way to more local visibility",
    description:
      "Your Google Business Profile is often the first point of contact between you and new customers — before they even visit your website. We make sure it's complete, current, and convincing.",
    pricing: {
      price: "€199",
      period: "one-time",
      note: "Optimization of your Google Business Profile for better local visibility.",
    },
  },
  problem: {
    title: "Your Google profile isn't working for you",
    intro:
      "An incomplete or poorly maintained profile costs you visibility — and trust.",
    points: [
      {
        title: "Incomplete information",
        description:
          "Missing hours, photos, or categories look unprofessional.",
      },
      {
        title: "Few or no reviews",
        description:
          "Without reviews, customers are more likely to choose the competition.",
      },
      {
        title: "Wrong or outdated information",
        description:
          "Nothing looks less credible than a profile with outdated hours.",
      },
    ],
  },
  solution: {
    title: "A profile that builds trust",
    description:
      "We optimize every part of your Google Business Profile — from the basic details to photos to your review strategy — so customers find you, trust you, and get in touch.",
    points: [
      "Complete and accurate business details",
      "Professional photos and posts",
      "A strategy for more genuine reviews",
      "Regular maintenance and updates",
    ],
  },
  benefits: {
    title: "What an optimized profile does for you",
    items: [
      {
        title: "More calls & directions requests",
        description: "A complete profile gets contacted more often.",
      },
      {
        title: "Higher trust",
        description:
          "Reviews and photos build trust before customers even see your website.",
      },
      {
        title: "Better placement on Google Maps",
        description: "A well-maintained profile is a key signal for local rankings.",
      },
      {
        title: "Quickly visible improvements",
        description:
          "Changes to your profile often show results faster than classic SEO.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Full management of your Google Business Profile.",
    items: [
      "Setup or full overhaul",
      "Category and description optimization",
      "Professional photo selection and guidance",
      "Customer review strategy",
      "Regular posts and updates",
      "Monitoring for incorrect third-party edits",
      "Monthly reporting",
    ],
  },
  process: {
    title: "How we optimize your profile",
    steps: [
      {
        title: "Assessment",
        description:
          "We review your current profile for completeness and errors.",
      },
      {
        title: "Optimization",
        description: "We rework all relevant details, categories, and content.",
      },
      {
        title: "Review strategy",
        description: "We develop a plan for getting more genuine reviews.",
      },
      {
        title: "Ongoing maintenance",
        description: "We keep your profile current and active long-term.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Details others overlook",
        description: "We know the small levers that make the difference.",
      },
      {
        title: "Genuine reviews only",
        description:
          "We rely on honest review strategies, not questionable shortcuts.",
      },
      {
        title: "Ongoing management",
        description: "Your profile stays current, even months after launch.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about Google Business Profile",
    items: [
      {
        question: "What exactly is a Google Business Profile?",
        answer:
          "It's the free listing that appears in Google Search and Google Maps — with hours, reviews, photos, and contact details.",
      },
      {
        question: "How quickly will I see results?",
        answer:
          "Basic improvements are often visible within a few weeks. How much it impacts inquiries depends on your industry and competition.",
      },
      {
        question: "Can you get me fake reviews?",
        answer:
          "No. Purchased reviews violate Google's guidelines and cause more harm than good in the long run. We rely exclusively on genuine customer reviews.",
      },
      {
        question: "Do I also need SEO?",
        answer:
          "Google Business Profile and local SEO complement each other. For maximum impact, we recommend both — bookable individually or as part of DigitalWerk Complete.",
      },
      {
        question: "I don't have a profile yet — can you set one up?",
        answer: "Yes, we handle the complete initial setup for you.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for a profile that convinces?",
    title: "Get more out of your Google profile",
    description:
      "Book a free initial consultation — we'll show you the potential in your Google Business Profile.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
