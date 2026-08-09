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
import { PrivacyTrust } from "@/components/ki-agenten/privacy-trust";
import type { ServicePageContent } from "@/components/service-page/types";

export const metadata: Metadata = buildMetadata(
  {
    title: "AI Agents",
    description:
      "AI agents for restaurants, medical practices, law firms, and more: handle calls, appointment booking, and customer inquiries automatically — save time and money.",
  },
  "/en/ai-agents",
  { hreflang: { de: "/ki-agenten", en: "/en/ai-agents" }, locale: "en_US" }
);

const content: Omit<ServicePageContent, "included"> = {
  hero: {
    badge: "AI Agents",
    title: "Less effort, more customers — automatically",
    description:
      "AI agents answer inquiries, take calls, and book appointments — around the clock. That saves you time, lowers costs, and means you never miss an inquiry again.",
  },
  problem: {
    title: "Every missed inquiry is a lost customer",
    intro:
      "Restaurant, medical practice, or law firm — the challenge is the same everywhere: too many inquiries, too little time.",
    points: [
      {
        title: "Calls go unanswered",
        description:
          "During busy hours or outside business hours, calls get missed — and potential customers with them.",
      },
      {
        title: "Messages pile up",
        description:
          "WhatsApp, email, contact forms — inquiries come from every direction and sit unanswered.",
      },
      {
        title: "Staff tied up with routine tasks",
        description:
          "Appointment requests and standard questions eat up time needed for the core business.",
      },
    ],
  },
  solution: {
    title: "AI agents take on what costs you time",
    description:
      "AI agents answer inquiries, take calls, book appointments, and qualify leads — automatically, around the clock. You and your team get time back for what really matters: your customers.",
    points: [
      "Reachable around the clock — even outside business hours",
      "Instant answers instead of waiting",
      "Less administrative work for your team",
      "More completed inquiries instead of lost contacts",
    ],
  },
  benefits: {
    title: "What AI automation does for your business",
    items: [
      {
        title: "Time savings",
        description:
          "Your team is freed from routine inquiries and has more time for customers.",
      },
      {
        title: "Lower costs",
        description:
          "Automation reduces the need for extra staff for inquiries and scheduling.",
      },
      {
        title: "More customers",
        description: "No more missed inquiries — not even at night or on weekends.",
      },
      {
        title: "Happier customers",
        description: "Instant answers lead to a better customer experience.",
      },
    ],
  },
  process: {
    title: "How we introduce AI agents to your business",
    steps: [
      {
        title: "Analysis",
        description:
          "We identify where automation brings the most value to your business.",
      },
      {
        title: "Setup",
        description: "We set up the right AI agents for your needs.",
      },
      {
        title: "Test phase",
        description: "We test everything together with you before it goes live.",
      },
      {
        title: "Support & optimization",
        description: "We monitor results and continuously adjust the automation.",
      },
    ],
  },
  whyDigitalWerk: {
    title: "Why DigitalWerk",
    points: [
      {
        title: "Business first",
        description:
          "We use AI only where it delivers real business value — not because it's a trend.",
      },
      {
        title: "Explained simply",
        description:
          "You don't need to know anything about AI — we explain everything in plain language.",
      },
      {
        title: "Human + AI",
        description:
          "Our AI solutions automate recurring tasks. Personal advice and the relationship with your customers stay with your team.",
      },
      {
        title: "Ongoing support",
        description: "We monitor and improve your AI agents on an ongoing basis.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions about AI Agents",
    items: [
      {
        question: "Does AI automation replace my team?",
        answer:
          "No. AI agents take on routine tasks and free up your team — your staff remains essential for personal contact with your customers.",
      },
      {
        question: "Isn't this complicated to set up?",
        answer:
          "No. We handle the complete setup and support — you don't need to deal with anything technical.",
      },
      {
        question: "Won't this feel impersonal to my customers?",
        answer:
          "Well-configured AI agents answer simple inquiries quickly and route more complex requests directly to your team — for a better, not a more impersonal, experience.",
      },
      {
        question: "Which businesses are AI agents a good fit for?",
        answer:
          "Any business with recurring inquiries — such as restaurants, medical practices, law firms, hotels, or beauty salons.",
      },
      {
        question: "What does using AI agents cost?",
        answer:
          "Cost depends on scope and the features you want. You'll get a transparent quote in a free initial consultation.",
      },
      {
        question: "Are AI agents also part of DigitalWerk Complete?",
        answer:
          "Yes, AI agents are part of DigitalWerk Complete and also bookable on their own.",
      },
    ],
  },
  cta: {
    eyebrow: "Ready to save time and money?",
    title: "Find out where automation helps you most",
    description:
      "Book a free initial consultation and find out which AI agents fit your business.",
  },
};

const aiSolutions: Capability[] = [
  {
    title: "AI Chatbots",
    description:
      "Answers questions on your website in real time — even at night and on weekends.",
    outcome: "No more missed inquiries",
  },
  {
    title: "AI Voice Agents",
    description:
      "Handles natural phone conversations and answers common questions automatically.",
    outcome: "Frees up your team",
  },
  {
    title: "AI Phone Receptionists",
    description: "Takes incoming calls when no one can pick up the phone.",
    outcome: "Never miss a call again",
  },
  {
    title: "WhatsApp AI",
    description:
      "Answers customer inquiries where many of your customers already are.",
    outcome: "Faster responses",
  },
  {
    title: "Appointment Scheduling",
    description:
      "Customers book appointments themselves — without a call or email exchange.",
    outcome: "A full calendar, less effort",
  },
  {
    title: "Support Automation",
    description:
      "Answers recurring questions automatically and routes complex issues onward.",
    outcome: "More time for important cases",
  },
  {
    title: "Lead Qualification",
    description: "Automatically filters and sorts inquiries before they reach you.",
    outcome: "Only relevant inquiries left",
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
        title="Our AI solutions at a glance"
        intro="Each solution solves a specific problem in your day-to-day business — usable individually or combined."
        capabilities={aiSolutions}
      />
      <PrivacyTrust locale="en" />
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
