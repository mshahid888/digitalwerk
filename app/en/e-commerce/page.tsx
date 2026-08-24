import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { ServiceHero } from "@/components/service-page/hero";
import { ServiceProblem } from "@/components/service-page/problem";
import { ServiceSolution } from "@/components/service-page/solution";
import { ServiceBenefits } from "@/components/service-page/benefits";
import { ServiceProcess } from "@/components/service-page/process";
import { ServiceWhyDigitalWerk } from "@/components/service-page/why-digitalwerk";
import { ServiceFAQ } from "@/components/service-page/faq";
import { CapabilityGrid, type Capability } from "@/components/shared/capability-grid";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "E-Commerce Agency",
    description:
      "E-commerce agency for online stores on Shopify or WooCommerce, connected to Amazon, eBay, and TikTok Shop — sell more, manage less.",
  },
  "/en/e-commerce",
  { hreflang: { de: "/e-commerce", en: "/en/e-commerce" }, locale: "en_US" }
);

const content: Omit<ServicePageContent, "included"> = {
  hero: {
    badge: "E-Commerce",
    title: "Sell more — online and on every marketplace",
    description:
      "Whether it's your own online store or selling through Amazon, eBay, and TikTok Shop: we help businesses sell more online — with a store that works and processes that don't spiral out of control.",
    pricing: {
      price: "from €1,499",
      period: "one-time",
      note: "A professional online store to sell your products successfully.",
    },
  },
  problem: {
    title: "Selling online is more complicated than it should be",
    intro:
      "Many businesses lose revenue not because of bad products, but because of technical and organizational hurdles.",
    points: [
      {
        title: "The store slows down sales",
        description:
          "A slow or confusing store loses orders before checkout even begins.",
      },
      {
        title: "Marketplaces go unused",
        description:
          "Amazon, eBay, and TikTok Shop offer additional buyers — without integration, that potential is left on the table.",
      },
      {
        title: "Admin work eats up time",
        description:
          "Managing inventory, orders, and product data across multiple channels quickly gets messy.",
      },
    ],
  },
  solution: {
    title: "A store system that grows with you",
    description:
      "We set up your online store or optimize an existing one — and connect it to the marketplaces where your customers already shop, when it makes sense.",
    points: [
      "Store setup on Shopify or WooCommerce",
      "Integration with Amazon, eBay, and TikTok Shop",
      "Optimizing existing stores for more completed orders",
      "Automating recurring admin tasks",
    ],
  },
  benefits: {
    title: "What an optimized online store does for you",
    items: [
      {
        title: "More completed orders",
        description: "A fast, clear checkout lowers cart abandonment.",
      },
      {
        title: "Additional sales channels",
        description:
          "Marketplaces reach buyers who would never have found your own store.",
      },
      {
        title: "Less manual work",
        description: "Automated processes save time on orders and inventory.",
      },
      {
        title: "A better customer experience",
        description: "A well-designed store feels more trustworthy and sells more easily.",
      },
    ],
  },
  process: {
    title: "How we optimize your online sales",
    steps: [
      {
        title: "Analysis",
        description: "We review your current store and sales channels.",
      },
      {
        title: "Strategy",
        description: "We recommend the right platform and marketplaces for your business.",
      },
      {
        title: "Execution",
        description:
          "We set up store and marketplace integrations, or optimize what's already there.",
      },
      {
        title: "Ongoing support",
        description: "We monitor performance and keep developing your store.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Platform-independent advice",
        description:
          "We recommend the solution that fits your business — not the one that's easiest for us.",
      },
      {
        title: "Sales-focused",
        description: "Every decision is measured by whether it drives more sales.",
      },
      {
        title: "Ongoing support",
        description: "We keep optimizing your store after launch too.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about e-commerce",
    items: [
      {
        question: "Should I use Shopify or WooCommerce?",
        answer:
          "It depends on your requirements. We'll recommend the right solution for your business in a free initial consultation.",
      },
      {
        question: "Is it worth selling on marketplaces alongside my own store?",
        answer:
          "In most cases, yes — marketplaces unlock additional buyers you wouldn't reach through your own store alone.",
      },
      {
        question: "Do you also optimize an existing store?",
        answer: "Yes, a full rebuild isn't always necessary — targeted improvements are often enough.",
      },
      {
        question: "What does setting up an online store cost?",
        answer:
          "It depends on scope and the features you need. You'll get a transparent quote in a free initial consultation.",
      },
      {
        question: "Is e-commerce also part of DigitalWerk Complete?",
        answer:
          "E-commerce is a standalone service. For businesses with an online store, we discuss which combination makes sense in the initial consultation.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready to sell more online?",
    title: "Let's talk about your online store",
    description:
      "Book a free initial consultation and find out how DigitalWerk moves your online sales forward.",
  },
};

const platforms: Capability[] = [
  {
    title: "Shopify",
    description:
      "Quick to launch and easy to maintain — ideal for getting started or switching platforms.",
    outcome: "A fast start",
  },
  {
    title: "WooCommerce",
    description: "Full flexibility built on WordPress — for custom requirements.",
    outcome: "Maximum flexibility",
  },
  {
    title: "Marketplace Integration",
    description:
      "Sell additionally through Amazon, eBay, and TikTok Shop — centrally managed, where your customers already shop.",
    outcome: "More reach",
  },
  {
    title: "Store Optimization",
    description:
      "We improve load time, checkout, and structure for existing stores.",
    outcome: "Fewer abandoned carts",
  },
  {
    title: "AI for E-Commerce",
    description:
      "Automated product descriptions, recommendations, and customer service for your store.",
    outcome: "Less manual work",
  },
];

export default function Page() {
  return (
    <>
      <ServiceHero hero={content.hero} />
      <ServiceProblem problem={content.problem} />
      <ServiceSolution solution={content.solution} />
      <ServiceBenefits benefits={content.benefits} />
      <CapabilityGrid
        title="Platforms & marketplaces"
        intro="We work with the systems that fit your business — individually or combined."
        capabilities={platforms}
      />
      <ServiceProcess process={content.process} />
      <ServiceWhyDigitalWerk whyDigitalWerk={content.whyDigitalWerk} />
      <ServiceFAQ faq={content.faq} />
      <div className="py-16 md:py-24">
        <CTA
          eyebrow={content.cta.eyebrow}
          title={content.cta.title}
          description={content.cta.description}
          primaryHref="/en/contact"
          secondaryHref="/en/contact"
        />
      </div>
    </>
  );
}
