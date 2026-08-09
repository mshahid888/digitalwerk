import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTA } from "@/components/ui/cta";
import { PageIntro } from "@/components/shared/page-intro";
import {
  ComparisonList,
  type ComparisonItem,
} from "@/components/shared/comparison-list";

export const metadata: Metadata = buildMetadata(
  {
    title: "Advertising",
    description:
      "Google Ads, Meta Ads, and TikTok Ads for measurable growth — honest advice, no overblown promises.",
  },
  "/en/advertising",
  { hreflang: { de: "/werbeanzeigen", en: "/en/advertising" }, locale: "en_US" }
);

const channels: ComparisonItem[] = [
  {
    title: "Google Ads",
    description:
      "Your ad appears exactly when someone is actively searching for your service.",
    highlight: "You want fast visibility for demand that already exists.",
    href: "/en/advertising/google-ads",
  },
  {
    title: "Meta Ads",
    description:
      "Campaigns on Facebook and Instagram that reach new audiences by interest and region.",
    highlight: "You want to reach new customers who aren't actively searching yet.",
    href: "/en/advertising/meta-ads",
  },
  {
    title: "TikTok Ads",
    description:
      "Short, creative video content for a large, active, and often younger audience.",
    highlight:
      "Your offer is visually appealing and you want to reach a younger audience.",
    href: "/en/advertising/tiktok-ads",
  },
];

export default function Page() {
  return (
    <>
      <PageIntro
        badge="Advertising"
        title="Advertising measured by results"
        description="Google Ads, Meta Ads, and TikTok Ads put your business in front of the right audience — with clear metrics instead of vague promises. We only recommend a channel when it genuinely fits your business, and we deliberately avoid overblown ROI guarantees."
      />

      <ComparisonList
        title="Which channel fits your business?"
        intro="Each channel reaches customers in a different way. Often a combination makes sense — as does connecting it with website, SEO, and other services through DigitalWerk Complete."
        highlightLabel="Best if"
        items={channels}
        tone="default"
      />

      <div className="py-16 md:py-24">
        <CTA
          eyebrow="Not sure which channel fits?"
          title="We'll advise you honestly, no obligation"
          description="In a free initial consultation, we'll look together at which advertising channels genuinely make sense for your business."
          primaryHref="/en/contact"
          secondaryHref="/en/contact"
        />
      </div>
    </>
  );
}
