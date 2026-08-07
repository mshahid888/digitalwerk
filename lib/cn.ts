import { twMerge } from "tailwind-merge";

type ClassValue = string | number | null | undefined | false;

export function cn(...classes: ClassValue[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
