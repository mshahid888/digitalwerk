import { Geist, Geist_Mono } from "next/font/google";

// Loaded once, shared by app/(de)/layout.tsx and app/en/layout.tsx — each
// locale group is its own root layout (see those files for why), but both
// need the same fonts applied to their own <html> element.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
