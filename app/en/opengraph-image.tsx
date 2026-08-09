import { siteConfig } from "@/lib/site-config";
import {
  buildOgImageResponse,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og-image";

export const alt = siteConfig.name;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return buildOgImageResponse();
}
