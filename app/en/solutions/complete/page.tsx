import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "DigitalWerk Complete",
    description:
      "Website, SEO, Google Business Profile, content, and AI automation from one partner — with a single point of contact instead of five vendors.",
  },
  "/en/solutions/complete",
  {
    hreflang: {
      de: "/loesungen/digitalwerk-komplett",
      en: "/en/solutions/complete",
    },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "DigitalWerk Complete",
    title: "Your complete digital department — from one partner",
    description:
      "Website, SEO, Google Business Profile, content, AI automation, and ongoing support — bundled into one partnership that takes care of your digital growth while you take care of your core business.",
    pricing: {
      price: "€699",
      period: "/ month",
      note: [
        "Your online presence, marketing, and automation — all from one partner.",
        "Ad spend not included.",
      ],
    },
  },
  problem: {
    title: "Digital growth takes more than a website",
    intro:
      "Most businesses don't struggle because of any single measure — they struggle because there's no strategy tying it all together.",
    points: [
      {
        title: "Too many points of contact",
        description:
          "A web agency, an SEO freelancer, a social media manager — none of it lines up.",
      },
      {
        title: "No time to coordinate",
        description:
          "Between running the business and managing several vendors, digital strategy falls by the wayside.",
      },
      {
        title: "Unclear results",
        description:
          "Without unified reporting, it's hard to tell what's actually working.",
      },
    ],
  },
  solution: {
    title: "One partnership instead of separate projects",
    description:
      "DigitalWerk Complete bundles every relevant digital service into one ongoing partnership — one strategy, one point of contact, one clear goal: more customers, more visibility, more growth.",
    points: [
      "One strategy for website, SEO, content, and automation",
      "One point of contact for every service",
      "One report instead of five different ones",
      "A monthly rhythm of execution and optimization",
    ],
  },
  benefits: {
    title: "Your advantages with DigitalWerk Complete",
    items: [
      {
        title: "One dedicated point of contact",
        description: "No need to coordinate between multiple vendors.",
      },
      {
        title: "Aligned measures",
        description:
          "Website, SEO, content, and advertising work together instead of in isolation.",
      },
      {
        title: "Transparent reporting",
        description:
          "You always see what's working — clearly and understandably.",
      },
      {
        title: "Predictable costs",
        description:
          "One monthly partnership instead of recurring individual projects and negotiations.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Every service you need for digital growth.",
    items: [
      "Website Development",
      "Local SEO",
      "Google Business Profile Optimization",
      "Content Creation",
      "AI Automation",
      "Analytics & Reporting",
      "Monthly Optimization",
      "Technical Maintenance",
      "Ongoing Support",
    ],
  },
  process: {
    title: "How we start your partnership",
    steps: [
      {
        title: "Getting to know each other & analysis",
        description:
          "In a free initial consultation, we analyze your current digital presence.",
      },
      {
        title: "Strategy & onboarding",
        description: "You get a clear roadmap with defined goals.",
      },
      {
        title: "Execution",
        description:
          "Website, SEO, content, and automation are built up in a structured way.",
      },
      {
        title: "Ongoing support",
        description:
          "Monthly optimization, reporting, and continuous improvement.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Results-oriented",
        description:
          "We don't sell services for their own sake — we sell results: more customers, more visibility, more growth.",
      },
      {
        title: "Transparent & honest",
        description:
          "Clear processes, traceable results, no hidden costs.",
      },
      {
        title: "A real partner",
        description:
          "We think long-term — as part of your business, not as an outside vendor.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about DigitalWerk Complete",
    items: [
      {
        question: "Who is DigitalWerk Complete a good fit for?",
        answer:
          "For businesses that are serious about digital growth but don't have the time or capacity to coordinate multiple vendors.",
      },
      {
        question: "What does DigitalWerk Complete cost?",
        answer:
          "Cost depends on the scope and goals of your business. You'll get a transparent quote in a free initial consultation.",
      },
      {
        question: "Can I switch to individual services later?",
        answer:
          "Yes, every service is also available on its own — but for most businesses, the complete package is the more economical choice.",
      },
      {
        question: "How quickly will I see initial results?",
        answer:
          "Early improvements, like an optimized Google profile, are often visible within a few weeks; sustainable SEO growth takes several months.",
      },
      {
        question: "Do I need to understand the technical side?",
        answer: "No. We handle the full technical execution.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for your digital department?",
    title: "Start your partnership with DigitalWerk",
    description:
      "Book a free, no-obligation initial consultation and find out how DigitalWerk Complete can help your business grow.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
