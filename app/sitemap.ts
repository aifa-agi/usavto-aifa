// app/sitemap.ts
// Comments in English: Robust sitemap with nested content support and diagnostics.

import type { MetadataRoute } from "next";
import { appConfig } from "@/config/appConfig";
import { contentData } from "@/config/content/content-data";
import { PageData } from "./@right/(_service)/(_types)/page-types";

export const dynamic = "force-dynamic"; // for debugging freshness; switch back to "force-static" later
export const revalidate = 300; // 5 minutes; increase after validation

function isValidHref(href?: string): href is string {
  return typeof href === "string" && href.startsWith("/");
}

function absUrl(path: string): string {
  const base = appConfig.url.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

function resolveLastMod(p: PageData): Date {
  const iso = p.updatedAt ?? p.createdAt;
  const d = iso ? new Date(iso) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function isIndexablePage(p: PageData, disallow: string[]): boolean {
  const roleOk = Array.isArray(p.roles) && p.roles.includes("guest");
  const publishedOk = p.isPublished === true;
  const hrefOk = isValidHref(p.href);
  const notBlocked = hrefOk && !disallow.some((rule) => p.href!.startsWith(rule));
  return roleOk && publishedOk && hrefOk && notBlocked;
}

// NEW: robust extractor with nested support
type CatNode = {
  pages?: PageData[];
  items?: PageData[];
  entries?: PageData[];
  children?: CatNode[];
  sections?: CatNode[];
  [k: string]: any;
};

function extractAllPages(nodes: CatNode[] | undefined): PageData[] {
  if (!Array.isArray(nodes)) return [];
  const out: PageData[] = [];
  for (const node of nodes) {
    const pageArrays = [
      Array.isArray(node.pages) ? (node.pages as PageData[]) : [],
      Array.isArray(node.items) ? (node.items as PageData[]) : [],
      Array.isArray(node.entries) ? (node.entries as PageData[]) : [],
    ];
    for (const arr of pageArrays) out.push(...arr);

    const nextLevels = [
      Array.isArray(node.children) ? (node.children as CatNode[]) : [],
      Array.isArray(node.sections) ? (node.sections as CatNode[]) : [],
    ];
    for (const next of nextLevels) out.push(...extractAllPages(next));
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const disallow = appConfig.seo.disallowPaths ?? [];

  // Use robust extractor
  const allPages: PageData[] = extractAllPages((contentData as any).categories);

  // Optional diagnostics during debug
  // console.log("SITEMAP DEBUG", {
  //   categories: Array.isArray((contentData as any).categories) ? (contentData as any).categories.length : 0,
  //   totalPages: allPages.length,
  //   sample: allPages.slice(0, 2).map(p => ({ href: p.href, published: p.isPublished, roles: p.roles })),
  // });

  const indexable = allPages.filter((p) => isIndexablePage(p, disallow));

  const items: MetadataRoute.Sitemap = indexable.map((p) => ({
    url: absUrl(p.href!),
    lastModified: resolveLastMod(p),
  }));

  if (!items.some((i) => i.url === absUrl("/"))) {
    items.unshift({ url: absUrl("/"), lastModified: new Date() });
  }

  return items;
}
