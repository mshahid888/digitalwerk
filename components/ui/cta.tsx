import type { Route } from "next";
import { Container } from "./container";
import { Heading } from "./heading";
import { Button } from "./button";
import { ctaLabels } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type CTAProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryHref?: Route;
  primaryLabel?: string;
  secondaryHref?: Route;
  secondaryLabel?: string;
  className?: string;
};

export function CTA({
  eyebrow,
  title,
  description,
  primaryHref = "/kontakt",
  primaryLabel = ctaLabels.primary,
  secondaryHref,
  secondaryLabel = ctaLabels.secondary,
  className,
}: CTAProps) {
  return (
    <Container>
      <div
        className={cn(
          "flex flex-col items-center gap-6 rounded-card bg-primary-950 px-8 py-16 text-center text-white md:px-16",
          className
        )}
      >
        {eyebrow ? (
          <span className="text-sm font-medium uppercase tracking-wide text-accent-300">
            {eyebrow}
          </span>
        ) : null}
        <Heading level={2} className="text-white">
          {title}
        </Heading>
        {description ? (
          <p className="max-w-2xl text-primary-100">{description}</p>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href={primaryHref} size="lg">
            {primaryLabel}
          </Button>
          {secondaryHref ? (
            <Button href={secondaryHref} variant="inverse" size="lg">
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
