import Link from "next/link";
import type { Route } from "next";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-soft",
  secondary:
    "bg-white text-primary-700 border border-primary-200 hover:bg-primary-50",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-50",
  // For use on dark backgrounds (e.g. the CTA banner) — a real variant
  // rather than a className override, since Tailwind doesn't guarantee
  // className string order wins over another utility class targeting
  // the same property.
  inverse:
    "bg-transparent text-white border border-white/40 hover:bg-white/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-button font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
    href: Route | URL;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } =
    props;
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (rest.href !== undefined) {
    return (
      <Link {...rest} href={rest.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
