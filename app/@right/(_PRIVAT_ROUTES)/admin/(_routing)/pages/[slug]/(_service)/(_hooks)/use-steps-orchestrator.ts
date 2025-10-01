// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_hooks)/use-steps-orchestrator.ts

"use client";

/**
 * Admin Steps Orchestrator Hook
 *
 * Key principles:
 * - This hook is admin-only and treats the server route as the single source of truth.
 * - It directly calls /api/menu/read for fresh data.
 * - The server decides the data source (Local FS in development, GitHub in production).
 * - We do NOT depend on any public provider for admin CRUD flows.
 *
 * What it provides:
 * - pageData: the current page data for the given slug
 * - isLoading, error: UI-ready states
 * - refreshPageData(): re-fetches categories from the server and resolves the page by slug
 * - updatePageDataField(): local optimistic field update (client-side only)
 * - updatePageData(): local optimistic full update (client-side only)
 * - syncPageDataToServer(): placeholder for actual persist logic (extend as needed)
 * - getOrchestratorStatus(): current readiness and meta for diagnostics
 *
 * Notes:
 * - All comments are in English as required.
 * - Replace lightweight types with your concrete PageData/MenuCategory types if available.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";

// Narrow types locally to avoid heavy imports or circular deps
type MenuPage = PageData & { id: string };
type MenuCategory = {
  id: string;
  title?: string;
  pages?: MenuPage[];
};

// Server route response shapes (mirror /api/menu/read contract)
interface ReadOk {
  success: true;
  message: string;
  categories: MenuCategory[];
  source?: "Local FileSystem" | "GitHub API";
  environment?: string;
}
interface ReadFail {
  success: false;
  message: string;
  source?: "Local FileSystem" | "GitHub API";
  environment?: string;
}

type ReadResponse = ReadOk | ReadFail;

async function readMenuFromServer(opts?: { filePath?: string }): Promise<ReadResponse> {
  // Always hit the server route. The server decides FS vs GitHub.
  const res = await fetch("/api/menu/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath: opts?.filePath }),
    cache: "no-store",
  });

  // Try to parse a JSON response; in case of parse error, emulate failure.
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    return {
      success: false,
      message: `Invalid JSON from server (HTTP ${res.status})`,
    };
  }

  // If HTTP error, normalize a fail shape
  if (!res.ok) {
    return {
      success: false,
      message: String(data?.message || `HTTP ${res.status}`),
      source: data?.source,
      environment: data?.environment,
    };
  }

  // On success path, ensure categories exist
  if (data?.success) {
    return {
      success: true,
      message: String(data?.message || "OK"),
      categories: Array.isArray(data?.categories) ? data.categories : [],
      source: data?.source,
      environment: data?.environment,
    };
  }

  // Server returned success:false
  return {
    success: false,
    message: String(data?.message || "Unknown server error"),
    source: data?.source,
    environment: data?.environment,
  };
}

export const useStepsOrchestrator = (slug: string) => {
  // Core state
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Diagnostics
  const lastSourceRef = useRef<string | undefined>(undefined);
  const lastEnvironmentRef = useRef<string | undefined>(undefined);
  const lastFetchTimeRef = useRef<number | null>(null);

  // Resolve page by slug from categories
  const resolvePageBySlug = useCallback(
    (categories: MenuCategory[], key: string): PageData | null => {
      if (!Array.isArray(categories) || !key) return null;
      for (const category of categories) {
        const found = category.pages?.find((p) => p.id === key);
        if (found) return found;
      }
      return null;
    },
    []
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);

      const resp = await readMenuFromServer();

      if (cancelled) return;

      if (resp.success) {
        lastSourceRef.current = resp.source;
        lastEnvironmentRef.current = resp.environment;
        lastFetchTimeRef.current = Date.now();

        const page = resolvePageBySlug(resp.categories, slug);
        if (page) {
          setPageData(page);
          setError(null);
        } else {
          setPageData(null);
          setError(`Page with slug "${slug}" not found`);
        }
        setIsLoading(false);
      } else {
        setPageData(null);
        setIsLoading(false);
        setError(resp.message || "Failed to load menu data");
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [slug, resolvePageBySlug]);

  // Refresh from server (FS in dev, GitHub in prod) and re-resolve page
  const refreshPageData = useCallback(async () => {
    if (!slug) return { ok: false as const, message: "Missing slug" };
    setIsLoading(true);
    setError(null);

    const resp = await readMenuFromServer();

    if (resp.success) {
      lastSourceRef.current = resp.source;
      lastEnvironmentRef.current = resp.environment;
      lastFetchTimeRef.current = Date.now();

      const page = resolvePageBySlug(resp.categories, slug);
      if (page) {
        setPageData(page);
        setIsLoading(false);
        return { ok: true as const, source: resp.source, environment: resp.environment };
      } else {
        setPageData(null);
        setIsLoading(false);
        const message = `Page with slug "${slug}" not found`;
        setError(message);
        return { ok: false as const, message, source: resp.source, environment: resp.environment };
      }
    } else {
      setIsLoading(false);
      setError(resp.message || "Failed to refresh menu data");
      return { ok: false as const, message: resp.message, source: resp.source, environment: resp.environment };
    }
  }, [slug, resolvePageBySlug]);

  // Local optimistic update of a single field
  const updatePageDataField = useCallback(
    <K extends keyof PageData>(field: K, value: PageData[K]) => {
      if (!pageData) return;
      const updated = { ...pageData, [field]: value };
      setPageData(updated);
      // No server sync here; call syncPageDataToServer for persistence
    },
    [pageData]
  );

  // Local optimistic full update
  const updatePageData = useCallback(
    (updater: (current: PageData | null) => PageData | null) => {
      const next = updater(pageData);
      if (next) {
        setPageData(next);
      }
    },
    [pageData]
  );

  // Placeholder for actual persistence (e.g., call your persist route, then refresh)
  const syncPageDataToServer = useCallback(
    async (updates: Partial<PageData>) => {
      if (!slug) return false;
      try {
        // TODO: implement actual persist call here (e.g., /api/menu/persist)
        // After successful persist, reload from the source of truth:
        // await refreshPageData();
        if (pageData) {
          setPageData({ ...pageData, ...updates });
        }
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sync error");
        return false;
      }
    },
    [slug, pageData /* , refreshPageData */]
  );

  // Orchestrator status and meta
  const getOrchestratorStatus = useCallback(() => {
    return {
      isReady: !isLoading && !error && !!pageData,
      hasData: !!pageData,
      slug,
      error,
      source: lastSourceRef.current,
      environment: lastEnvironmentRef.current,
      lastFetchTime: lastFetchTimeRef.current,
    };
  }, [isLoading, error, pageData, slug]);

  // Stable last fetch time for consumers that prefer a value
  const lastFetchTime = useMemo(() => lastFetchTimeRef.current ?? null, [pageData, isLoading, error]);

  return {
    // Data
    pageData,
    isLoading,
    error,

    // Controls
    refreshPageData,
    updatePageData,
    updatePageDataField,
    syncPageDataToServer,

    // Meta
    getOrchestratorStatus,
    lastFetchTime,

    // Escape hatch for legacy integrations
    setPageData,
  };
};
