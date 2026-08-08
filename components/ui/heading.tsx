import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3 | 4;

const levelStyles: Record<Level, string> = {
  1: "text-4xl md:text-6xl font-semibold tracking-tight",
  2: "text-3xl md:text-5xl font-semibold tracking-tight",
  3: "text-2xl md:text-3xl font-semibold tracking-tight",
  4: "text-xl md:text-2xl font-semibold",
};

type HeadingProps = {
  level?: Level;
  // Visual style to apply, independent of the semantic tag `level` renders.
  // Lets a heading sit at the correct place in the document outline (e.g.
  // h3, to avoid skipping a level) while keeping the typography of a
  // different level (e.g. the smaller h4 card-title style).
  size?: Level;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"h1">, "className" | "children">;

export function Heading({
  level = 2,
  size,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Component = `h${level}` as ElementType;
  return (
    <Component className={cn(levelStyles[size ?? level], className)} {...rest}>
      {children}
    </Component>
  );
}
