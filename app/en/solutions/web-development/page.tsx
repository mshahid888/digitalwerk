import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Web Development & Design",
    description:
      "Web design agency for modern, fast, conversion-focused websites that turn visitors into customers. Built with craftsmanship, not just good looks.",
  },
  "/en/solutions/web-development",
  {
    hreflang: {
      de: "/loesungen/webentwicklung",
      en: "/en/solutions/web-development",
    },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Web Development",
    title: "A website that works for your business",
    description:
      "Not just a digital storefront, but the foundation for everything that follows: visibility, trust, and new customers. We build websites that load fast, look good, and move visitors to take action.",
    pricing: {
      price: "from €1,299",
      period: "one-time",
      note: "Professional business websites — modern, fast, and built for search engines.",
    },
  },
  problem: {
    title: "Your website is costing you more customers than you think",
    intro:
      "A website that doesn't convince doesn't just lose design points — it costs real inquiries.",
    points: [
      {
        title: "Outdated design",
        description:
          "Visitors leave websites that look unprofessional within seconds.",
      },
      {
        title: "Slow load times",
        description:
          "Every second of waiting costs visitors — and gets penalized by Google too.",
      },
      {
        title: "Poor mobile experience",
        description:
          "Most visitors come from their phone. If your site doesn't work there, they're gone immediately.",
      },
    ],
  },
  solution: {
    title: "Development with a clear goal: results",
    description:
      "We don't build websites that are just meant to look good. Every page is designed to guide visitors toward a specific action — an inquiry, a call, an appointment.",
    points: [
      "Modern, professional design",
      "Fast load times through clean technical foundations",
      "Optimized for smartphone and tablet",
      "Clear calls to action on every page",
    ],
  },
  benefits: {
    title: "What a good website does for you",
    items: [
      {
        title: "More inquiries",
        description:
          "A convincing website turns more visitors into customers.",
      },
      {
        title: "A professional impression",
        description:
          "Your website is often the first impression — it should convince.",
      },
      {
        title: "A better foundation for SEO",
        description:
          "A technically clean website is a prerequisite for good Google rankings.",
      },
      {
        title: "Less maintenance",
        description: "Cleanly built websites cause fewer problems long-term.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "From the first idea to the finished website.",
    items: [
      "Custom design based on your brand",
      "Responsive build for every device",
      "Technical load-time optimization",
      "Basic SEO structure",
      "Contact forms & calls to action",
      "Training on managing your content",
      "Ongoing technical support",
    ],
  },
  process: {
    title: "How your new website comes together",
    steps: [
      {
        title: "Concept",
        description:
          "We clarify goals, audience, and structure for your new website.",
      },
      {
        title: "Design",
        description:
          "You get a design that fits your brand — before any technical build begins.",
      },
      {
        title: "Development",
        description: "We build the website to be technically clean and fast.",
      },
      {
        title: "Launch & handover",
        description:
          "After thorough testing, we go live — including a walkthrough for you.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Craftsmanship",
        description:
          "We build websites that are technically clean — not just pretty.",
      },
      {
        title: "Results-oriented",
        description: "Every design decision serves one goal: more inquiries for you.",
      },
      {
        title: "We don't disappear after launch",
        description: "We keep supporting your website after it goes live.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about web development",
    items: [
      {
        question: "How long does building a new website take?",
        answer:
          "Usually four to eight weeks depending on scope — from concept to launch.",
      },
      {
        question: "Can I edit the content myself later?",
        answer:
          "Yes. We set up your website so you can update text and images yourself, and we walk you through how.",
      },
      {
        question: "What does a new website cost?",
        answer:
          "It depends on scope and the features you need. You'll get a transparent quote in a free initial consultation.",
      },
      {
        question: "Do you also take over existing websites?",
        answer:
          "Yes, we also rework existing websites when a full rebuild isn't necessary.",
      },
      {
        question: "Is SEO included in web development?",
        answer:
          "We lay the technical SEO foundation on every website. For comprehensive SEO support, we recommend our Local SEO service or DigitalWerk Complete.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for a website that convinces?",
    title: "Let's talk about your new website",
    description:
      "Book a free initial consultation and find out how a convincing website brings your business more inquiries.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
