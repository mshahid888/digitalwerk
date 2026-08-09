import type { PricingContent } from "./pricing";

export type ServicePageContent = {
  hero: {
    badge: string;
    title: string;
    description: string;
    pricing?: PricingContent;
  };
  problem: {
    title: string;
    intro?: string;
    points: { title: string; description: string }[];
  };
  solution: {
    title: string;
    description: string;
    points?: string[];
  };
  benefits: {
    title: string;
    intro?: string;
    items: { title: string; description: string }[];
  };
  included: {
    title: string;
    intro?: string;
    items: string[];
  };
  process: {
    title: string;
    intro?: string;
    steps: { title: string; description: string }[];
  };
  whyDigitalWerk: {
    title: string;
    intro?: string;
    points: { title: string; description: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    eyebrow?: string;
    title: string;
    description?: string;
  };
};
