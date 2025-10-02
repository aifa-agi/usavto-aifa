// app/robots.ts
// Comments in English: Generate robots.txt from appConfig. Block specific service routes while allowing the rest.

import type { MetadataRoute } from "next";
import { appConfig } from "@/config/appConfig";

export const dynamic = "force-static"; // cacheable, stable for Lighthouse

export default function robots(): MetadataRoute.Robots {
  const isDisallowAll = appConfig.seo.indexing === "disallow";

  if (isDisallowAll) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: appConfig.seo.sitemapUrl,
    };
  }

  const disallow = appConfig.seo.disallowPaths ?? [];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: appConfig.seo.sitemapUrl,
  };
}
