import { PageData } from "@/app/@right/(_service)/(_types)/page-types";

export function getPageTitleSafe(page: PageData | null | undefined): string {
  const raw =
    page?.title ?? page?.metadata?.title ?? "Untitled Page";
  return typeof raw === "string" ? raw : String(raw);
}