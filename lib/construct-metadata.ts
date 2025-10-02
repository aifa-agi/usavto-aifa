// @/lib/construct-metadata.ts
// Comments in English: Dynamic page-level metadata with authors/creator/publisher included.

import { appConfig } from "@/config/appConfig";
import type { Metadata } from "next";

type ConstructArgs = {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  locale?: string;
  noIndex?: boolean;
};

function normalizePath(p?: string): string {
  if (!p) return "/";
  let s = String(p).trim();
  if (!s.startsWith("/")) s = `/${s}`;
  while (s.includes("//")) s = s.replace("//", "/");
  return s;
}

export function constructMetadata({
  title = appConfig.name,
  description = appConfig.description,
  image = appConfig.ogImage,
  pathname,
  locale = appConfig.seo?.defaultLocale ?? appConfig.lang,
  noIndex = false,
}: ConstructArgs = {}): Metadata {
  const base = appConfig.seo?.canonicalBase ?? appConfig.url;
  const path = normalizePath(pathname);
  const canonical = new URL(path, base).toString();

  const icons: NonNullable<Metadata["icons"]> = [
    appConfig.icons?.faviconAny && { url: appConfig.icons.faviconAny, rel: "icon", sizes: "any" },
    appConfig.icons?.icon32 && { url: appConfig.icons.icon32, type: "image/png", sizes: "32x32" },
    appConfig.icons?.icon48 && { url: appConfig.icons.icon48, type: "image/png", sizes: "48x48" },
    appConfig.icons?.icon192 && { url: appConfig.icons.icon192, type: "image/png", sizes: "192x192" },
    appConfig.icons?.icon512 && { url: appConfig.icons.icon512, type: "image/png", sizes: "512x512" },
    appConfig.icons?.appleTouch && { url: appConfig.icons.appleTouch, rel: "apple-touch-icon" },
  ].filter(Boolean) as NonNullable<Metadata["icons"]>;

  return {
    title,
    description,
    metadataBase: new URL(appConfig.url),
    alternates: { canonical },
    manifest: "/manifest.webmanifest",
    icons,

    // Authors / Creator / Publisher
    authors: [
      { name: "Roma Armstrong", url: "https://github.com/aifa-agi/aifa" },
    ],
    creator: "AIFA Open-Source Community",
    publisher: "AIFA",

    // Open Graph
    openGraph: {
      type: appConfig.og?.type ?? "website",
      title,
      description,
      url: canonical,
      siteName: appConfig.og?.siteName ?? appConfig.name,
      images: [
        {
          url: image,
          width: appConfig.og?.imageWidth ?? 1200,
          height: appConfig.og?.imageHeight ?? 630,
          alt: description,
        },
      ],
      locale: appConfig.og?.locale ?? `${locale}_${locale.toUpperCase()}`,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: appConfig.seo?.social?.twitter,
    },

    // Robots
    robots: {
      index: !noIndex && (appConfig.pageDefaults?.robotsIndex ?? true),
      follow: !noIndex && (appConfig.pageDefaults?.robotsFollow ?? true),
    },
  };
}
