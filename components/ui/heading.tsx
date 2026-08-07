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
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"h1">, "className" | "children">;

export function Heading({
  level = 2,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Component = `h${level}` as ElementType;
  return (
    <Component className={cn(levelStyles[level], className)} {...rest}>
      {children}
    </Component>
  );
}
