import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "primary" | "accent" | "success" | "neutral";

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary-100 text-primary-700",
  accent: "bg-accent-100 text-accent-700",
  success: "bg-success-100 text-success-700",
  neutral: "bg-slate-100 text-slate-700",
};

type BadgeProps = {
  tone?: Tone;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "className" | "children">;

export function Badge({
  tone = "primary",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
