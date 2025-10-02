// app/sitemap.ts
// Comments in English: Build sitemap from centralized config and content data.
// - Includes only public pages: role contains "guest" AND isPublished === true.
// - Excludes service routes listed in appConfig.seo.disallowPaths.
// - Uses absolute URLs from appConfig.url + href.
// - Sets lastModified from updatedAt || createdAt || current date.
// - Ready for Lighthouse and Google best practices.

import type { MetadataRoute } from "next";
import { appConfig } from "@/config/appConfig";
import { contentData } from "@/config/content/content-data";
import { PageData } from "./@right/(_service)/(_types)/page-types";

export const dynamic = "force-static"; // cacheable sitemap
export const revalidate = 3600; // revalidate every hour (adjust as needed)

// Helper: normalize and validate href
function isValidHref(href?: string): href is string {
  return typeof href === "string" && href.startsWith("/");
}

// Helper: join base URL and path safely
function absUrl(path: string): string {
  const base = appConfig.url.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

// Helper: resolve lastMod
function resolveLastMod(p: PageData): Date {
  const iso = p.updatedAt ?? p.createdAt;
  const d = iso ? new Date(iso) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

// Helper: check if page is public and not blocked
function isIndexablePage(p: PageData, disallow: string[]): boolean {
  const roleOk =
    Array.isArray(p.roles) && p.roles.includes("guest"); // role contains guest
  const publishedOk = p.isPublished === true;
  const hrefOk = isValidHref(p.href);
  const notBlocked =
    hrefOk && !disallow.some((rule) => p.href!.startsWith(rule));
  return roleOk && publishedOk && hrefOk && notBlocked;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Collect disallow rules from config
  const disallow = appConfig.seo.disallowPaths ?? [];

  // Flatten all pages from contentData.categories
  const pages: PageData[] = [];
  for (const cat of contentData.categories ?? []) {
    for (const page of cat.pages ?? []) {
      pages.push(page as PageData);
    }
  }

  // Filter only indexable pages
  const indexable = pages.filter((p) => isIndexablePage(p, disallow));

  // Map to sitemap entries
  const items: MetadataRoute.Sitemap = indexable.map((p) => ({
    url: absUrl(p.href!),
    lastModified: resolveLastMod(p),
    // Note: changeFrequency/priority are optional and mostly ignored by Google.
  }));

  // Ensure homepage exists (optional but recommended)
  if (!items.some((i) => i.url === absUrl("/"))) {
    items.unshift({
      url: absUrl("/"),
      lastModified: new Date(),
    });
  }

  return items;
}
