import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicePageTemplate } from "@/components/service-page/service-page-template";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "Lead Generation",
    description:
      "Lead generation powered by AI agents: automated first contact, qualification, and hand-off to your sales team — for a predictably steady flow of inquiries.",
  },
  "/en/solutions/lead-generation",
  {
    hreflang: {
      de: "/loesungen/leadgenerierung",
      en: "/en/solutions/lead-generation",
    },
    locale: "en_US",
  }
);

const content: ServicePageContent = {
  hero: {
    badge: "Lead Generation",
    title: "Lead generation powered by AI agents — a predictable flow of inquiries",
    description:
      "AI agents handle first contact, qualify prospects automatically, and keep a steady stream of real inquiries coming in — around the clock, with no extra headcount.",
  },
  problem: {
    title: "Inconsistent inquiries, high manual effort",
    intro:
      "Many businesses know the problem: too few inquiries one month, too many unqualified leads the next — costing time instead of generating revenue.",
    points: [
      {
        title: "Leads go unanswered",
        description:
          "Without automated first contact, inquiries get lost or answered too late.",
      },
      {
        title: "Heavy manual effort",
        description: "Qualifying leads eats up valuable time from your team.",
      },
      {
        title: "No predictable flow",
        description: "Without a system, the number of new inquiries swings unpredictably.",
      },
    ],
  },
  solution: {
    title: "AI-powered lead generation",
    description:
      "We combine targeted campaigns with AI agents that automatically reach out to prospects, qualify them, and hand them off to your team — for a predictable, automated flow of inquiries with no extra manual effort.",
    points: [
      "Automated first contact through AI agents",
      "Lead qualification based on your own criteria",
      "Seamless hand-off to your sales team",
      "Available around the clock — including outside business hours",
    ],
  },
  benefits: {
    title: "What AI-powered lead generation does for you",
    items: [
      {
        title: "Predictable flow of inquiries",
        description:
          "A system instead of chance — you know roughly how many qualified inquiries to expect.",
      },
      {
        title: "Less manual effort",
        description:
          "AI agents handle pre-qualification, so your team can focus on closing.",
      },
      {
        title: "Faster response times",
        description: "Inquiries get answered immediately — even at night and on weekends.",
      },
      {
        title: "Higher close rate",
        description: "Pre-qualified leads are worth more than an unqualified crowd.",
      },
    ],
  },
  included: {
    title: "What's included",
    intro: "Our lead generation service at a glance.",
    items: [
      "Analysis of your target audience and channels",
      "Setup of an AI agent for first contact and qualification",
      "Integration with your sales process",
      "Monthly reporting on inquiry volume and quality",
      "Ongoing optimization of qualification criteria",
    ],
  },
  process: {
    title: "How we approach it",
    steps: [
      {
        title: "Analysis",
        description:
          "We assess your target audience, existing channels, and qualification criteria.",
      },
      {
        title: "Setup",
        description: "We configure your AI agent for first contact and qualification.",
      },
      {
        title: "Execution",
        description:
          "The AI agent handles outreach and hands qualified inquiries to your team.",
      },
      {
        title: "Monitoring & optimization",
        description:
          "We track inquiry quality and volume and adjust the criteria on an ongoing basis.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "AI agents, not generic forms",
        description:
          "We use individually configured AI agents instead of generic forms — for real qualification, not just data collection.",
      },
      {
        title: "Honest, not overpromising",
        description:
          "We don't promise a fixed number of leads — we build a system that demonstrably brings in more qualified inquiries.",
      },
      {
        title: "A system, not just a campaign",
        description: "Lead generation is set up as an ongoing system, not a one-off push.",
      },
      {
        title: "Regionally rooted",
        description:
          "Based in Ansbach, we help businesses across Mittelfranken and Bavaria build a predictable flow of leads.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about lead generation",
    items: [
      {
        question: "What's the difference between lead generation and traditional advertising?",
        answer:
          "Traditional ads create visibility and clicks. Lead generation goes a step further: prospects are actively engaged, qualified, and handed to your team as a concrete inquiry.",
      },
      {
        question: "How exactly does the AI-powered qualification work?",
        answer:
          "An AI agent runs an automated first conversation with each prospect, asks targeted questions based on your criteria, and only passes on the inquiries that actually fit your offer.",
      },
      {
        question: "Does this work for B2B too?",
        answer:
          "Yes — especially in B2B, where decision cycles tend to be longer, systematic pre-qualification helps your sales team focus its time on the most promising inquiries.",
      },
      {
        question:
          "Is lead generation available on its own, or only as part of DigitalWerk Complete?",
        answer:
          "Lead generation can be booked on its own. Combined with AI agents and SEO, the effect is often even stronger.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready for a predictable flow of inquiries?",
    title: "Start with a free lead generation assessment",
    description:
      "In a no-obligation initial consultation, we'll show you what AI-powered lead generation could look like for your business.",
  },
};

export default function Page() {
  return <ServicePageTemplate content={content} contactHref="/en/contact" />;
}
