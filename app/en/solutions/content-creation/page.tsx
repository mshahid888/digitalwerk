import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Content Creation",
    description:
      "Professional website and SEO content that convinces and ranks on Google — written clearly, tailored to your industry.",
  },
  "/en/solutions/content-creation",
  {
    hreflang: {
      de: "/loesungen/content-creation",
      en: "/en/solutions/content-creation",
    },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Content Creation",
    title: "Words that convince — and get found",
    description:
      "The best website doesn't help much if the content doesn't convince. We write copy that explains your services clearly, builds trust, and performs well on Google at the same time.",
    pricing: {
      price: "€349",
      period: "/ month",
      note: "Professional content for your digital presence.",
    },
  },
  problem: {
    title: "Good work, poorly explained",
    intro:
      "Many businesses do excellent work — their website just doesn't explain it convincingly enough.",
    points: [
      {
        title: "Generic copy",
        description:
          "Interchangeable phrasing that reads like any other agency website.",
      },
      {
        title: "Too technical or too vague",
        description:
          "Customers can't tell at a glance what you actually offer.",
      },
      {
        title: "No content for Google",
        description:
          "Without relevant content, Google has little reason to find you.",
      },
    ],
  },
  solution: {
    title: "Content with a dual purpose",
    description:
      "We write copy that does two things at once: convince people and show Google that your page is relevant. Clear, easy to understand, and tailored to your audience.",
    points: [
      "Plain language instead of jargon",
      "Content tailored to your target audience",
      "SEO-relevant structure and keywords",
      "Consistent tone across every page",
    ],
  },
  benefits: {
    title: "What good content does for you",
    items: [
      {
        title: "Longer time on site",
        description: "Convincing copy keeps visitors on your website longer.",
      },
      {
        title: "More trust",
        description:
          "Clear, honest language feels more credible than empty marketing phrases.",
      },
      {
        title: "Better visibility on Google",
        description: "Relevant content is a baseline requirement for good rankings.",
      },
      {
        title: "A consistent brand",
        description: "A consistent tone strengthens recognition and trust.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "From the homepage to blog articles.",
    items: [
      "Copy for website pages",
      "SEO-optimized content",
      "Service descriptions and offer copy",
      "Blog articles and guides",
      "Content strategy for your industry",
      "Tone and style guidelines",
      "Regular new content",
    ],
  },
  process: {
    title: "How your content comes together",
    steps: [
      {
        title: "Getting to know you",
        description: "We understand your offer, audience, and tone.",
      },
      {
        title: "Research",
        description:
          "We research relevant topics and search terms for your industry.",
      },
      {
        title: "Writing",
        description: "We write content that convinces and performs well on Google.",
      },
      {
        title: "Review & publishing",
        description: "You give feedback, we refine — until everything fits.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "No buzzword bingo",
        description: "We write clearly instead of generically.",
      },
      {
        title: "SEO and writing from one place",
        description: "Our copy convinces people and works for Google.",
      },
      {
        title: "Tailored to your industry",
        description: "Every text is written individually for your business, not from a template.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about content creation",
    items: [
      {
        question: "Do you write industry-specific content?",
        answer:
          "Yes, we tailor language and content individually to your industry and audience.",
      },
      {
        question: "How many pieces of content are included in a project?",
        answer:
          "Scope depends on your website and goals. We discuss the exact needs in a free initial consultation.",
      },
      {
        question: "Can I provide my own copy or have it reworked?",
        answer:
          "Yes, we also rework existing content instead of always starting from scratch.",
      },
      {
        question: "Do you write new blog articles on an ongoing basis?",
        answer:
          "Yes, we offer that as an ongoing service — ideal for long-term visibility on Google.",
      },
      {
        question: "Is content creation part of DigitalWerk Complete?",
        answer:
          "Yes, content creation is part of DigitalWerk Complete and also bookable on its own.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for content that convinces?",
    title: "Let's talk about your content",
    description:
      "Book a free initial consultation and find out how convincing content moves your business forward.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
