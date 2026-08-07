import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "muted" | "primary";

const toneStyles: Record<Tone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-primary-50 text-foreground",
  primary: "bg-primary-950 text-white",
};

type SectionProps = {
  tone?: Tone;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">;

export function Section({
  tone = "default",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-24", toneStyles[tone], className)}
      {...rest}
    >
      {children}
    </section>
  );
}
