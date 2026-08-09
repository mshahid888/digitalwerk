import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";

// Shared by app/(de)/opengraph-image.tsx and app/en/opengraph-image.tsx.
// Next.js discovers opengraph-image.tsx by file location per locale root
// (see those files), so the convention file itself can't be shared — only
// the image-generation logic can, kept here to avoid duplicating it.
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function buildOgImageResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1638",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 34,
            color: "#c3d7f8",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            width: 120,
            height: 6,
            borderRadius: 9999,
            background: "#22ab98",
          }}
        />
      </div>
    ),
    { ...ogImageSize }
  );
}
