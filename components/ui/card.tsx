import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  hoverable?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export function Card({
  hoverable = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-primary-100 bg-white p-6 shadow-card",
        hoverable && "transition-shadow duration-200 hover:shadow-lifted",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
